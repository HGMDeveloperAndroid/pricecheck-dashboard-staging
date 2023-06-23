const LightenDarkenColor = (col: string, amt: number) => {
    let usePound = false;

    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    let num = parseInt(col, 16);

    let r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    let b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    let g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);

}

export const buildTheme = (theme) => {
    if (theme && Object.keys(theme).length !== 0) {
        const lighten = theme?.wallpaper && `${LightenDarkenColor(theme.wallpaper, 20)} !important`;
        const darken = theme?.wallpaper && `${LightenDarkenColor(theme.wallpaper, -20)} !important`;
        const fontDarken = theme?.text && `${LightenDarkenColor(theme.text, -20)} !important`;
        const fontLighter = theme?.text && `${LightenDarkenColor(theme.text, 60)} !important`;
        return `
        .custom {
            --bgColor: ${theme.wallpaper};
            --font: ${theme.font};
            --textColor: ${theme.text};
            --bgBtnPrimary: ${theme.primary_button};
            --bgBtnSecondary: ${theme.secondary_button};
            --btnPrimaryText: ${theme.primary_text};
            --btnSecondaryText: ${theme.secondary_text};
    
            color: var(--textColor) !important;
            font-family: var(--font) !important;
            background-color: var(--bgColor) !important;
       }
        .custom-font, .custom-block-woodsmoke, .custom [class^='home_messageNoElementsContainer'], .custom [class^='header_header'], .custom [class^='header_optionsList'], .custom [class^='header_leftContainer'], .custom [class^='header_dropdown'], .custom [class^='advanced-search_container'], .custom [class^="input_input"], .custom [class^="advanced-search_inputSearch"], .custom [class^='modal_modal_'], .custom [class^="select_select"], .custom [class^="react-datepicker-popper"], .custom [class^="home_dataContainer"], .custom [class^="home_historyContainer"], .custom [class^="home_productDataContainerCompleted"], .custom [class^="home_productDataContainer"], .custom [class^="home_scannerDataContainer"], .custom [class^="modal_dialogModal"], .custom [class^="productDetails_price"], .custom [class^="productCompareDetails_graphContainer"], .custom [class^="productDetails_graphContainer"], .custom [class^="detailsContainer_details"], .custom [class^="react-datepicker-popper"] .react-datepicker__header, .custom [class^="react-datepicker-popper"] .react-datepicker, .custom-font *, .custom-block-woodsmoke *, .custom [class^='home_messageNoElementsContainer'] *, .custom [class^='header_header'] *, .custom [class^='header_optionsList'] *, .custom [class^='header_leftContainer'] *, .custom [class^='header_dropdown'] *, .custom [class^='advanced-search_container'] *, .custom [class^="input_input"] *, .custom [class^="advanced-search_inputSearch"] *, .custom [class^='modal_modal_'] *, .custom [class^="select_select"] *, .custom [class^="react-datepicker-popper"] *, .custom [class^="home_dataContainer"] *, .custom [class^="home_historyContainer"] *, .custom [class^="home_productDataContainerCompleted"] *, .custom [class^="home_productDataContainer"] *, .custom [class^="home_scannerDataContainer"] *, .custom [class^="modal_dialogModal"] *, .custom [class^="productDetails_price"] *, .custom [class^="productCompareDetails_graphContainer"] *, .custom [class^="productDetails_graphContainer"] *, .custom [class^="detailsContainer_details"] *, .custom [class^="react-datepicker-popper"] .react-datepicker__header *, .custom [class^="react-datepicker-popper"] .react-datepicker * {
            color: var(--textColor) !important;
       }
        .custom-block-woodsmoke, .custom [class^='home_messageNoElementsContainer'], .custom [class^='header_header'], .custom [class^='header_optionsList'], .custom [class^='header_leftContainer'], .custom [class^='header_dropdown'], .custom [class^='advanced-search_container'], .custom [class^="input_input"], .custom [class^="advanced-search_inputSearch"], .custom [class^='modal_modal_'], .custom [class^="select_select"], .custom [class^="react-datepicker-popper"], .custom [class^="home_dataContainer"], .custom [class^="home_historyContainer"], .custom [class^="home_productDataContainerCompleted"], .custom [class^="home_productDataContainer"], .custom [class^="home_scannerDataContainer"], .custom [class^="modal_dialogModal"], .custom [class^="productDetails_price"], .custom [class^="productCompareDetails_graphContainer"], .custom [class^="productDetails_graphContainer"], .custom [class^="detailsContainer_details"], .custom [class^="react-datepicker-popper"] .react-datepicker__header, .custom [class^="react-datepicker-popper"] .react-datepicker {
            background: var(--bgColor)!important;
       }
        .custom-link, .custom a, .custom [class^='home_messageNoElementsContainer'], .custom [class^='header_header'], .custom [class^='header_optionsList'], .custom [class^='header_leftContainer'], .custom [class^='header_dropdown'], .custom [class^='advanced-search_container'], .custom [class^="input_input"], .custom [class^="advanced-search_inputSearch"], .custom [class^='modal_modal_'], .custom [class^="select_select"], .custom [class^="react-datepicker-popper"], .custom [class^='home_messageNoElementsContainer'] a, .custom [class^='header_header'] a, .custom [class^='header_optionsList'] a, .custom [class^='header_leftContainer'] a, .custom [class^='header_dropdown'] a, .custom [class^='advanced-search_container'] a, .custom [class^="input_input"] a, .custom [class^="advanced-search_inputSearch"] a, .custom [class^='modal_modal_'] a, .custom [class^="select_select"] a, .custom [class^="react-datepicker-popper"] a {
            color: ${fontLighter};
       }
        .custom-link:hover, .custom a:hover, .custom [class^='home_messageNoElementsContainer']:hover, .custom [class^='header_header']:hover, .custom [class^='header_optionsList']:hover, .custom [class^='header_leftContainer']:hover, .custom [class^='header_dropdown']:hover, .custom [class^='advanced-search_container']:hover, .custom [class^="input_input"]:hover, .custom [class^="advanced-search_inputSearch"]:hover, .custom [class^='modal_modal_']:hover, .custom [class^="select_select"]:hover, .custom [class^="react-datepicker-popper"]:hover, .custom [class^='home_messageNoElementsContainer'] a:hover, .custom [class^='header_header'] a:hover, .custom [class^='header_optionsList'] a:hover, .custom [class^='header_leftContainer'] a:hover, .custom [class^='header_dropdown'] a:hover, .custom [class^='advanced-search_container'] a:hover, .custom [class^="input_input"] a:hover, .custom [class^="advanced-search_inputSearch"] a:hover, .custom [class^='modal_modal_'] a:hover, .custom [class^="select_select"] a:hover, .custom [class^="react-datepicker-popper"] a:hover {
            color: ${fontLighter};
       }
        .custom [class^="home_historyContainer"]:not(.productHistoryContainer) [class^="square_square"] {
            color: var(--textColor) !important;
            background: var(--bgColor) !important;
       }
        .custom [class^='optionList_tabBar'] [class^='optionList_selected'] {
            background: var(--bgColor) !important;
       }
        .custom [class^='optionList_tabBar'] li {
            background: var(--bgColor) !important;
       }
        .custom .table, .custom [class^='table_tableComplex'] {
            background: ${lighten};
            color: ${fontDarken};
            box-shadow: 0px 10px 10px -6px black;
            
       }
        .custom .table th, .custom [class^='table_tableComplex'] th {
            background: ${darken};

       }
        .custom .table tr:nth-child(odd), .custom [class^='table_tableComplex'] tr:nth-child(odd) {
            background: ${lighten};
       }
        .custom [class^="modal_dialogModalContainer"], .custom [class^="modal_modalContainer"] {
            background: ${lighten};
       }
        .custom [class^="input_blackInput"] {
            color: var(--btnPrimaryText) !important;
            background: var(--bgBtnPrimary) !important;
       }
        .custom [class^="button_primaryButton__27mbY"] {
            color: var(--btnPrimaryText) !important;
            background: var(--bgBtnPrimary) !important;
            text-align: center;
            text-transform: uppercase;
            font-weight: bold;
            padding: 0.5em;
            width: 100%;
            border: 2px solid var(--bgBtnPrimary) !important;
            border-radius: 0.5rem;
       }
       .custom [class^="button_secondaryButton__1N1vM"] {
            color: var(--btnSecondaryText) !important;
            background: var(--bgBtnSecondary) !important;
            text-align: center;
            text-transform: uppercase;
            font-weight: bold;
            padding: 0.5em;
            width: 100%;
            border: 2px solid ;
            border-radius: 0.5rem;
        }
        .custom [class^="home_capturesList"] p {
            color: var(--textColor) !important;
       }
        .custom [class^="home_capturesList"] p[class^="home_withProduct"] {
            color: var(--btnSecondaryText) !important;
       }
        .custom [class^="react-datepicker-popper"] .react-datepicker__day--keyboard-selected {
            background: #de3c26 !important;
       }
        .custom [class^="react-datepicker-popper"] .react-datepicker__day:hover {
            background: #1f2223 !important;
       }
       .custom [class^="home_messageNoElementsContainer__1q9IW"] {
            background: var(--bgBtnPrimary) !important;
            color: var(--btnPrimaryText) !important;
        }
        .custom [class^="btn-theme"] {
            background: var(--bgBtnPrimary) !important;
            color: var(--btnPrimaryText) !important;
        }
        .custom [class^="btn"] {
            background: var(--bgBtnPrimary) !important;
            color: var(--btnPrimaryText) !important;
        }
        .custom [class^="input_errorMessage__16yxH"] {
            color: red !important;
        }
        .current-product {
            background: var(--bgBtnPrimary) !important;
        }

        .custom .react-autosuggest__input::placeholder {  
            color: ${fontLighter};
        }
        .custom .react-autosuggest__input {
            min-width: 100%;
            width: 100%;
            height: 30px;
            font-family: "Catamaran", sans-serif;
            font-weight: 300;
            font-size: 0.9em;
            border: none;
            color: ${fontLighter};
            border-bottom: 1px solid #565656;
            border-radius: 0;
            -webkit-appearance: none;
            background-color: transparent;
          }
          .product-report_divContent__2U1XK {
            background: var(--bgBtnPrimary) !important;
          }
          .card_text-border__aIQRZ {
            color: var(--textColor) !important;
            font-weight: bold !important;
          }
          .card_border-product__3pKKS {
            color: var(--textColor) !important;
          }
          .product-report_tags__OG2vn {
            border: 2px solid ${fontLighter};
          }
          .product-report_btnToggle__1IR7O {
            color: var(--textColor) !important; 
          }
    `
    }
    return "";

}
