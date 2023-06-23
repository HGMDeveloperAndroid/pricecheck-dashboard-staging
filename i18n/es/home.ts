export default {
    title: 'Validación',
    welcome: 'Seleccione una captura para iniciar.',
    sidebar: {
        title: 'Capturas',
        input: {
            mission: {
                label: 'Misión',
                placeholder: '',
            },
            product: {
                label: 'Producto',
                placeholder: '',
            },
        },
        scanFilter: {
            all: 'Todos',
            withProduct: 'Con producto',
            withoutProduct: 'Sin producto',
        },
    },

    scan: {
        topBar: {
            beingValidated: 'Este registro está siendo validado, selecciona uno diferente',
            withoutNumber: 'Sin Número',
            withoutMission: 'Sin Misión',
        },
        productImage: {
            label: 'Producto',
        },
        priceImage: {
            label: 'Precio',
        },
        input: {
            barcode: {
                label: 'Código de barras',
                error: 'El campo es requerido',
            },
            price: {
                label: 'Precio',
                error: 'El campo es requerido',
            },
            promotionPrice: {
                label: 'Precio de promoción',
                error: 'El campo es requerido',
            },
            store: {
                label: 'Cadena',
                error: 'El campo es requerido',
            },
            address: {
                label: 'Dirección',
                error: 'El campo es requerido',
            },
            aditionalComments: {
                label: 'Comentarios adicionales',
                error: 'El campo es requerido',
            },
        },
        option: {
            showPicture: 'Ver foto',
            reject: 'Rechazar',
            validate: 'Validar captura',
            validateAndAdd: 'Validar y agregar',
        },
    },

    product: {
        title: 'Crear nuevo producto',
        input: {
            name: {
                label: 'Nombre del producto',
                error: 'El campo es requerido',
            },
            barcode: {
                label: 'Código de barras',
                error: 'El campo es requerido',
            },
            brand: {
                label: 'Marca',
                error: 'El campo es requerido',
            },
            amount: {
                label: 'Cantidad',
                error: 'El campo es requerido',
            },
            unit: {
                label: 'Unidad',
                error: 'El campo es requerido',
            },
            group: {
                label: 'Grupo',
                error: 'El campo es requerido',
            },
            line: {
                label: 'Línea',
                error: 'El campo es requerido',
            },
            type: {
                label: 'Tipo',
                error: 'El campo es requerido',
            },
        },
        option: {
            changeImage: 'Cambiar imagen',
        },
    },

    modal: {
        reject: {
            subject: 'Selecciona un motivo de rechazo',
        }
    },

    toast: {
        sendCriterion: {
            success: {
                title: 'Notificación de éxito. ',
                message: 'Se ha rechazado la captura correctamente.',
            },
            error: {
                title: 'Notificación de error. ',
                message: 'Error con la petición.',
            },
        }
    },

    radioMapFirst: {
        blurry: 'Captura borrosa',
        farAway: 'Captura lejana',
        dark: 'Captura oscura',
        incomplete: 'Descripción de producto incompleta',
        doesntMatch: 'Productos que no coinciden',
    },

    radioSecond: {
        outsideShop: 'Captura fuera de tienda',
        shopTicket: 'Captura de tickets de compra',
        anotherCell: 'Captura tomada a otro celular',
        testScan: 'Pruebas',
    },

    history: {
        recent: 'Más reciente',
        mostExpensive: 'Más alto',
        cheapest: 'Más bajo',
        cheapestWithPromotion: 'Más bajo con promoción',
    },
}
