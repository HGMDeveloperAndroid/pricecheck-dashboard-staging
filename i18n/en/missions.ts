export default {
    title: 'MISSIONS',
    table: {
        head: {
            title: 'Title',
            description: 'Description',
            capture_points: 'Capture Points',
            mission_points: 'Mission Points',
            start_date: 'Start Date',
            end_date: 'End Date',
            regions: 'Region',
            actions: 'Actions',
        },
    },
    options: {
        add: 'New Mission',
    },

    toast: {
        createMission: {
            success: {
                title: 'Success Notification. ',
                message: 'The mission has been created correctly. ',
            },
            error: {
                title: 'Error Notification. ',
                duplicatedMessage: 'Duplicated  Title.',
                message: 'Something went wrong. ',
            },
        },
    },

    modal: {
        dialog: {
            message: 'This operation cannot be performed because the mission has associated captures',
            options: {
                acept: 'Acept',
            },
        },
        add: {
            title: 'New Mission',
            options: {
                cancel: 'Cancel',
                create: 'Create',
            },
        },
        edit: {
            title: 'Edit Mission',
            options: {
                cancel: 'Cancel',
                edit: 'edit',
            },
        },
        input: {
            title: {
                label: 'Title (required)',
                validations: {
                    required: 'The field is required',
                },
            },
            description: {
                label: 'Description (required / max 255 characters)',
                validations: {
                    required: 'The field is required',
                    minLength: 'The description most have at least 5 characters.',
                    maxLength: 'The description most have max 255 characters.',
                },
            },
            startDate: {
                label: 'Start Date',
                validations: {
                    required: 'Start date is not valid',
                    greaterThan: 'Start date must be greater than yesterday.',
                },
            },
            endDate: {
                label: 'End Date',
                validations: {
                    required: 'End date is not valid',
                },
            },
            region: {
                label: 'Select a region',
                validations: {
                    required: 'You must select at least one region',
                },
            },
            missionPoints: {
                label: 'Points by Mission',
                validations: {
                    valid: 'The score must be a valid number',
                },
            },
            capturePoints: {
                label: 'Points by capture',
                validations: {
                    valid: 'The score must be a valid number',
                },
            },
        },
    },
};
