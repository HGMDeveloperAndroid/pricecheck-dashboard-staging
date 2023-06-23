import React, { PureComponent, Component, ReactNode } from 'react'

import PlacesAutocomplete, { geocodeByAddress, getLatLng,} from 'react-places-autocomplete';

import Input from '../input/Input'
import Head from 'next/head';

type Props = {
    address: string,
    onChange: Function,
    onSelect: Function,
}

type Suggestion ={
    description: string,
}

type IProps = {
    getInputProps: Function,
    suggestions: Array<Suggestion>,
    getSuggestionItemProps: Function,
    loading: Boolean,
}

class LocationSearch extends PureComponent<Props>{

    render(){
        const { address, onChange, onSelect} = this.props
        return(
            <div>
            <Head><script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB53WxFkvRCwORxy27DWzEI8z6MEsrquyU&libraries=places"></script></Head>
            <PlacesAutocomplete value={address} onChange={(e:any) => onChange(e)} onSelect={(e:any)=> onSelect(e)} googleCallbackName="myCallbackFunc" >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }: IProps) => (
                    <div>
                        {/* <Input type="text" placeholder="Dirección" onChange={(e: any)=>onChange(e)}/>  */}
                        <input {...getInputProps()}/>
                        <div style={{backgroundColor: 'red', width: '10rem', height:'10rem', zIndex: 100}}>

                            { !loading &&
                                    suggestions.map((suggestion: { description: string })=>{
                                    return (
                                        <p {...getSuggestionItemProps(suggestion)}>{suggestion.description}</p>
                                    )
                                })
                            }
                        </div>
                    </div>
                )}
            </PlacesAutocomplete>
            </div>
        )
    }
}

export default LocationSearch