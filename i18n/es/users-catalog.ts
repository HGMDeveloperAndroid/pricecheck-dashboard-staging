export default {
    title: 'Usuarios',
    search: 'Buscar un usuario',
    searchByName: 'Buscar por nombre, usuario, email, etiquetas, o número de empleado.',
    tags: 'Etiquetas',
    actions: {
        add: 'Crear nuevo usuario',
        addTags: 'Agregar etiquetas',
        close: 'Cerrar',
        download: 'Descargar Reporte',
    },
    filters: {
        role: 'Filtrar por rol',
        region: 'Filtrar por región',
        allRegions: 'Todas las regiones',
    },
    table: {
        headers: {
            first_name: 'Nombre',
            last_name: 'Apellido paterno',
            mother_last_name: 'Apellido materno',
            username: 'Usuario',
            email: 'Correo electrónico',
            employee_number: 'No. de empleado',
            rolSelected: 'Rol',
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
                message: 'Se ha creado el usuario correctamente. ',
            }
        },
        delete: {
            success: {
                title: 'Notificación de éxito.',
                message: 'Se ha eliminado el usuario correctamente. ',
            }
        },
        edit: {
            success: {
                title: 'Notificación de éxito.',
                message: 'Se ha editado el usuario correctamente.',
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
            title: 'Crear usuario',
        },
        editModal: {
            title: 'Editar usuario',
        },
        options: {
            save: 'Guardar',
            create: 'Crear',
        },
    },
}
