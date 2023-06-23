import React, { FC, ReactElement, useState, useEffect } from 'react';
import { useRouter } from 'next/router'

import s from './productDetails.module.scss'
import ProductTab from './ProductTab'
import GraphTab from './GraphTab'
import TableTab from './TableTab'
import OptionList from '../optionList/OptionList'
import GoBackSpecific from '../goBackSpecificRoute';
import { getDarkTheme, validateIsAnalyst, getHeader, IsCustomTheme, getTheme } from '../../utils/session-management';
import api from '../../utils/api'
import { getI18nLabel } from '../../i18n';
import { buildTheme } from '../../utils/theme';

type Props = {
  id: string,
  locale: string,
}

const ProductDetails: FC<Props> = (props) => {
  const { id, locale } = props;
  const router = useRouter();
  const { optionRender } = router.query;
  const [isAnalyst, setIsAnalyst] = useState(false);
  const [hasDarkTheme, setHasDarkTheme] = useState(false)

  const [state, setState] = useState({
    optionSelected: optionRender  ? 4 : 1 ,
    options: [
      {
        value: 1,
        label: getI18nLabel(locale, 'product.options.listPrice')
      },
      {
        value: 2,
        label: getI18nLabel(locale, 'product.options.unitaryPrice')
      },
      {
        value: 3,
        label: getI18nLabel(locale, 'product.options.priceHistory')
      },
      {
        value: 4,
        label: getI18nLabel(locale, 'product.options.detail')
      },
    ],
    nameErrorMsg: '',
    quantityErrorMsg: '',
    title: '',
  });

  useEffect(() => {
    const isCustom = IsCustomTheme();
    const hasDarkTheme = getDarkTheme() === '1' ? true : false;
    if (hasDarkTheme) {
        document.querySelector('body').classList.remove('custom')
        document.querySelector('body').classList.add('darkmode')
    } 
    
    if(isCustom) {
        const theme = getTheme();
        const currentTheme = buildTheme(theme);
        const style = document.createElement('style');
        style.innerHTML = currentTheme;
        document.body.appendChild(style);
        document.querySelector('body').classList.add('custom');
    }
    setIsAnalyst(validateIsAnalyst());
  }, [setIsAnalyst])

  useEffect(() => {
    if (optionRender) {
      setState({ ...state, optionSelected: 4 });
    }
  }, [optionRender]);

  const getTitle = async (productId) => {
    const res = await api.get(`api/product/${productId}`, { headers: getHeader() })
    const { data: { product: { name}} } = res;
    return name;
  }
  useEffect(() => {
    getTitle(id).then( (r) => setState({ ...state, title: r,  optionSelected: optionRender  ? 4 : 1  }))
  },[id, optionRender])

  return(
    <div className={s.container}>
      <h2>{`Producto: ${state.title}`}</h2>
      <GoBackSpecific route="/home/products" />
      <br />
      <OptionList options={state.options} onOptionSelected={(value) => setState({ ...state, optionSelected: value })} optionSelected={state.optionSelected} />
      {
        state.optionSelected === 1 &&
        <GraphTab id={id} locale={locale} priceField='price' />
      }
      {
        state.optionSelected === 2 &&
        <GraphTab id={id} locale={locale} priceField='unit_price' />
      }
      {
        state.optionSelected === 3 &&
        <TableTab id={id} locale={locale} />
      }
      {
        state.optionSelected === 4&&
        <ProductTab id={id} locale={locale} />
      }
    </div>
  )
}

export default ProductDetails;
