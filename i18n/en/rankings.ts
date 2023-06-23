export default {
    title: 'Rankings',
    tabs: {
        capturists: {
            title: 'Capturists',
            startDate: 'Start Date',
            endDate: 'End Date',
            input: {
                search: {
                    placeholder: 'Search by name or employee number',
                },
            },
            options: {
                clearDate: 'Clean Dates',
            },
            table: {
                header: {
                    position: 'Position',
                    employeeNumber: 'Employee number',
                    name: 'Name',
                    percentage: 'Percentaje',
                    validatedCaptures: 'Validated Captures',
                    points: 'Points',
                }
            },
        },
        validators: {
            title: 'Validators',
            startDate: 'Start Date',
            endDate: 'End Date',
            input: {
                search: {
                    placeholder: 'Search by name or employee number',
                },
            },
            options: {
                clearDate: 'Clean Dates',
                generateData: 'Generate Data',
            },
            total: {
                captures: 'Captures  Date',
                validated: 'Validated Total',
            },
            history: {
                captures: 'Captures History',
                validated: 'Validated History',
            },
            table: {
                header: {
                    employeeNumber: 'Employee Number',
                    nombre: 'Name',
                    percentage: 'Percentage',
                    validatedCaptures: 'Validated Captures',
                },
            },
        },
    },
};
