import React, { Component } from 'react';

import Modal from "../modal/Modal";
import s from './productDetails.module.scss'
import { SecondaryButton } from '../buttons';
import api from '../../utils/api';
import { getHeader } from '../../utils/session-management';
import formatDate from '../../utils/format-date';
import { getI18nLabel } from '../../i18n';

type Props = {
    id: string,
    locale?: string,
}

type State = {
    stores: any,
    historyDetails: any,
    showModal: boolean,
}

type Price = {
    price: string,
    capture_date: string,
}

class TableTab extends Component<Props, State> {

    state = {
        stores: [],
        historyDetails: {
            storeName: '',
            data: [],
        },
        showModal: false,
    }

    async componentDidMount() {
        await this.loadData()
    }

    loadData = async () => {
        try {
            const requestOptions = {
                headers: getHeader(),
            };

            const response = await api.post(`api/reports/history-summary/${this.props.id}`, {}, {headers: getHeader()});
            if (response.status === 200) {
                const stores = [];

                for (let i = 0; i < response.data.length; i++) {
                    const { summary } = response.data[i];

                    const store = stores.find((store) => (
                        store.storeName.toLowerCase() == summary.storeName.toLowerCase()
                    ));

                    if (!store) {
                        stores.push({
                            storeName: summary.storeName,
                            stores: [summary]
                        });
                    } else {
                        store.stores.push(summary)
                    }
                }

                this.setState({
                    stores,
                })
            }
        } catch (error) {
            // TODO: Mensaje de error
            console.log(error);
        }
    }

    handleModal = async (store) => {
        try {
            const requestOptions = {
                headers: getHeader(),
            };
            const request = {
                store_id: store.storeId,
                store: store.storeName,
                barcode: this.props.id,
        };
            const response = await api.post('api/reports/history-details', request, requestOptions);
            if (response.status === 200) {
                const { data: { data } } = response;

                this.setState({
                    historyDetails: {
                        storeName: store.storeName,
                        data,
                    },
                    showModal: true,
                });
            }
        } catch (error) {
            // TODO: Mensaje de error
            console.log(error);
        }
    }

    toggleModal = () => {
        this.setState({showModal: !this.state.showModal});
    }

    render() {
        const { historyDetails, showModal, stores } = this.state
        const { locale } = this.props

        return (
            <div className={s.tableContainer}>
                {stores.map((store, index) => (
                    <div className={s.pricesContainer} key={index}>
                        <div key={store.storeId} className={s.price}>
                            <h4 className={s.title}>{store.storeName}</h4>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">{getI18nLabel(locale, 'tableTab.table.headers.branchOffice')}</th>
                                        <th scope="col">{getI18nLabel(locale, 'tableTab.table.headers.minPrice')}</th>
                                        <th scope="col">{getI18nLabel(locale, 'tableTab.table.headers.maxPrice')}</th>
                                        <th scope="col">{getI18nLabel(locale, 'tableTab.table.headers.currentPrice')}</th>
                                        <th scope="col">{getI18nLabel(locale, 'tableTab.table.headers.averagePrice')}</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {store.stores.map((store, index) => (
                                        <tr key={index}>
                                            <th scope="row">{store.storeId}</th>
                                            <td>${store.min.price}</td>
                                            <td>${store.max.price}</td>
                                            <td>${store.current.price}</td>
                                            <td>${store.average}</td>
                                            <td>
                                                <SecondaryButton noBorder label={getI18nLabel(locale, 'tableTab.table.options.seeHistory')} onClick={() => this.handleModal(store)} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
                <Modal showModal={showModal}>
                    <div className='row justify-content-center modal-history-details-content'>
                        <div className='col-12'>
                            <h1>{historyDetails.storeName}</h1>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">{getI18nLabel(locale, 'tableTab.modal.table.headers.scan')}</th>
                                        <th scope="col">{getI18nLabel(locale, 'tableTab.modal.table.headers.capturedAt')}</th>
                                        <th scope="col">{getI18nLabel(locale, 'tableTab.modal.table.headers.price')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyDetails.data.map((scan, index) => (
                                        <tr key={index}>
                                            <th scope="row">{scan.scan}</th>
                                            <td>{scan.capture_day}</td>
                                            <td>${scan.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className='col-6 my-5'>
                            <SecondaryButton label={getI18nLabel(locale, 'tableTab.modal.options.close')} onClick={this.toggleModal} />
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default TableTab;
