import get from 'lodash.get'

// LOCALES
import es from './es'
import en from './en'

const locales = {
    es,
    en,
}

export const getI18nLabel = (locale, key) => (
    get(locales[locale], key) || ''
)

export const translateTableHeader = (locale, headers, path) => (
    headers.map((header) => ({
        ...header,
        label: getI18nLabel(locale, `${path}.${header.key}`),
    }))
)

export const translateTableComplexHeader = (locale, headers, path) => (
    headers.map((header) => ({
        ...header,
        title: getI18nLabel(locale, `${path}.${header.name}`),
    }))
)
