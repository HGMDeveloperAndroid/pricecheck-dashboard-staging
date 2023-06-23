import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { toast, ToastContainer } from 'react-nextjs-toast'
import { IsCustomTheme, getDarkTheme, getTheme, getLocale, validateSession, getHeader } from '../../../utils/session-management'
import { buildTheme } from '../../../utils/theme';
import { getI18nLabel } from '../../../i18n'
import { Header } from '../../../components/header'
import Datepicker from '../../../components/datepicker/datepicker';
import Input from '../../../components/input/Input';
import {
  faSearch,
} from '@fortawesome/free-solid-svg-icons'
import { PrimaryButton, SecondaryButton } from '../../../components/buttons';
import styles from './product-report.module.scss';
import SingleProductCard from '../../../components/singleProductCard';
import Loader from '../../../components/loader/Loader';
import api from '../../../utils/api';
import { getBrandsCatalog, getGroupsCatalog, getLinesCatalog, getStoresCatalog, getUnitsCatalog } from '../../../utils/catalogs'
import Select from '../../../components/select/Select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { optionsParams } from '../../../constants/products';
import { format } from 'date-fns';
import { formatDate } from '../../../utils/reports';
import ProductsCompareComponent from '../../../components/compareReport';
import { Checkbox } from '../../../components/checkbox';

const ProductReport = () => {
  useEffect(() => {
    const hasDarkTheme = getDarkTheme() === '1' ? true : false;
    const isCustom = IsCustomTheme();

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
      document.querySelector('body').classList.add('custom');
    }

    validateSession()
  }, [])

  const locale = getLocale()
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [search, setSearch] = useState('');
  const [productsId, setProductsId] = useState([]);
  const [barcodes, setBarcodes] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState(false);
  const [filterSelected, setFilterSelected] = useState('0');
  const [catalogSelected, setCatalogSelected] = useState([]);
  const [filterListSelected, setFilterListSelected] = useState([]);
  const [expand, setExpand] = useState(true);
  const [errorDate, setErrorDate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [catalogs, setCatalogs] = useState({
    unitsCatalog: [],
    brandsCatalog: [],
    storesCatalog: [],
    linesCatalog: [],
    groupsCatalog: [],
  })
  const [checked, setChecked] = useState(null);
  const buildFilterData = (arr: any, option: string) => {
    return arr && arr.filter(
      (i: any) => i.option === option
    )
  }
  const buildFilters = () => {
    const data: {
      textSearch?: string,
      from?: any,
      to?: any,
      brand?: Array<string>,
      group?: Array<string>,
      line?: Array<string>,
      chain?: Array<string>,
      unit?: Array<string>,
      items?: any,
      type?: string | null,
    } = {}

    const brandList = buildFilterData(filterListSelected, 'brandsCatalog');
    const groupList = buildFilterData(filterListSelected, 'groupsCatalog');
    const lineList = buildFilterData(filterListSelected, 'linesCatalog');
    const storeList = buildFilterData(filterListSelected, 'storesCatalog');
    const unitList = buildFilterData(filterListSelected, 'unitsCatalog');
    if (search.length > 0) {
      data.textSearch = search
    }
    if (from) {
      data.from = formatDate(from);
    }
    if (to) {
      data.to = formatDate(to);
    }
    if (brandList.length > 0) {
      data.brand = brandList.map(b => b.value)
    }
    if (groupList.length > 0) {
      data.group = groupList.map(b => b.value)
    }
    if (lineList.length > 0) {
      data.line = lineList.map(b => b.value)
    }

    if (storeList.length > 0) {
      data.chain = storeList.map(b => b.value)
    }
    if (unitList.length > 0) {
      data.unit = unitList.map(b => b.value)
    }
    if (checked) {
      data.type = checked;
  }

    return data
  }

  const fromDateHandler = (date: any) => {
    setFrom(date)
  }
  const toDateHandler = (date: any) => {
    setTo(date)
  }
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const getResults = async () => {
    if (from > to) {
      setErrorDate(true);
      return null;
    } else {
      setErrorDate(false);
      setBarcodes([])
      await setProductsId([]);
      setLoading(true);
      api.get(`/api/reports/products-analyst`, { headers: getHeader(), params: buildFilters() }).then(async (res) => {
        setProducts(getCheckedProducts(res?.data?.data));
        setLoading(false);
      });
    }
  };

  const handleCheckedProducts = async (row: { id: number, barcode: string }) => {
    setIsOpen(false);
    const selectedProductsId: number[] = [...productsId];
    let selectedProductsBarcodes: string[] = [...barcodes];
    const indexSelectedItem = selectedProductsId.indexOf(row.id);
    const product = [...products]
    const selectedProduct = product.find(product => product.id === row.id)
    if (indexSelectedItem > -1) {
      selectedProductsId.splice(indexSelectedItem, 1)
      selectedProductsBarcodes = selectedProductsBarcodes.filter(item => item !== selectedProduct.barcode);
      selectedProduct.checked = false
    }

    else {
      selectedProductsId.push(row.id)
      selectedProductsBarcodes.push(row.barcode)
      selectedProduct.checked = true
    }
    await setProductsId(selectedProductsId);
    await setProducts(product);
    await setBarcodes(selectedProductsBarcodes);
  }
  const getCheckedProducts = (products: any[]) => {
    if (productsId.length > 0) {
      products.forEach(el => {
        const productChecked = productsId.find(
          item => item === el.id
        )
        el.checked = false
      })
    }
    return products
  }
  const getMyList = async () => {
    setLoading(true);
    await setProductsId([]);
    await api.get(`/api/reports/products-list`, { headers: getHeader() }).then(async (res) => {
      setProducts(getCheckedProducts(res?.data?.data));
      setLoading(false);
    });
  }
  const deleteFromMyList = () => {
    const payload = {
      products: productsId,
    }
    api.delete(`/api/list-products`, { headers: getHeader(), data: payload }).then(async (res) => {
      renderToast(
        'productReport.successDelete', 'productReport.title', 'success'
      )
      await getMyList();
    }).catch(() => {
      renderToast(
        'productReport.errorDelete', 'productReport.title', 'error'
      )
    })
  }
  const handleMyList = async () => {
    setList(!list)
    if (!list) {
      setIsOpen(false);
      await setProductsId([]);
      await setBarcodes([]);
      await getMyList();
    } else {
      await setIsOpen(false);
      await setProductsId([]);
      await setBarcodes([]);
      await setProducts([]);
    }
  }

  const renderToast = (message, title, type) => {
    toast.notify(getI18nLabel(locale, message), {
      title: getI18nLabel(locale, title),
      duration: 6,
      type,
    })
  };
  const postProductsToMyList = () => {
    const payload = {
      products: productsId,
    }
    api.post(`/api/list-products`, payload, { headers: getHeader() }).then(async (res) => {
      renderToast(
        'productReport.saveProducts', 'productReport.title', 'success'
      )
    }).catch(() => {
      renderToast(
        'productReport.saveProductsError', 'productReport.title', 'error'
      )
    })
  }
  const getCatalogs = async () => {
    const fetchers = [
      getUnitsCatalog(),
      getBrandsCatalog(),
      getStoresCatalog(),
      getLinesCatalog(),
      getGroupsCatalog(),
    ]
    const catalogResponse = await Promise.all(fetchers);

    setCatalogs({
      unitsCatalog: catalogResponse[0],
      brandsCatalog: catalogResponse[1],
      storesCatalog: catalogResponse[2],
      linesCatalog: catalogResponse[3],
      groupsCatalog: catalogResponse[4],
    });
  };
  const getCorrectCatalog = async (optionSelected: string) => {
    let selectedCatalog: Array<{ value: any, label: string }> = catalogs[optionSelected]
    const filtered = optionSelected || '0';
    setCatalogSelected(selectedCatalog);
    setFilterSelected(filtered);
  };

  const getCorrectOption = async (value: string) => {
    const filteredList: any = filterListSelected

    const optionSelected = catalogSelected.filter(
      (e: { value: string }) => e.value == value
    )
    if (optionSelected.length > 0) {
      filteredList.push({
        option: filterSelected,
        value,
        label: optionSelected[0].label
      })
    }
    await setFilterListSelected(filterListSelected);
    await setFilterSelected('0');
    await setCatalogSelected([]);
  };
  useEffect(() => {
    getCatalogs();
  }, [])
  const deleteDynamicFilter = (value: any) => {
    const filtered = filterListSelected.filter(
      (el: { value: any }) => value != el.value
    )
    setFilterListSelected(filtered);
  }
  const getLabelParam = () => {
    const options = optionsParams.map((option) => {
      option.label = getI18nLabel(locale, `products.optionsCatalog.${option.value}`)

      return option
    })
    return options;
  }
  const getCatalog = () => {
    return catalogSelected.sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
  }
  const clearParams = async () => {
    await setSearch('');
    await setFilterListSelected([]);
    await setTo('');
    await setFrom('');
    await setFilterSelected('0');
    await setErrorDate(false);
    setProducts([])
    setChecked(null)
    setProductsId([])
    setBarcodes([])
  }

  const dataForPickers = [
    { selected: from, onSelected: fromDateHandler, placeholder: getI18nLabel(locale, 'productReport.startDate') },
    { selected: to, onSelected: toDateHandler, placeholder: getI18nLabel(locale, 'productReport.endDate') }
  ];
  const dataForSelects = [
    { default: filterSelected, change: (e) => getCorrectCatalog(e), label: getI18nLabel(locale, 'productReport.parameter'), options: getLabelParam() },
    { default: '0', change: (e) => getCorrectOption(e), label: getI18nLabel(locale, 'productReport.values'), options: getCatalog() }
  ];
  const download = (res: any, type = 'text/csv;charset=utf-8;', extension = 'csv') => {
    const url = window.URL.createObjectURL(
      new Blob(["\ufeff", res], {
        type,
      }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `products-report-${format(new Date(), 'MM-dd-yyyy-HH:mm')}.${extension}`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const downloadData = async () => {
    try {
      const getDownloadData = buildFilters();

      if (productsId.length > 0) {
        getDownloadData.items = productsId
      }

      const response = await api.get(
        `/api/reports/products-csv-analyst`,
        {
          headers: getHeader(),
          params: getDownloadData,
          responseType: 'arraybuffer',
        }
      )

      if (response.status === 200) {
        download(response.data);
        renderToast(
          'productReport.successDownload', 'productReport.title', 'success'
        );
      }
    } catch (e) {
      renderToast(
        'productReport.errorDownload', 'productReport.title', 'error'
      );
    }
  }
  const buildGraphic = () => {
    setIsOpen(!isOpen);
  }
  return (
    <>
      <Header locale={locale} />

      <Head>
        <title>
          {getI18nLabel(locale, 'productReport.title')}
        </title>
      </Head>
      <div className="p-3">
        <div className={`d-flex justify-content-between py-3 px-3 w-100 ${styles['items-center']}`}>
          <h3 className="d-flex justify-content-start py-3 px-3">{getI18nLabel(locale, 'productReport.title')}</h3>
          {
            errorDate && (
              <span style={{ color: 'red' }}>La fecha de inicio deber ser menor a la fecha de fin.</span>
            )
          }
        </div>
        <form onKeyPress={(e) => {e.key === 'Enter' && getResults(); }}>
          <div className="d-flex  py-1 px-5 w-100 justify-content-between">

            <div className="p-2 w-25">
              <span>{getI18nLabel(locale, 'productReport.selected')}</span>
              <div className={`w-100 p-3 ${styles.wrapperSelected}`}>
                {
                  products && products.length > 0 && products.filter(item => (
                    productsId.includes(item.id)
                  )).map((item, index) =>
                    <span className="d-flex flex-column" key={`item-selected-${item.id}-${index + 1}`}>{`${item.product} - ${item.barcode}`}</span>
                  )
                }
                {
                  productsId && productsId.length <= 0 && (
                    <span>{getI18nLabel(locale, 'productReport.noSelected')}</span>
                  )
                }
              </div>
            </div>
            <div className="p-2 width30 d-flex flex-column">
              <span className="py-1">{getI18nLabel(locale, 'productReport.newSerach')}</span>
              <Input placeholderOverLabel={true} onChange={handleSearch} defaultValue={search} placeholder={getI18nLabel(locale, 'productReport.nameOrCode')} icon={faSearch} type="text" bgColor="transparent" />
              <div className="d-flex pt-2">
                <Checkbox
                  label="MC"
                  checked={checked === 'MC'}
                  onChange={() => setChecked(checked === 'MC' ? null : 'MC')}
                />
                <div className="ml-5">
                  <Checkbox
                    label="MP"
                    checked={checked === 'MP'}
                    onChange={() => setChecked(checked === 'MP' ? null : 'MP')}
                  />
                </div>
              </div>
            </div>
            <div className="d-flex width40 justify-content-between">
              <div className="d-flex flex-column p-2">
                <div className="mt-4 d-flex">
                  {
                    dataForPickers.map((item: any, index) => (
                      <div key={`item-${index + 1}`} className="px-2 width50">
                        <Datepicker
                          isLabel={false}
                          selected={item.selected}
                          onSelect={item.onSelected}
                          placeholder={item.placeholder}
                          dateFormat='dd/MM/yyyy'
                        />
                      </div>
                    ))
                  }
                </div>
                <div className="d-flex mt-3">
                  {
                    dataForSelects.map((item: any, index) => (
                      <div key={`item-${index + 1}`} className="px-2 width50">
                        <Select
                          noLabel
                          defaultOption={item.default}
                          label={item.label}
                          onChange={(e: any) => item.change(e.target.value)}
                          options={item.options}
                        />
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className="p-3 d-flex flex-column justify-content-between w-50">
                <div className="p-1">
                  <PrimaryButton label={getI18nLabel(locale, 'productReport.search')} onClick={getResults} />
                </div>
                <div className="p-1">
                  <SecondaryButton label={getI18nLabel(locale, 'productReport.deleteFilters')} onClick={clearParams} />
                </div>
              </div>
            </div>
          </div>
        </form>
        {
          filterListSelected && filterListSelected.length > 0 && (
            <>
              <div className={`d-flex px-3 ${styles['items-center']} justify-content-end`}>
                <button onClick={() => setExpand(!expand)} className={`${styles.btnToggle}`}>
                  <span className={`${styles['font-bold']}`}>Filtros Seleccionados:</span>
                  <div className="pl-2" style={{ fontSize: '18px' }}>
                    <FontAwesomeIcon
                      style={{ cursor: 'pointer', transform: expand ? 'rotate(360deg)' : 'rotate(180deg)' }}
                      icon={faChevronDown}
                    />
                  </div>
                </button>
              </div>
              {
                expand && (
                  <div className={`${styles.tags} mx-3`}>
                    {
                      filterListSelected.map((f, i) => {
                        const optionObj = getLabelParam().filter(
                          (o) => o.value === f.option
                        )

                        return (
                          <div key={`${f.value}-item-${i + 1}`} className={styles.tag}>
                            <span>
                              {optionObj && optionObj[0] ? optionObj[0].label : ''} - {f.label}
                            </span>
                            <FontAwesomeIcon
                              style={{ cursor: 'pointer' }}
                              onClick={() => deleteDynamicFilter(f.value)}
                              icon={faTimes}
                            />
                          </div>
                        )
                      })
                    }
                  </div>
                )
              }
            </>
          )
        }
        <div className="d-flex justify-content-between w-100 p-3">
          <div className="width70 d-flex justify-content-between">
            <div className="d-flex justify-content-between">
              <div className="px-2 py-1">
                <SecondaryButton label={list ? getI18nLabel(locale, 'productReport.generalSearch') : getI18nLabel(locale, 'productReport.myList')} onClick={handleMyList} />
              </div>
              {
                !list && (
                  <div className="px-2 py-1">
                    <PrimaryButton label={getI18nLabel(locale, 'productReport.saveList')} onClick={postProductsToMyList} />
                  </div>
                )
              }
            </div>
            <div className="d-flex justify-content-between">
              <div className="px-2">
                <SecondaryButton label={getI18nLabel(locale, 'productReport.download')} onClick={downloadData} />
              </div>
              <div className="px-2">
                <PrimaryButton label={isOpen ? getI18nLabel(locale, 'productReport.clearGraphic') : getI18nLabel(locale, 'productReport.graphic')} disabled={barcodes && barcodes.length <= 0} onClick={buildGraphic} />
              </div>
              {
                list && (
                  <div className="px-2">
                    <PrimaryButton label={getI18nLabel(locale, 'productReport.deleteFromList')} onClick={deleteFromMyList} />
                  </div>
                )
              }
            </div>
          </div>
        </div>
        <div className="d-flex w-100 pt-3 justify-content-between">
          <div className="width50 m-1">
            <div className={`${styles.divContent} ${styles.shadow}`}>
              {
                loading && (
                  <Loader show={loading} />
                )
              }

              {
                !loading && products && products.length > 0 && (
                  <>
                    {
                      products.map((item, index) => (
                        <SingleProductCard locale={locale} key={`${item.product}-${index + 1}`} row={item} onChangeRadio={(row: any) => handleCheckedProducts(row)} brandCatalog={catalogs.brandsCatalog} />
                      ))
                    }
                  </>
                )
              }
              {
                !loading && products && products.length <= 0 && (
                  <div className={`d-flex flex-column justify-content-center w-100 p-3 ${styles['text-center']}`}>
                    <div className="d-flex justify-content-center" >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" className={styles.icon}>
                        <path d="M576 216v16c0 13.255-10.745 24-24 24h-8l-26.113 182.788C514.509 462.435 494.257 480 470.37 480H105.63c-23.887 0-44.139-17.565-47.518-41.212L32 256h-8c-13.255 0-24-10.745-24-24v-16c0-13.255 10.745-24 24-24h67.341l106.78-146.821c10.395-14.292 30.407-17.453 44.701-7.058 14.293 10.395 17.453 30.408 7.058 44.701L170.477 192h235.046L326.12 82.821c-10.395-14.292-7.234-34.306 7.059-44.701 14.291-10.395 34.306-7.235 44.701 7.058L484.659 192H552c13.255 0 24 10.745 24 24zM312 392V280c0-13.255-10.745-24-24-24s-24 10.745-24 24v112c0 13.255 10.745 24 24 24s24-10.745 24-24zm112 0V280c0-13.255-10.745-24-24-24s-24 10.745-24 24v112c0 13.255 10.745 24 24 24s24-10.745 24-24zm-224 0V280c0-13.255-10.745-24-24-24s-24 10.745-24 24v112c0 13.255 10.745 24 24 24s24-10.745 24-24z"/>
                      </svg>
                    </div>
                    <h3>{getI18nLabel(locale, 'productReport.emptyState')}</h3>
                  </div>
                )
              }
            </div>
          </div>
          <div className="width50 m-1 h-25" style={{ overflowX: 'scroll' }}>
            {
              !isOpen && (
                <div className={`d-flex flex-column justify-content-center w-100 p-3 ${styles['text-center']}`}>
                  <div className="d-flex justify-content-center" >
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <h3>{getI18nLabel(locale, 'productReport.emptGraphyState')}</h3>
                </div>
              )
            }
            {
              isOpen && barcodes && barcodes.length <= 0 && (
                <div className={`d-flex flex-column justify-content-center w-100 p-3 ${styles['text-center']}`}>
                  <div className="d-flex justify-content-center" >
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <h3>{getI18nLabel(locale, 'productReport.emptGraphyState')}</h3>
                </div>
              )
            }
            {
              isOpen && barcodes && barcodes.length > 0 && (
                <div style={{ width: '100%' }}>
                  <ProductsCompareComponent barcodes={barcodes} />
                </div>
              )
            }
          </div>
        </div>
      </div>
      <ToastContainer align="left" position="bottom" />
    </>
  )
}

export default ProductReport;

