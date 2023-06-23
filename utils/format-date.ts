import { isDate, isValid, format, parse } from 'date-fns';
import * as locales from 'date-fns/locale';
import { getLocale } from './session-management'

export default function formatDate(dateStr: string) {
    if (!dateStr || dateStr.trim() === '-') {
        return null;
    }

    let locale = getLocale();
    locale = locale  === 'en' ? 'enUS' : locale;

    const parsedShort = parse(dateStr, 'dd/MMM/yyyy', new Date());

    if (isDate(parsedShort) && isValid(parsedShort)) {
        return format(parsedShort, 'dd/MMMM/yyyy', { locale: locales[locale] });
    }

    const parsedLong = parse(dateStr, 'yyyy-MM-dd HH:mm:ss', new Date());

    if (isDate(parsedLong) && isValid(parsedLong)) {
        return format(parsedLong, 'dd/MMMM/yyyy', { locale: locales[locale] });
    }

    return null;
}
