import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import GoBack from '../../../components/goBack/GoBack'
import OptionList from '../../../components/optionList/OptionList'
import GraphTabCompare from '../../../components/productCompareDetails/GraphTabCompare'
import api from '../../../utils/api'
import s from './products.module.scss'
import { getI18nLabel } from '../../../i18n';
import { getDarkTheme, getHeader, getTheme, IsCustomTheme, getLocale } from '../../../utils/session-management'
import TableTabCompare from '../../../components/productCompareDetails/TableTabCompare'
import GoBackSpecific from '../../../components/goBackSpecificRoute/index';
import { buildTheme } from '../../../utils/theme';

const ProductsComparePage = () => {

  const router = useRouter();
  const [optionSelected, setOptionSelected] = useState(1)
  const [hasDarkTheme, setHasDarkTheme] = useState(false)
  const [name, setName] = useState('')
  const locale = getLocale()

  const [options, setOptions] = useState([
    {
      value: 1,
      label: getI18nLabel(locale, 'graphTabCompare.tabs.headers.priceList'),
    },
    {
      value: 2,
      label: getI18nLabel(locale, 'graphTabCompare.tabs.headers.unitaryPrice'),
    },
    {
      value: 3,
      label: getI18nLabel(locale, 'graphTabCompare.tabs.headers.history'),
    },
  ])

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
    getTitle().then(res => setName(res))
  }, [])


  const getTitle = async () => {
    const params = {}
    let name = '';
    params['barcodes'] = window.location.href.split('?barcodes=')[1]
    const response = await api.get(`api/product/show`, { headers: getHeader(), params, })
    const rowLen = response && response.data && response.data.products.length;
    response && response.data && response.data.products.map((obj, i) => {
      if (rowLen === i + 1) {
        name = name + `${obj.name}`
      } else {
        name = name + `${obj.name} / `
      }

    })

    return name;
  }

  return (
    <div className={s.container}>
      <h4>{`Productos: ${name}`}</h4>
      <GoBackSpecific route="/home/products" />
      <br />
      <OptionList options={options} onOptionSelected={(value) => setOptionSelected(value)} optionSelected={optionSelected} />
      {
        optionSelected === 1 &&
        <GraphTabCompare priceField='price' />
      }
      {
        optionSelected === 2 &&
        <GraphTabCompare priceField='unit_price' />
      }
      {
        optionSelected === 3 &&
        <TableTabCompare />
      }
    </div>
  )
}

export default ProductsComparePage
