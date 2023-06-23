export default {
    title: 'MISIONES',
    table: {
        head: {
            title: 'Título',
            description: 'Descripción',
            capture_points: 'Puntos por capturas',
            mission_points: 'Puntos por misión',
            start_date: 'Fecha de inicio',
            end_date: 'Fecha de fin',
            regions: 'Región',
            actions: 'Acciones',
        },
    },
    options: {
        add: 'Nueva misión',
    },

    toast: {
        createMission: {
            success: {
                title: 'Notificación de éxito. ',
                message: 'Se ha creado la misión correctamente. ',
            },
            error: {
                title: 'Notificación de error. ',
                duplicatedMessage: 'El Titulo se duplicó.',
                message: 'Algo salió mal. ',
            },
        },
    },

    modal: {
        dialog: {
            message: 'Esta operación no se puede realizar debido a que la misión tiene capturas asociadas',
            options: {
                acept: 'Aceptar',
            },
        },
        add: {
            title: 'Nueva misión',
            options: {
                cancel: 'Cancelar',
                create: 'Crear',
            },
        },
        edit: {
            title: 'Editar misión',
            options: {
                cancel: 'Cancelar',
                edit: 'editar',
            },
        },
        input: {
            title: {
                label: 'Título (obligatorio)',
                validations: {
                    required: 'El campo es requerido',
                },
            },
            description: {
                label: 'Descripción (obligatorio / máximo 255 caracteres)',
                validations: {
                    required: 'El campo es requerido',
                    minLength: 'La descripción debe tener por lo menos 5 caracteres.',
                    maxLength: 'La descripción debe tener máximo 255 caracteres.',
                },
            },
            startDate: {
                label: 'Fecha de inicio',
                validations: {
                    required: 'La fecha de inicio no es válida',
                    greaterThan: 'La fecha de inicio debe ser mayor al día de ayer.',
                },
            },
            endDate: {
                label: 'Fecha de fin',
                validations: {
                    required: 'La fecha de fin no es válida',
                },
            },
            region: {
                label: 'Selecciona una región',
                validations: {
                    required: 'Debes seleccionar por lo menos una región',
                },
            },
            missionPoints: {
                label: 'Puntaje de la misión',
                validations: {
                    valid: 'El puntaje debe ser un número válido',
                },
            },
            capturePoints: {
                label: 'Puntaje de captura',
                validations: {
                    valid: 'El puntaje debe ser un número válido',
                },
            },
        },
    },
};
