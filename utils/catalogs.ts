import api from './api'
import { getHeader } from './session-management'
import {baseURLGeoref, georefApiKey} from './baseUrl';

type Options =
{value: string, label: string}

type Line = {value: string, label: string, group: string }

const getRolesCatalog = async (): Promise<Array<Options>> => {
    const res = await api.get('api/roles', { headers: getHeader() })
    return res.data.data.map((rol: {name: string}) => {
        return {
            value: rol.name,
            label: rol.name,
        }
    })
}

const getRegionsCatalog = async (): Promise<Array<Options>> => {
    const res = await api.get('api/regions', { headers: getHeader() })
    return  res.data.data.map((region: {name: string, id: number}) => {
        return {
            value: region.id,
            label: region.name,
        }
    })
}

const getRegionsLabelCatalog = async (): Promise<Array<Options>> => {
    const res = await api.get('api/regions', { headers: getHeader() })
    return  res.data.data.map((region: {name: string, id: number}) => {
        return {
            value: region.name,
            label: region.name,
        }
    })
}

const getLabelsCatalog = async (): Promise<Array<Options>> => {
    const res = await api.get('api/labels', { headers: getHeader() })
    return res.data.data.map((label: {id: number, name: string}) => {
        return {
            value: label.id,
            label: label.name
        }
    })

}

const getGroupsCatalog = async (): Promise<Array<Options>> => {
    const res = await api.get('api/groups/list', { headers: getHeader() })
    return res.data.group.map((group: {id: number, name: string}) =>{
        return {
            value: group.id,
            label: group.name
        }
    })
}

const getMissionsCatalog = async (): Promise<Array<Options>> => {
    const data = {
        textSearch: '',
    }
    const res = await api.post('api/missions/list', data, { headers: getHeader() })
    return Object.keys(res.data).map(missionKey =>{
        return {
            value: missionKey,
            label: res.data[missionKey]
        }
    } )
}
const getMissionsValidation = async (): Promise<Array<Options>> => {
    const res = await api.get('api/missions/list-validation', { headers: getHeader() })
    return Object.keys(res.data).map(missionKey =>{
        return {
            value: missionKey,
            label: res.data[missionKey]
        }
    } )
}

const getMissionsCatalogByMission = async (mission: string): Promise<Array<Options>> => {
    const data = {
        textSearch: mission,
    }

    const res = await api.post('api/missions/list', data, { headers: getHeader() },)
    return Object.keys(res.data).map(missionKey =>{
        return {
            value: missionKey,
            label: res.data[missionKey]
        }
    } )
}

const getUnitsCatalog = async (): Promise<Array<Options>> => {
    const res = await api.get('api/units/list', { headers: getHeader() })
    return Object.keys(res.data.data).map(unitKey =>{
        return {
            value: unitKey,
            label: res.data.data[unitKey]
        }
    } )
}

const getBrandsCatalog = async (): Promise<Array<Options>> => {
    const res = await api.get('api/brands/list', { headers: getHeader() })
    return Object.keys(res.data.data).map(brandKey =>{
        return {
            value: brandKey,
            label: res.data.data[brandKey]
        }
    } )
}

const getStoresCatalog = async (): Promise<Array<Options>> => {
    const res = await api.get('api/store/list', { headers: getHeader() })
    const stores = Object.keys(res.data).map(storeKey => {
        return {
            value: storeKey,
            label: res.data[storeKey]
        }
    })

    stores.sort((a, b) => {
        if (a.label.toLowerCase() < b.label.toLowerCase()) {
            return -1
        }

        if (a.label.toLowerCase() > b.label.toLowerCase()) {
            return 1
        }

        return 0
    })

    return stores
}

const getLinesCatalog = async (): Promise<Array<Line>> => {
    const res = await api.get('api/lines/list', { headers: getHeader() })
    return res.data.lines.map((line: {id: number, name: string, id_group: number}) => {
        return {
            value: line.id,
            label: line.name,
            group: line.id_group,
        }
    })
}

const getGeolocationCatalog = async (): Promise<Array<Line>> => {
    const response = await api({
        url: "api/places",
        baseURL: baseURLGeoref,
        headers: { Authorization: `Api-Key ${georefApiKey}` },
    })
    let transformGeolocation = response?.data?.data
    transformGeolocation = transformGeolocation.map(geolocation => {
        return {...geolocation, value: geolocation.id, label: geolocation.name}
    })

    return transformGeolocation
}

export {
    getRolesCatalog,
    getRegionsCatalog,
    getLabelsCatalog,
    getGroupsCatalog,
    getMissionsCatalog,
    getMissionsValidation,
    getUnitsCatalog,
    getBrandsCatalog,
    getStoresCatalog,
    getLinesCatalog,
    getMissionsCatalogByMission,
    getGeolocationCatalog,
    getRegionsLabelCatalog,
}
