export default {
    title: 'Lines',
    search: 'Search a line',
    searchByName: 'Search by name ',
    actions: {
        add: 'Add line',
        download: 'Download Report',
    },
    table: {
        headers: {
            name_line: 'Line',
            name_group: 'Group',
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
                message: 'Line created succesfully. ',
            }
        },
        delete: {
            success: {
                title: 'Success Notification.',
                message: 'Line has been deleted succesfully. ',
            }
        },
        edit: {
            success: {
                title: 'Success Notification.',
                message: 'Line has been edited succesfully.',
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
            title: 'Create line',
        },
        editModal: {
            title: 'Edit line',
        },
        options: {
            save: 'Save',
            create: 'Create',
        },
    },
}
