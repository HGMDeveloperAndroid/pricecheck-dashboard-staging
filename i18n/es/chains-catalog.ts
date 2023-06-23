export default {
    title: 'Cadenas',
    search: 'Buscar una cadena',
    searchByName: 'Buscar por nombre ',
    actions: {
        add: 'Añadir cadena',
        download: 'Descargar Reporte',
    },
    table: {
        headers: {
            id: 'Id',
            name: 'Nombre',
            alias: 'Alias',
        },
    },
    toast: {
        success: {
            title: 'Notificación de éxito.',
        },
        error: {
            title: 'Error con la petición.',
            message: 'Error con la petición.',
        },
        create: {
            success: {
                title: 'Notificación de éxito.',
                message: 'Se ha creado la cadena correctamente. ',
            }
        },
        delete: {
            success: {
                title: 'Notificación de éxito.',
                message: 'Se ha eliminado la cadena correctamente. ',
            }
        },
        edit: {
            success: {
                title: 'Notificación de éxito.',
                message: 'Se ha editado la cadena correctamente.',
            }
        },
        downloadData: {
            success: {
                title: 'Notificación de éxito.',
                message: 'Se ha descargado el reporte exitosamente.',
            }
        },
    },
    modal: {
        createModal: {
            title: 'Crear cadena',
        },
        editModal: {
            title: 'Editar cadena',
        },
        options: {
            save: 'Guardar',
            create: 'Crear',
        },
    },
}
