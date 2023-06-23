export default {
    title: 'Marcas',
    table: {
        headers: {
            name: 'Nombre',
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
                message: 'Se ha creado la marca correctamente. ',
            }
        },
        delete: {
            success: {
                title: 'Notificación de éxito.',
                message: 'Se ha eliminado la marca correctamente. ',
            }
        },
        edit: {
            success: {
                title: 'Notificación de éxito.',
                message: 'Se ha editado la marca correctamente.',
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
            title: 'Crear marca',
            search: 'Buscar una marca',
            searchByName: 'Buscar por nombre ',
        },
        editModal: {
            title: 'Editar marca',
        },
        actions: {
            add: 'Añadir marca',
            download: 'Descargar Reporte',
        },
        options: {
            save: 'Guardar',
            create: 'Crear',
        },
    },
}
