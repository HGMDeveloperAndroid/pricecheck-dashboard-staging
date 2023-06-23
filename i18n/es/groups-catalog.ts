export default {
    title: 'Grupos',
    search: 'Buscar un grupo',
    searchByName: 'Buscar por nombre ',
    actions: {
        add: 'Añadir grupo',
        download: 'Descargar Reporte',
    },
    table: {
        headers: {
            name: 'Nombre',
            abbreviation: 'Abreviación',
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
                message: 'Se ha creado el grupo correctamente. ',
            }
        },
        delete: {
            success: {
                title: 'Notificación de éxito.',
                message: 'Se ha eliminado el grupo correctamente. ',
            }
        },
        edit: {
            success: {
                title: 'Notificación de éxito.',
                message: 'Se ha editado el grupo correctamente.',
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
            title: 'Crear grupo',
        },
        editModal: {
            title: 'Editar grupo',
        },
        options: {
            save: 'Guardar',
            create: 'Crear',
        },
    },
}
