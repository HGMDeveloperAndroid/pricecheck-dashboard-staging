import React from 'react'
import Head from 'next/head'
import { Header } from '../../../components/header'
import { faTags, faBuilding, faCopyright, faLink } from '@fortawesome/free-solid-svg-icons'

import styles from './catalogs.module.scss'
import { CatalogsCard } from '../../../components/catalogsCard'
import Router from 'next/router'
import PageTitle from '../../../components/pageTitle/PageTitle'


const CatalogsPage = () => {
    return (
        <>
            <Head>
                <title>Catálogos</title>
            </Head>
            <Header/>
            <PageTitle title="Catálogos" />
            <div className={styles.catalogsContainer}>
                <CatalogsCard label="Etiquetas" iconColor="#DBC500" onClick={() => Router.push('/home/catalogs/labels')} icon={faTags} />
                <CatalogsCard label="Grupos y líneas" iconColor="#F50057" onClick={() => {}} icon={faBuilding} />
                <CatalogsCard label="Marca" iconColor="#03A9F4" onClick={() => {}} icon={faCopyright} />
                <CatalogsCard label="Cadena y formato" iconColor="#651FFF" onClick={() => {}} icon={faLink} />
            </div>
        </>
    )
}

export default CatalogsPage