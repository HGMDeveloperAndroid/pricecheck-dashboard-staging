export default {
    title: 'Regiones',
    search: 'Buscar una región',
    searchByName: 'Buscar por nombre ',
    actions: {
        add: 'Añadir región',
        download: 'Descargar Reporte',
    },
    table: {
        headers: {
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
                message: 'Se ha creado la región correctamente. ',
            }
        },
        delete: {
            success: {
                title: 'Notificación de éxito.',
                message: 'Se ha eliminado la región correctamente. ',
            }
        },
        edit: {
            success: {
                title: 'Notificación de éxito.',
                message: 'Se ha editado la región correctamente.',
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
            title: 'Crear región',
        },
        editModal: {
            title: 'Editar región',
        },
        options: {
            save: 'Guardar',
            create: 'Crear',
        },
    },
}
