export default {
    title: 'Users',
    search: 'Search User',
    searchByName: 'Search by name, user, email, tags or employee number.',
    tags: 'Tags',
    actions: {
        add: 'Create new user',
        addTags: 'Add Tags',
        close: 'Close',
        download: 'Download Report',
    },
    filters: {
        role: 'Filter by role',
        region: 'Filter by region',
        allRegions: 'All Regions',
    },
    table: {
        headers: {
            first_name: 'Name',
            last_name: 'Last Name',
            mother_last_name: 'Mothers Last Name',
            username: 'User',
            email: 'EMail',
            employee_number: 'Employee Number',
            rolSelected: 'Role',
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
                message: 'User has been created succesfully. ',
            }
        },
        delete: {
            success: {
                title: 'Success Notification.',
                message: 'User has been deleted succesfully. ',
            }
        },
        edit: {
            success: {
                title: 'Success Notification.',
                message: 'User has been edited successfully.',
            }
        },
        downloadData: {
            success: {
                title: 'Success Notification.',
                message: 'Report downloaded successfully.',
            }
        },
    },
    modal: {
        createModal: {
            title: 'Create user',
        },
        editModal: {
            title: 'Edita User',
        },
        options: {
            save: 'Save',
            create: 'Create',
        },
    },
}
