import React, { Component } from 'react';
import Router from 'next/router'
import { Line } from 'react-chartjs-2'

import { Input } from '../input';

import api from '../../utils/api';
import { getHeader } from '../../utils/session-management';

import s from './productCompareDetails.module.scss'

import Datepicker from '../datepicker/datepicker'

import { TableComplex } from '../table'
import { faTrash, faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons'
import styles from '../../pages/home/products/products.module.scss'
import DialogModal from '../../components/modal/DialogModal'
import { PrimaryButtonVariant } from '../../components/buttons/PrimaryButton'
import { format } from 'date-fns';
import { getLocale } from '../../utils/session-management'
import { getI18nLabel } from '../../i18n';


type PriceCaptureDate = {
  capture_date: string
}

type Store = {
  name: string
  prices: PriceCaptureDate[]
}

type Product = {
  name: string
  stores: Store[]
}

type Price = {
  capture_date: string
  price: string
  scan_id: number
}

type Props = {
  priceField: string,
  barcodes: any,
}

export default class GraphReportTabCompare extends Component<Props> {
  static defaultProps = {
    priceField: 'price',
    barcodes: [],
  }

  state = {
    inputVal: "",
    labels: [],
    datasets: [],
    minDate: '',
    maxDate: '',
    currentPage: 1,
    totalPage: 1,
    total: 0,
    count: 0,
    selectedScan: null,
    isOpen: false,
    scanDeleteId: '',
    actions: [
      {
        icon: faTrash,
        color: '#DE4747',
        action: scan => this.openModalDelete(scan.id),
      },
      {
        icon: faPencilAlt,
        color: '#71A4E4',
        action: scan => this.openEdit(scan.id),
      },
    ],
    header: [
      {
        title: 'ID',
        name: 'id',
        type: 'id',
        isHidedable: false,
      },
      {
        title: 'Foto principal',
        name: 'product_picture',
        type: 'img',
        isHidedable: true,
      },
      {
        title: 'Foto del precio',
        name: 'shelf_picture',
        type: 'img',
        isHidedable: true,
      },
      {
        title: 'Código de barras',
        name: 'barcode',
        type: 'number',
        isHidedable: false,
      },
      {
        title: 'Precio',
        name: 'price',
        type: 'string',
        isHidedable: false,
      },
      {
        title: 'Fecha de captura',
        name: 'capture_date',
        type: 'string',
        isHidedable: false,
      },
      {
        title: 'Acciones',
        name: '',
        type: 'actions',
        isHidedable: false,
      },
    ]
  }

  colors = [
    '#1B998B',
    '#A7A7A9',
    '#2D3047',
    '#E84855',
    '#BDBF09',
    '#D96C06',
    '#b26c90',
    '#88665D',
    '#C2B97F',
    '#80ED99',
    '#322A26',
    '#3185FC',
    '#EFBCD5',
    '#931621',
    '#44344F',
    '#FF6F59',
    '#95B8D1',
    '#EB4B98',
    '#02394A',
    '#ea00c8',
    '#f1f96d',
  ]

  tooltipOptions = {
    tooltips: {
      callbacks: {
        title: (tooltip, data) => {
          const dataset = this.state.datasets[tooltip[0].datasetIndex];
          return dataset.data[0].x;

        },
        label: (tooltip, data) => {
          const dataset = this.state.datasets[tooltip.datasetIndex];
          let label = dataset.label || '';

          if (label) {
            label += `: $`;
          }

          label += tooltip.yLabel;
          return label;
        },
        footer: (params) => params.map((param) => {
          const dataset = this.state.datasets[param.datasetIndex];
          const scanId = dataset.data[param.index].scanId

          return `Id de captura: ${scanId}`;
        }),
      },
      responsive: false,
      bodyFontSize: 10,
      titleFontSize: 8,
      footerFontSize: 8,
      "enabled": true,
      displayColors: true,
      caretSize: 0,
      bodySpacing: 0,
      titleSpacing: 0,
      xPadding: 2,
      yPadding: 2,
      cornerRadius: 2,
      titleMarginBottom: 2,
    },
    legend: {
      position: 'bottom',
      labels: {
        fontSize: 10,
      }
    },
  };

  async componentDidMount() {
    try {
      await this.loadData()
    } catch (error) {
      // TODO: Mensaje de error
      console.log(error);
    }
  }
  async componentDidUpdate(prevProps) {
    if (document) {
      const table = document.querySelector('.product-details-table')

      if (table) {
        table.scrollIntoView(true)
      }
    }
  }

  getLabels(labels) {

    labels = Array.from(new Set(labels))
    labels = labels.sort(function (a, b) {
      a = a.split('-');
      b = b.split('-');
      return a[2] - b[2] || a[1] - b[1] || a[0] - b[0];
    })
    labels = Array.from(new Set(labels))

    return labels;
  }

  parseDataset(dataset) {
    const randomNumber = (max) => max ? Math.floor(Math.random() * max) : 0;
    const randomColor = this.colors[randomNumber(this.colors.length)]

    return {
      borderCapStyle: 'butt',
      fill: false,
      lineTension: 0.1,
      backgroundColor: randomColor,
      borderColor: randomColor,
      pointBorderColor: randomColor,
      data: dataset.data,
      label: dataset.label,
      showLine: false,
    }
  }

  formatDate(date) {
    if (date) {
      date = new Date(date);

      let month = '' + (date.getMonth() + 1);
      let day = '' + date.getDate();
      let year = date.getFullYear();

      if (month.length < 2) {
        month = '0' + month;
      }

      if (day.length < 2) {
        day = '0' + day;
      }

      return `${year}-${month}-${day}`;
    }

    return ''
  }

  loadData = async () => {
    try {
      const { priceField, barcodes } = this.props
      const data = barcodes?.join(",")?.toString();
      const requestOptions = {
        headers: getHeader(),
        params: {
          enddate: this.formatDate(this.state.maxDate) || null,
          startdate: this.formatDate(this.state.minDate) || null,
          barcodes: data.toString(),
        }
      };

      const response = await api.get('api/product/show', requestOptions);
      if (response.status === 200) {
        const { products } = response.data;
        const datasets = [];
        let scans = [];
        let labels = [];

        for (let i = 0; i < products.length; i++) {
          const product = products[i];

          scans[i] = [];

          for (let j = 0; j < product.stores.length; j++) {
            const store = product.stores[j];
            const label = `${store.name} - ${product.name}`;

            for (let k = 0; k < store.prices.length; k++) {
              const price = store.prices[k];
              const scan = {
                label,
                scanId: price.scan_id,
                captureDate: format(new Date(price.capture_date), "dd-MM-yyyy").split(" ")[0],
                price: price[priceField],
              };

              labels.push(format(new Date(price.capture_date), "dd-MM-yyyy").split(" ")[0]);
              scans[i].push(scan);
            }
          }
        }

        scans = scans.filter((scan) => scan.length)
        labels = this.getLabels(labels);

        let datasetBatch: any = [] // collection of different labels
        let datasetCollection: any = []; // collection of dataset
        for (let i = 0; i < scans.length; i++) {
          const prices = new Array(labels.length).fill(null);
          for (let j = 0; j < scans[i].length; j++) {
            const scan = scans[i][j];
            const slot = labels.findIndex((label) => label === scan.captureDate);

            // create object with data
            const data: any = {};
            data.price = scan.price;
            data.y = scan.price;
            data.scanId = scan.scanId;
            data.capture_day = scan.captureDate;
            data.x = scan.captureDate

            const label = scan.label;
            if (!datasetBatch.includes(label)) {
              datasetBatch.push(scan.label);
              const obj = {
                label: scan.label
              }
              datasetCollection.push({
                label: scan.label,
                data: [data]
              });
            } else {
              const idx = datasetCollection.findIndex(x => x.label === label);
              datasetCollection[idx].data.push(data);
            }
          };
        }

        const dataset = datasetCollection.map(item => this.parseDataset(item));

        this.setState({
          labels,
          datasets: dataset
        });

      }
    } catch (error) {
      // TODO: Mensaje de error
      console.log(error);
    }
  }

  openModalDelete = (id: string) => {
    this.setState({
      isOpen: true,
      scanDeleteId: id
    })
  }

  openEdit = (id: string) => {
    Router.push(`/home/scans/${id}?barcodes=${Router && Router.query.barcodes}`)
  }

  getChart = () => {
    return (
      <div className={s.graphContainer}>
        <Line data={this.state} options={this.tooltipOptions} />
      </div>
    )
  }

  minDateHandler = (date: any) => {
    const { minDate, maxDate } = this.state;

    this.setState({
      minDate: date,
    }, () => {
      if (maxDate) {
        this.loadData()
      }
    })
  }

  maxDateHandler = (date: any) => {
    const { minDate, maxDate } = this.state;

    this.setState({
      maxDate: date,
    }, () => {
      if (minDate) {
        this.loadData()
      }
    })
  }

  deleteScan = async () => {
    try {
      const response = await api.delete(
        `api/scan/${this.state.scanDeleteId}`,
        { headers: getHeader() }
      )

      if (response.status === 204) {
        this.setState({
          isOpen: false,
          scanDeleteId: ''
        })
        this.loadData()
      }
    } catch (e) {
      // TODO: Mandar mensaje de error
      throw new Error(e)
    }
  }

  handleOnChangeSearch = async (event) => {
    try {
      const { datasets } = this.state
      const { target } = event
      const requestOptions = {
        headers: getHeader(),
      };
      this.setState({ ...this.state, inputVal: target.value })
      for (let i = 0; i < datasets.length; i++) {
        const { data } = datasets[i]
        const scan = data.find((scan) => scan.scanId == target.value)

        if (scan && scan.scanId) {
          const endpoint = `api/scan/${scan.scanId}/show`
          const { data: { scan: response } } = (await api.get(endpoint, requestOptions))
          const { id, barcode, pictures, store, price, status, capture_date } = response
          const { product_picture, shelf_picture } = (pictures && pictures.length) && pictures[0]
          const storeName = store && (store.name || '')

          const selectedScan = {
            id,
            barcode,
            product_picture,
            shelf_picture,
            storeName,
            price,
            status,
            capture_date,
          }
          this.setState({
            selectedScan,
          })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  onlyNumberKey(event) {
    const code = (event.which) ? event.which : event.keyCode
    const isAlpha = code > 31 && (code < 48 || code > 57)

    if (isAlpha) {
      event.preventDefault()
    }
  }

  render() {
    const {
      minDate,
      maxDate,
      selectedScan,
      actions,
      header,
      currentPage,
      count,
      total,
      totalPage,
      isOpen,
      inputVal,
    } = this.state;

    const locale = getLocale()

    return (
      <div className={s.graphPage}>
        <div className={s.inputsContainer}>
          <div>
            <Datepicker
              label={getI18nLabel(locale, 'graphTabCompare.startDate')}
              selected={minDate}
              onSelect={this.minDateHandler}
              placeholder='dd/mm/yyyy'
              dateFormat='dd/MM/yyyy'
            />
          </div>

          <div>
            <Datepicker
              label={getI18nLabel(locale, 'graphTabCompare.endDate')}
              selected={maxDate}
              onSelect={this.maxDateHandler}
              placeholder='dd/mm/yyyy'
              dateFormat='dd/MM/yyyy'
            />
          </div>

          <div className='search'>
            <Input
              type='text'
              defaultValue={inputVal}
              placeholder={getI18nLabel(locale, 'graphTabCompare.search')}
              inputPlaceholder='ej: 8093'
              onChange={(event) => this.handleOnChangeSearch(event)}
              onKeyPress={(event) => this.onlyNumberKey(event)}
            />
          </div>
        </div>

        {this.getChart()}

        {selectedScan && (
          <TableComplex
            actions={actions}
            content={[selectedScan]}
            header={header}
            changePageNext={() => false}
            changePagePrev={() => false}
            total={total}
            currentPage={currentPage}
            totalPage={totalPage}
            onClickDetails={(id: string) => this.openEdit(id)}
            count={count}
            checkboxStyles={styles.checkbox}
            textNotData=''
            customClassName='fixed-header product-details-table'
          />
        )}
        <DialogModal
          btnAcceptLabel={getI18nLabel(locale, 'graphTabCompare.modal.delete.buttonAcceptLabel')}
          isOpen={isOpen}
          message={getI18nLabel(locale, 'graphTabCompare.modal.delete.message')}
          onClose={() => this.setState({ isOpen: false })}
          btnAcceptType={PrimaryButtonVariant.Error}
          onAccept={() => this.deleteScan()}
        />
      </div>
    );
  }
}
