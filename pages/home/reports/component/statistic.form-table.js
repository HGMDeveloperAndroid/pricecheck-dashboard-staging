import React, { PureComponent } from 'react'

import { PrimaryButton, SecondaryButton } from '../../../../components/buttons';

import styles from '../statistic.module.scss';

const onlyNumbersHandler = (event) => {
    const { value } = event.target;
    const code = event.which ? event.which : event.keyCode

    if (code > 31 && (code < 48 || code > 57)) {
        event.preventDefault();
        return false;
    }

    return true;
}

const FormTable = (props) => {
    let {chains, products} = props;

    chains = chains && chains.length ? chains : [];
    products = products && products.length ? products : [];

    return (
        <React.Fragment>
            <table className={styles.reportTable}>
                <thead>
                    <tr>
                        <th>
                            Código de barras
                        </th>
                        <th>
                            Producto
                        </th>
                        {chains.map((chain, index) => (
                            <th key={index}>
                                {chain.name}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {products.map((product, index) => (
                        <tr key={index}>
                            <td>
                                {product.barcode}
                            </td>
                            <td>
                                {product.description}
                            </td>
                            {chains.map((field, index) => (
                                <td key={index}>
                                    <input
                                        type='text'
                                        className='barcode-input'
                                        onKeyPress={onlyNumbersHandler}
                                        onChange={props.barcodeFieldHandler}
                                        data-index={index}
                                        data-barcode={product.barcode}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <ul className={styles.filterOptions}>
                <li>
                    <SecondaryButton
                        label='cancelar'
                        onClick={props.clearBarcodes}
                    />
                </li>
                <li>
                    <PrimaryButton
                        label='guardar y cerrar'
                        onClick={props.getEquivalences}
                    />
                </li>
            </ul>
        </React.Fragment>
    );
};

export default FormTable;
