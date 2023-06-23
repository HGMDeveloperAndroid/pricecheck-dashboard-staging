import Router from 'next/router'

const createSession = (token: string, name: string, rol: Array<string>, profilePictre: string, id: string, dark_theme?: number, theme?: any, logo?: string,  locale?: string) => {
    localStorage.setItem('token', token)
    localStorage.setItem('name', name)
    localStorage.setItem('rol', rol.join('|'))
    localStorage.setItem('id', id)
    localStorage.setItem('dark_theme', dark_theme.toString())
    localStorage.setItem('locale', locale)

    if (theme !== null || !theme) {
        localStorage.setItem('theme', JSON.stringify(theme));
    } else {
        localStorage.setItem('theme', JSON.stringify({}));
    }
    if (profilePictre && profilePictre.length > 0) {
        localStorage.setItem('profilePicture', `https://cdn-pricecheck.sfo2.digitaloceanspaces.com/${profilePictre}`)
    }
    if(logo && logo.length > 0) {
        localStorage.setItem('logo', `https://lampt3bdiag.blob.core.windows.net/pricecheckv2/${logo}`) 
    } else {
        localStorage.setItem('logo', `/img/logo.png`) 
    }
}

const deleteSession = () => {
    localStorage.removeItem('locale')
    localStorage.removeItem('dark_theme')
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    localStorage.removeItem('rol')
    localStorage.setItem('logo', `/img/logo.png`) 
    localStorage.removeItem('profilePicture')
    localStorage.removeItem('theme')
}

const getToken = (): string | null => localStorage.getItem('token')


const getName = (): string | null => localStorage.getItem('name')

const getId = (): string | null => localStorage.getItem('id')

const getDarkTheme = (): any => localStorage.getItem('dark_theme')
const getLocale = (): any => {
    const isBrowser = () => typeof window !== 'undefined'
    const hasLocale = () => localStorage.getItem('locale') || false

    let locale = 'es';

    if (isBrowser() && hasLocale()) {
        locale =  localStorage.getItem('locale') || locale
    }

    return locale
}

const getProfilePicture = (): string | null => localStorage.getItem('profilePicture')

const getRoles = (): Array<string> | null => {
    const roles = localStorage.getItem('rol')
    if (roles)
        return roles.split('|')

    return null
}

const validateSession = (newRoute?: string) => {
    if (!localStorage.getItem('token')) {
        Router.push('/login')
    } else if (newRoute) {
        Router.push(newRoute)
    }
}

const getHeader = (): { Authorization: string } => {
    const token = localStorage.getItem('token')
    return { Authorization: `Bearer ${token}` }
}

const validateIsAnalyst = () => {
    let role = '';
    if (typeof window !== "undefined") {

        role = localStorage.getItem('rol');

    }
    const validation = role === 'Analista';
    return validation;
}

const validateIsAdmin = () => {
    let role = '';
    if (typeof window !== "undefined") {

        role = localStorage.getItem('rol');
    }
    return role === 'Admin';
}

const getLogo = () => {
    let logo = "/img/logo.png";
    if (typeof window !== "undefined") {

        logo = localStorage.getItem('logo');
        return logo;
    }
    return logo;
}
const IsCustomTheme = () => {
    let isCustom = false;
    let theme = "";
    let objTheme = {}
    if (typeof window !== "undefined") {
        const hasDarkTheme = getDarkTheme() === '1' ? true : false;
        theme = localStorage.getItem('theme');
        if (theme !== "undefined") {
            objTheme = JSON.parse(localStorage.getItem('theme')) || {};
        }

        if (Object.keys(objTheme).length !== 0 && !hasDarkTheme) {
            isCustom = true;
            return isCustom;
        }
    }
    return isCustom;
}

const getTheme = () => {
    let theme = "";
    let objTheme = {}
    if (typeof window !== "undefined") {
        if (theme !== "undefined" || !theme) {
            objTheme = JSON.parse(localStorage.getItem('theme'));
        }

        return objTheme;
    }
    return objTheme;
}

export {
    getLogo,
    IsCustomTheme,
    createSession,
    deleteSession,
    getToken,
    getName,
    getProfilePicture,
    getRoles,
    validateSession,
    getHeader,
    getId,
    getDarkTheme,
    getLocale,
    validateIsAnalyst,
    getTheme,
    validateIsAdmin,
}
