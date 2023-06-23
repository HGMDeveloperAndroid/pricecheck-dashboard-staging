import Router, { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import { Header } from '../../../components/header';
import Head from 'next/head';
import styles from './newCatalogs.module.scss'
import PageTitle from '../../../components/pageTitle/PageTitle';
import UsersCatalog from '../../../components/users';
import BrandsCatalog from '../../../components/brandsCatalog';
import UnitsCatalog from '../../../components/unitsCatalog';
import GroupCatalog from '../../../components/groupsCatalog';
import LineCatalog from '../../../components/linesCatalog';
import ChainCatalog from '../../../components/chainsCatalog';
import RegionCatalog from '../../../components/regionCatalog';
import Modal from '../../../components/modal/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog
} from '@fortawesome/free-solid-svg-icons'
import ColorsForm from '../../../components/colorsForm/index';
import { getDarkTheme, getTheme, IsCustomTheme, validateIsAdmin } from '../../../utils/session-management';
import { buildTheme } from '../../../utils/theme';



import {getI18nLabel} from '../../../i18n'
import { getLocale } from '../../../utils/session-management'

const NewCatalogs = () => {
  const [selected, setSelected] = useState(0)
  const [showModal, setShowModal] = useState(false);
  const locale = getLocale()
  const [isAdmin, setIsAdmin] = useState(false)

	const { NODE_ENV } = process.env;

	// test will be used as an alias for whitelabel
	const isWhiteLabel = NODE_ENV === 'test' || NODE_ENV === 'development';

  useEffect(() => {
    setIsAdmin(validateIsAdmin())
    const isCustom = IsCustomTheme();
    const hasDarkTheme = getDarkTheme() === '1' ? true : false;
    if (hasDarkTheme) {
      document.querySelector('body').classList.remove('custom')
      document.querySelector('body').classList.add('darkmode')
    }

    if (isCustom) {
      const theme = getTheme();
      const currentTheme = buildTheme(theme);
      const style = document.createElement('style');
      style.innerHTML = currentTheme;
      document.body.appendChild(style);
      document.querySelector('body').classList.remove('darkmode')
      document.querySelector('body').classList.add('custom');
    }
  })

    const radioMap = [
        {
            id: 'brands',
            value: 0,
            label: getI18nLabel(locale, 'catalogs.options.brands'),
            checked: selected === 0
        },
        {
            id: 'unities',
            value: 1,
            label: getI18nLabel(locale, 'catalogs.options.unities'),
            checked: selected === 1
        },
        {
            id: 'groups',
            value: 2,
            label: getI18nLabel(locale, 'catalogs.options.groups'),
            checked: selected === 2
        },
        {
            id: 'lines',
            value: 3,
            label: getI18nLabel(locale, 'catalogs.options.lines'),
            checked: selected === 3
        },
        {
            id: 'chain',
            value: 4,
            label: getI18nLabel(locale, 'catalogs.options.chain'),
            checked: selected === 4
        },
        {
            id: 'region',
            value: 5,
            label: getI18nLabel(locale, 'catalogs.options.region'),
            checked: selected === 5
        },
        {
            id: 'users',
            value: 6,
            label: getI18nLabel(locale, 'catalogs.options.users'),
            checked: selected === 6
        },
  ];

  const renderOption = (option: number) => {
    switch (option) {
      case 0:
        return <BrandsCatalog locale={locale}/>
      case 1:
        return <UnitsCatalog locale={locale}/>
      case 2:
        return <GroupCatalog locale={locale}/>
      case 3:
        return <LineCatalog locale={locale}/>
      case 4:
        return <ChainCatalog locale={locale}/>
      case 5:
        return <RegionCatalog locale={locale}/>
      case 6:
        return <UsersCatalog locale={locale}/>
      default:
        return ''
    }
  }

  return (
    <>
      <Header />

      <Head>
        <title>{getI18nLabel(locale, 'catalogs.title')}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.itemList}>
          <PageTitle title={getI18nLabel(locale, 'catalogs.title')} />
          {
            radioMap.map((item: any) => (
              <div key={`id-${item.id}-${item.value}`} className={styles.formContainer}>

                <input
                  id={item.id}
                  className={styles.labelRadio}
                  value={item.value}
                  checked={item.checked}
                  name={item.id}
                  type="radio"
                  onChange={(e) => {
                    setSelected(parseInt(e.target.value, 10));
                  }} />
                <label className={styles.labelRadio}>{item.label}</label>
              </div>
            ))
          }
          <hr />
          {(isAdmin && isWhiteLabel) && (
            <button className="btn btn-theme" type="button" onClick={() => setShowModal(!showModal)}>
              <FontAwesomeIcon icon={faCog} />
              <span className="px-2">Ajustes</span>
            </button>
          )}
          <Modal showModal={showModal} closeModal={() => setShowModal(false)}>
            <ColorsForm closeModal={() => setShowModal(false)} />
          </Modal>
        </div>
        <div className={styles.productData}>
          {
            renderOption(selected)
          }
        </div>
      </div>
    </>
  );
}

export default NewCatalogs;
