export default {
    title: 'Groups',
    search: 'Search a group',
    searchByName: 'Search by Name ',
    actions: {
        add: 'Add group',
        download: 'Download Report',
    },
    table: {
        headers: {
            name: 'Name',
            abbreviation: 'Abbreviation',
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
                message: 'Group has been created successfully. ',
            }
        },
        delete: {
            success: {
                title: 'Success Notification.',
                message: 'Group deleted successfully. ',
            }
        },
        edit: {
            success: {
                title: 'Success Notification.',
                message: 'Group has been edited successfully.',
            }
        },
        downloadData: {
            success: {
                title: 'Success Notification.',
                message: 'Report downloaded succesfully.',
            }
        },
    },
    modal: {
        createModal: {
            title: 'Create  group',
        },
        editModal: {
            title: 'Edit Group',
        },
        options: {
            save: 'Save',
            create: 'Create',
        },
    },
}
