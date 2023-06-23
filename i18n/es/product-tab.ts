export default {
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
                validations: {
                    minLength: 'El campo debe contener al menos dos caracteres',
                },
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
                validations: {
                    valid: 'El gramaje o cantidad debe ser un número válido: Con dos decimales máximo.',
                },
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
            minPrice: {
                label: 'Precio mínimo',
            },
            maxPrice: {
                label: 'Precio máximo',
            },
        },
        detailsContainer: {
            title: 'Foto del producto',
        },
        options: {
            cancel: 'Cancelar',
            changeImage: 'Cambiar imagen',
            editInformation: 'Editar información',
            saveInformation: 'Guardar información',
        },
    },
}
