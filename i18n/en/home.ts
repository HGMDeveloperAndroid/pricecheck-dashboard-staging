export default {
    title: 'Validation',
    welcome: 'Select a capture to start.',
    sidebar: {
        title: 'Captures',
        input: {
            mission: {
                label: 'Mission',
                placeholder: '',
            },
            product: {
                label: 'Product',
                placeholder: '',
            },
        },
        scanFilter: {
            all: 'All',
            withProduct: 'With product',
            withoutProduct: 'Without product',
        },
    },

    scan: {
        topBar: {
            beingValidated: 'This register is being validated, select another one',
            withoutNumber: 'Without Number',
            withoutMission: 'Without Mission',
        },
        productImage: {
            label: 'Product',
        },
        priceImage: {
            label: 'Price',
        },
        input: {
            barcode: {
                label: 'Barcode',
                error: 'The Field is required',
            },
            price: {
                label: 'Price',
                error: 'The field is required',
            },
            promotionPrice: {
                label: 'Promo Price',
                error: 'The Field is required',
            },
            store: {
                label: 'Branch',
                error: 'The field is required',
            },
            address: {
                label: 'Address',
                error: 'The field is required',
            },
            aditionalComments: {
                label: 'Additional comments',
                error: 'The field is required',
            },
        },
        option: {
            showPicture: 'Show Photo',
            reject: 'Reject',
            validate: 'Validate capture',
            validateAndAdd: 'Validate and Add',
        },
    },

    product: {
        title: 'Create new product',
        input: {
            name: {
                label: 'Product Name',
                error: 'The field is required',
            },
            barcode: {
                label: 'Barcode',
                error: 'The field is required',
            },
            brand: {
                label: 'Brand',
                error: 'The field is required',
            },
            amount: {
                label: 'Quantity',
                error: 'The field is required',
            },
            unit: {
                label: 'Unit',
                error: 'The field is required',
            },
            group: {
                label: 'Group',
                error: 'The field is required',
            },
            line: {
                label: 'Line',
                error: 'The field is required',
            },
            type: {
                label: 'Type',
                error: 'The field is required',
            },
        },
        option: {
            changeImage: 'Change image',
        },
    },

    modal: {
        reject: {
            subject: 'Select a reason of rejection',
        }
    },

    toast: {
        sendCriterion: {
            success: {
                title: 'Success Notification. ',
                message: 'Capture was rejected succesfully.',
            },
            error: {
                title: 'Error Notification. ',
                message: 'Error with  the  request.',
            },
        }
    },

    radioMapFirst: {
        blurry: 'Blurry  Caption',
        farAway: 'Distant Capture',
        dark: 'Dark Capture',
        incomplete: 'Product description incomplete',
        doesntMatch: 'Mismatched Products',
    },

    radioSecond: {
        outsideShop: 'Capture out of store',
        shopTicket: 'Ticket Capture',
        anotherCell: 'Capture taken with another cellphone',
        testScan: 'Tests',
    },

    history: {
        recent: 'Most Recent',
        mostExpensive: 'Most Expensive',
        cheapest: 'Cheapest',
        cheapestWithPromotion: 'Cheapest with  Promo',
    },
}
