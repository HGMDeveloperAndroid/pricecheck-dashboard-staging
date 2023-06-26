import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import api from '../../utils/api'
import s from './products.module.scss'
import { getI18nLabel } from '../../i18n';
import { getDarkTheme, getHeader, getTheme, IsCustomTheme, getLocale } from '../../utils/session-management';
import { buildTheme } from '../../utils/theme';
import GraphReportTabCompare from '../reportGraphCompare'
import SmallOptionList from '../smallOptionList/OptionList'

const ProductsCompareComponent = (props) => {
  const { barcodes } = props;
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
    let name = '';
    const data = barcodes?.join(",")?.toString();
    const response = await api.get(`api/product/show`, { headers: getHeader(), params: { barcodes:  data.toString() }, })
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
      <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{`Productos: ${name}`}</span>
      <br />
      <SmallOptionList options={options} onOptionSelected={(value) => setOptionSelected(value)} optionSelected={optionSelected}  />
      {
        optionSelected === 1 &&
        <GraphReportTabCompare priceField='price' barcodes={barcodes} />
      }
      {
        optionSelected === 2 &&
        <GraphReportTabCompare priceField='unit_price' barcodes={barcodes} />
      }
    </div>
  )
}

export default ProductsCompareComponent;
