import 'bootstrap/dist/css/bootstrap.css'
import 'react-datepicker/dist/react-datepicker.css';
import '../sass/main.scss'
import '../sass/maps.scss';
// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <React.Fragment>
      {/* <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB53WxFkvRCwORxy27DWzEI8z6MEsrquyU&libraries=places&callback=myCallbackFunc"></script> */}
      <link href="https://fonts.googleapis.com/css2?family=Catamaran&display=swap" rel="stylesheet"/>
      <Component {...pageProps} />
    </React.Fragment>
  )
}
