import React, { PureComponent, Component } from 'react'

import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api'

type Props = {
    lat: any,
    lng: any,
}

class Map extends Component<Props>{
    
    render(){

        const { lat, lng } = this.props
    

        const center={
            lat: lat,
            lng: lng
        }

        const containerStyle = {
            width: '100%',
            height: '100%'
        };
        return(
            <LoadScript
            googleMapsApiKey="AIzaSyB53WxFkvRCwORxy27DWzEI8z6MEsrquyU"
        >
            <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={17}
            >
            { /* Child components, such as markers, info windows, etc. */
                <Marker position={{lat: lat, lng: lng}}></Marker>
            }
            <></>
            </GoogleMap>
        </LoadScript>
        )
    }
}

export default Map