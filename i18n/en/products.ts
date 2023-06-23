export default {
    title: 'PRODUCTS',
    filters: {
        searchField: 'Search by  name or product code',
        startDate: 'From',
        endDate: 'To',
        updatedAt: 'Modification Date',
        createdAt: 'Create Date',
        param: 'Parameter',
        value: 'Value',
    },
    actions: {
        search: 'Search',
        cleanFilter: 'Clean Filters',
        download: 'Download',
        comparativeChart: 'Graph comparatives',
    },
    optionsCatalog: {
        brandsCatalog: 'Brand',
        groupsCatalog: 'Group',
        linesCatalog: 'Line',
        storesCatalog: 'Chain',
        unitsCatalog: 'Unit',
    },
    modal: {
        delete: {
            buttonAcceptLabel: 'Eliminate',
            message: '',
        }
    },
    table: {
        head: {
            selected: 'Select',
            photo: 'Product Photo',
            product: 'Name',
            barcode: 'Code',
            brand: 'Brand',
            type: 'Type',
            created_at: 'Capture Date',
            updated_at: 'Modification Date',
            grammage_quantity: 'Quantity',
            unit: 'Unit',
            group: 'Group',
            line: 'Line',
            highest_price: 'Highest Price',
            lower_price: 'Lowest Price',
            promotion_lower_price: 'Lowest  Price with promo',
            last_price: 'Last price captured',
        },
    },
};
