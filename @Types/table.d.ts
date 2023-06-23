import { IconProp } from '@fortawesome/fontawesome-svg-core'

type SortByFn = (param: string) => any

export type Header = {
    key: string
    label: string
    sort?: boolean
    order?: string
    onSort?: SortByFn
}

export type ContentRow = {
    id: number
    [key: string]: any
}

export type Action = {
    icon: IconProp
    color: string
    action: Function
}

export type ActionFunction = (row: ContentRow) => Action[]
