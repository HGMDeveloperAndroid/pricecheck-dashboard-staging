export default {
    detail:{
        input: {
            productId: {
                label: 'Product ID',
            },
            barcode: {
                label: 'Barcode',
            },
            name: {
                label: 'Name',
                validations: {
                    minLength: 'The field must have at  least two characters',
                },
            },
            brand: {
                label: 'Brand',
            },
            type: {
                label: 'Type',
            },
            group: {
                label: 'Group',
            },
            line: {
                label: 'Line',
            },
            amount: {
                label: 'Grammage / Quantity',
                validations: {
                    valid: 'The grammage or quantity must be a valid number: Two decimals max.',
                },
            },
            unit: {
                label: 'Unit',
            },
            mainImage: {
                label: 'Main Photo',
            },
            priceImage: {
                label: 'Price Photo',
            },
            minPrice: {
                label: 'Lowest Price',
            },
            maxPrice: {
                label: 'Highest Price',
            },
        },
        detailsContainer: {
            title: 'Product Price',
        },
        options: {
            cancel: 'Cancel',
            changeImage: 'Change Photo',
            editInformation: 'Edit Information',
            saveInformation: 'Save Information',
        },
    },
}
