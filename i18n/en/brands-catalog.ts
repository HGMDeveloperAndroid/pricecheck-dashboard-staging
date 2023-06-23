export default {
    title: 'Brands',
    table: {
        headers: {
            name: 'Name',
        },
    },
    toast: {
        success: {
            title: 'Edit brand',
        },
        error: {
            title: 'Error in  the Request.',
            message: 'Error in the Request.',
        },
        createBrand: {
            success: {
                title: 'Success Notification.',
                message: 'The Brand has been created succesfully. ',
            }
        },
        deleteBrand: {
            success: {
                title: 'Success Notification.',
                message: 'The brand has been removed succesfully. ',
            }
        },
        editBrand: {
            success: {
                title: 'Success Notification.',
                message: 'The brand has been edited correctly.',
            }
        },
        downloadData: {
            success: {
                title: 'Success Notification.',
                message: 'The report has been downloaded successfully  .',
            }
        },
    },
    modal: {
        createModal: {
            title: 'Create Brand',
            search: 'Search Brand',
            searchByName: 'Search by brand ',

        },
        editModal: {
            title: 'Edit brand',
        },
        actions: {
            add: 'Add Brand',
            download: 'Download Report',
        },
        options: {
            save: 'Save',
            create: 'Create',
        },
    },
}
