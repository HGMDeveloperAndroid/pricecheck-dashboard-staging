export default {
    options: {
        listPrice: 'Gráfica - Precio de lista',
        unitaryPrice: 'Gráfica - Precio unitario',
        priceHistory: 'Historial de precios',
        detail: 'Detalle',
    },
    startDate: 'Fecha inicial',
    endDate: 'Fecha final',
    table: {
        headers: {
            branchOffice: 'Sucursal',
            minPrice: 'Precio mínimo',
            maxPrice: 'Precio máximo',
            currentPrice: 'Precio actual',
            averagePrice: 'Precio promedio',
        },
        options: {
            seeHistory: 'Ver historial',
        },
    },
    detail:{
        input: {
            productId: {
                label: 'ID Producto',
            },
            barcode: {
                label: 'Código de barras',
            },
            name: {
                label: 'Nombre',
            },
            brand: {
                label: 'Marca',
            },
            type: {
                label: 'Tipo',
            },
            group: {
                label: 'Grupo',
            },
            line: {
                label: 'Línea',
            },
            amount: {
                label: 'Gramaje / Cantidad',
            },
            unit: {
                label: 'Unidad',
            },
            mainImage: {
                label: 'Foto principal',
            },
            priceImage: {
                label: 'Foto de precio',
            },
        },
        options: {
            changeImage: 'Cambiar imagen',
            editInformation: 'Editar información',
            saveInformation: 'Guardar información',
        },
    },
};
