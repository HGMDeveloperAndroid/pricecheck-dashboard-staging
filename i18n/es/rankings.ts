export default {
    title: 'Rankings',
    tabs: {
        capturists: {
            title: 'capturistas',
            startDate: 'Fecha inicial',
            endDate: 'Fecha final',
            input: {
                search: {
                    placeholder: 'Buscar por nombre o número de empleado',
                },
            },
            options: {
                clearDate: 'Limpiar fechas',
            },
            table: {
                header: {
                    position: 'Posición',
                    employeeNumber: 'No. de empleado',
                    name: 'Nombre',
                    percentage: 'Porcentaje',
                    validatedCaptures: 'Capturas validadas',
                    points: 'Puntos',
                }
            },
        },
        validators: {
            title: 'Validadores',
            startDate: 'Fecha inicial',
            endDate: 'Fecha final',
            input: {
                search: {
                    placeholder: 'Buscar por nombre o número de empleado',
                },
            },
            options: {
                clearDate: 'Limpiar fechas',
                generateData: 'Generar datos',
            },
            total: {
                captures: 'Total de capturas',
                validated: 'Total validadas',
            },
            history: {
                captures: 'Historial de capturas',
                validated: 'Historial de validadas',
            },
            table: {
                header: {
                    employeeNumber: 'No. de empleado',
                    nombre: 'Nombre',
                    percentage: 'Porcentaje',
                    validatedCaptures: 'Capturas validadas',
                },
            },
        },
    },
};
