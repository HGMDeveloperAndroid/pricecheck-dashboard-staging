import React, { SyntheticEvent, useEffect, useState } from 'react'
import Head from 'next/head'

import { Input } from '../../components/input'
import { Checkbox } from '../../components/checkbox'
import PageTitle from '../../components/pageTitle/PageTitle'
import { Table } from '../../components/table'
import api from '../../utils/api'
import { getHeader } from '../../utils/session-management'

import s from './positions.module.scss'

import { Header } from '../../@Types/table'

type UserResponse = {
    name: string,
    employee_number: string,
    efficiency: number,
    captures_made: number,
    validated_captures: number,
    points: number,
}

export default function PositionsPage() {
    const [countOut, setCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalOut, setTotal] = useState(0)
    const [totalPage, setTotalPage] = useState(0)
    const [scannersRanking, setScannersRanking] = useState([])
    const [firstPlaces, setFirstPlaces] = useState([])
    const [textSearch, setTextSearch] = useState('')
    const [order, setOrder] = useState('desc')
    const [header, setHeader] = useState(
        [
            {
                key: 'ranking',
                label: 'Posición',
            },
            {
                key: 'name',
                label: 'Nombre',
            },
            {
                key: 'efficiency',
                label: 'Porcentaje',
            },
            {
                key: 'validated_captures',
                label: 'Capturas validadas',
            },
            {
                key: 'points',
                label: 'Puntos',
            },
        ] as Header[]
    )

    useEffect(() => {
        loadData(currentPage),
        loadFirstThree()
    }, [textSearch, currentPage, order])

    async function loadData(page: number = 1) {
        try {
            const data: { sort: string, textSearch: string } = {
                textSearch, sort: order
            }
            const response = await api.post(`api/reports/ranking-efficiency?page=${page}`, data, {})

            if (response.status === 200) {
                const {
                    count,
                    current_page,
                    per_page,
                    total,
                    total_pages,
                } = response.data.pagination

                // Start counting from here, for the rankings
                const start = order === 'desc' ?
                    ((current_page - 1) * per_page) + 1 :
                    (total - ((currentPage - 1) * per_page))

                const rankings = (response.data.data as UserResponse[]).map((user, i) => {
                    const ranking = order === 'desc' ?
                        start + i :
                        start - i

                    // Round to 2 decimals
                    const pct = (Math.round(user.efficiency * 100)) / 100

                    return {
                        ...user,
                        ranking,
                        efficiency: `${pct}%`,
                    }
                })

                const newHeader = header.map((e: Header) => {
                    if (e.sort) {
                        return {
                            ...e,
                            order,
                        }
                    }
                    return e
                })

                setScannersRanking(rankings)
                setTotal(total)
                setCount(count)
                setTotalPage(total_pages)
                setHeader(newHeader)
            }
        } catch (e) {
            throw new Error(e)
        }
    }

    function changeTextSearch(e: SyntheticEvent) {
        setTextSearch((e.target as HTMLInputElement).value)
    }

    function nextPage() {
        setCurrentPage(currentPage + 1)
    }

    function prevPage() {
        setCurrentPage(currentPage - 1)
    }

    function setSortDirection(e: SyntheticEvent) {
        const checked = (e.target as HTMLInputElement).checked
        const next = checked ? 'asc' : 'desc'

        setOrder(next)
    }

    async function loadFirstThree() {
        try {
            const response = await api.post(`api/reports/ranking-first3`, {}, {})

            if (response.status === 200 && response.data) {
                const {data} = response.data;
                setFirstPlaces(data)
            }
        } catch (e) {
            throw new Error(e)
        }
    }

    return (
        <>
            <Head>
                <title>Posiciones</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
            </Head>

            <div className={s.container}>
                <PageTitle title="Posiciones" />
                <div className={s.firstPlacesContainer}>
                    {
                        firstPlaces.map((fp, i) => {
                            return (
                                <div className={s.placeContainer} key={i}>
                                    <img src={`/img/${i + 1}place.svg`} />
                                    <div>
                                        <p className={s.score}>{fp.validated_captures}</p>
                                        <p className={s.name}>{fp.name}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                <div className={s.searchContainer}>
                    <div className="width70">
                        <Input
                            type="text"
                            onChange={changeTextSearch}
                            placeholder="Buscar por nombre o número de empleado"
                            placeholderOverLabel
                        />
                    </div>

                    <div className="width20">
                        <Checkbox
                            onChange={setSortDirection}
                            label="Orden descendente"
                            checked={order === 'asc'}
                        />
                    </div>
                </div>

                <Table
                    header={header}
                    count={countOut}
                    currentPage={currentPage}
                    total={totalOut}
                    totalPage={totalPage}
                    onNextPage={nextPage}
                    onPrevPage={prevPage}
                    bodyData={scannersRanking}
                />
            </div>
        </>
    )
}
