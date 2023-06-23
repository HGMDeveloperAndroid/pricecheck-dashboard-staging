export default {
    title: 'PRODUCTOS',
    filters: {
        searchField: 'Buscar por nombre o código del producto',
        startDate: 'Desde',
        endDate: 'Hasta',
        updatedAt: 'Fecha de modificación',
        createdAt: 'Fecha de Alta',
        param: 'Parámetro',
        value: 'Valor',
    },
    actions: {
        search: 'Buscar',
        cleanFilter: 'Limpiar filtros',
        download: 'Descargar',
        comparativeChart: 'Graficar comparativos',
    },
    optionsCatalog: {
        brandsCatalog: 'Marca',
        groupsCatalog: 'Grupo',
        linesCatalog: 'Línea',
        storesCatalog: 'Cadena',
        unitsCatalog: 'Unidad',
    },
    modal: {
        delete: {
            buttonAcceptLabel: 'Eliminar',
            message: '',
        }
    },
    table: {
        head: {
            selected: 'Seleccionar',
            photo: 'Foto del producto',
            product: 'Nombre',
            barcode: 'Código',
            brand: 'Marca',
            type: 'Tipo',
            created_at: 'Fecha de captura',
            updated_at: 'Fecha de modificación',
            grammage_quantity: 'Cantidad',
            unit: 'Unidad',
            group: 'Grupo',
            line: 'Línea',
            highest_price: 'Precio más alto',
            lower_price: 'Precio más bajo',
            promotion_lower_price: 'Precio más bajo con promoción',
            last_price: 'Último precio capturado',
        },
    },
};
