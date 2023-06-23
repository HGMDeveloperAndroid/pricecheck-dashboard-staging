import React from 'react';
import { photoUrl } from '../../utils/photo_url';
import { Checkbox } from '../checkbox';
import styles from './card.module.scss';
import { getI18nLabel } from '../../i18n/index';

const SingleProductCard = (props) => {
  const { onChangeRadio, row, brandCatalog, locale } = props;
  const getBrand = (catalog, id) => {
    const result = catalog.find( item => item.value === id.toString() );
    return result?.label;
  }
  const buildFirstColumn = [
    { label:  getI18nLabel(locale, 'productReport.card.barcode'), value: row?.barcode },
    { label:  getI18nLabel(locale, 'productReport.card.name'), value: row?.product },
    { label:  getI18nLabel(locale, 'productReport.card.brand'), value: getBrand(brandCatalog, row?.id_brand)},
    { label:  getI18nLabel(locale, 'productReport.card.type'), value: row?.type},
  ];
  const buildSecondColumn = [
    { label:  getI18nLabel(locale, 'productReport.card.group'), value: row?.group },
    { label:  getI18nLabel(locale, 'productReport.card.line'), value: row?.line },
    { label:  getI18nLabel(locale, 'productReport.card.grammage'), value: row?.grammage_quantity },
    { label:  getI18nLabel(locale, 'productReport.card.unit'), value: row?.unit },
    { label:  getI18nLabel(locale, 'productReport.card.lower_price'), value: row?.lower_price },
  ];
  const buildPrices = [
    { style: { backgroundColor: '#3f4d5e' }, title: getI18nLabel(locale, 'productReport.card.recently'), value: row?.last_price, date: row?.date_last_price },
    { style: { backgroundColor: '#f55d5d' }, title: getI18nLabel(locale, 'productReport.card.higher'), value: row?.highest_price, date: row?.date_last_price },
    { style: { backgroundColor: '#71a4e4' }, title: getI18nLabel(locale, 'productReport.card.lower'), value: row?.lower_price, date: row?.date_last_price },
    { style: { backgroundColor: '#48a858' }, title: getI18nLabel(locale, 'productReport.card.lowerPromotion'), value: row?.promotion_lower_price, date: row?.date_last_price },
  ];
  return (
    <>
      <div className={`d-flex justify-content-between w-100 ${styles['place-items']}`} >
        <div className={`d-flex ${styles['w-20']} ${styles['place-items']}`}>
          <div className={`${styles['container-img']}`}>
            <Checkbox label="" onChange={() => onChangeRadio(row)} checked={row?.checked || false} />
            <img
              className={styles['img-content']}
              src={`${photoUrl}/${row?.photo}`}
              alt="product" />
            </div>
        </div>
        <div className={`d-flex flex-column ${styles['w-70']} ${styles['place-items']}`}>
          { /* first section*/}
          <div className={`d-flex justify-content-between ${styles['place-items']} w-100 py-2`}>
            {
              buildFirstColumn.map((item, index) => (
                <React.Fragment key={`item-product-${item.value}-${index + 1}`}>
                  <div className="d-flex flex-column px-2 w-25">
                    <span className={`${styles['text-border']} ${styles.fontSize}`}>{item.label}</span>
                    <span className={`${styles['border-product']} ${styles.truncate}`}>{item?.value} </span>
                  </div>
                </React.Fragment>
              ))
            }
          </div>
          { /* second section*/}
          <div className={`d-flex justify-content-between ${styles['place-items']} w-100 py-2`}>
            {
              buildSecondColumn.map((item, index) => (
                <React.Fragment key={`item-product-${item.value}-${index + 1}`}>
                  <div className="d-flex flex-column px-2 width20">
                    <span className={`${styles['text-border']} ${styles.fontSize}`}>{item.label}</span>
                    <span className={`${styles['border-product']} ${styles.truncate}`}>{item?.value} </span>
                  </div>
                </React.Fragment>
              ))
            }
          </div>
          { /* third section*/}
          <div className={`d-flex ${styles['place-items']} w-100 py-2`}>
            <div className="d-flex flex-column px-2 width20">
              <span className={`${styles['text-border']} ${styles.fontSize}`}>{getI18nLabel(locale, 'productReport.card.lower_price')} </span>
              <span className={`${styles['border-product']} ${styles.truncate}`}>{row?.lower_price}</span>

            </div>
          </div>
        </div>
        <div className={`d-flex flex-column w-10 ${styles['place-items']}`}>
          {
            buildPrices.map((item, index) => (
              <div key={`item-price-${index + 1}`} className="d-flex flex-column m-1 w-100" style={{ ...item.style, color: 'white', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: "9px" }}>{item?.title} </span>
                <span style={{ fontSize: "9px", fontWeight: 'bold' }}>{`$${item?.value}`} </span>
                <span style={{ fontSize: "9px" }}>{item?.date} </span>
              </div>
            ))
          }
        </div>
      </div>
      <hr className={`${styles.styledHr}`}/>
    </>
  )
}
SingleProductCard.defaultProps = {
  onChangeRadio: () => { },
  brandCatalog: [],
};

export default SingleProductCard;