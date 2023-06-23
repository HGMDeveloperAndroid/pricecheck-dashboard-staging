export default {
    title: 'Chains',
    search: 'Search  Chain',
    searchByName: 'Search by name ',
    actions: {
        add: 'Add Chain',
        download: 'Download Report',
    },
    table: {
        headers: {
            id: 'Id',
            name: 'Name',
            alias: 'Alias',
        },
    },
    toast: {
        success: {
            title: 'Success Notification.',
        },
        error: {
            title: 'Error with the request.',
            message: 'Error with the request.',
        },
        create: {
            success: {
                title: 'Success Notification.',
                message: 'Chain created successfully. ',
            }
        },
        delete: {
            success: {
                title: 'Success Notification.',
                message: 'Chain has been deleted successfully. ',
            }
        },
        edit: {
            success: {
                title: 'Success Notification.',
                message: 'The chain has been edited succesdully.',
            }
        },
        downloadData: {
            success: {
                title: 'Success Notification.',
                message: 'Report has been downloaded successfully.',
            }
        },
    },
    modal: {
        createModal: {
            title: 'Create Chain',
        },
        editModal: {
            title: 'Edit Chain',
        },
        options: {
            save: 'Save',
            create: 'Create',
        },
    },
}
