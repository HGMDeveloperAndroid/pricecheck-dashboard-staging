import React, { useEffect, useState } from 'react'
import s from './productCompareDetails.module.scss'
import api from '../../utils/api'
import { getHeader, getLocale } from '../../utils/session-management'
import formatDate from '../../utils/format-date'
import { getI18nLabel } from '../../i18n'

const TableTabCompare = () => {

    const [products, setProducts] = useState([])
    const locale = getLocale()

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const params = {}
            // if (this.state.maxDate && this.state.maxDate.length > 0) {
            //     params['enddate'] = this.state.maxDate
            // }

            // if (this.state.minDate && this.state.minDate.length > 0) {
            //     params['startdate'] = this.state.minDate
            // }

            params['barcodes'] = window.location.href.split('?barcodes=')[1]
            const response = await api.get(`api/product/show`, { headers: getHeader(), params, })

            if (response.status === 200) {
                setProducts(response.data.products)
            }


        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className={s.pricesContainer}>
            {
                products.map(p => {
                    return p.stores.map(st => {
                        return (<div className={s.price}>
                            <p className={s.title}>{p.name} - {st.name}</p>
                            <table>
                                <thead>
                                    <tr>
                                        <th>{getI18nLabel(locale, 'graphTabCompare.tabs.history.headers.date')}</th>
                                        <th>{getI18nLabel(locale, 'graphTabCompare.tabs.history.headers.price')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        st.prices.map((pr) => {
                                            return (
                                                <tr>
                                                    <td>
                                                        {formatDate(pr.capture_date)}
                                                    </td>
                                                    <td>
                                                        {pr.price}
                                                    </td>
                                                </tr>
                                            )
                                        }

                                        )
                                    }
                                </tbody>
                            </table>
                        </div>)
                    })
                })
            }
        </div>
    )
}

export default TableTabCompare
