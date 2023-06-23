export default {
    title: 'Regions',
    search: 'Search by Region',
    searchByName: 'Search by Name ',
    actions: {
        add: 'Add Region',
        download: 'Download Report',
    },
    table: {
        headers: {
            name: 'Name',
            alias: 'Alias',
        },
    },
    toast: {
        success: {
            title: 'Success Notification.',
        },
        error: {
            title: 'Error with the Request.',
            message: 'Error with the Request.',
        },
        create: {
            success: {
                title: 'Success Notification.',
                message: 'Region created succesfully. ',
            }
        },
        delete: {
            success: {
                title: 'Success Notification.',
                message: 'Region has been deleted succesfully. ',
            }
        },
        edit: {
            success: {
                title: 'Success Notification.',
                message: 'Region has been edited succesfully.',
            }
        },
        downloadData: {
            success: {
                title: 'Success Notification.',
                message: 'Report  downloaded successfully.',
            }
        },
    },
    modal: {
        createModal: {
            title: 'Create Region',
        },
        editModal: {
            title: 'Edit Region',
        },
        options: {
            save: 'Save',
            create: 'Create',
        },
    },
}
