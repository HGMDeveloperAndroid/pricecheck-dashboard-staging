import React from "react";
import {
  GoogleMap,
  useLoadScript,
} from "@react-google-maps/api";


const mapContainerStyle = {
  height: "30vw",
  width: "100%",
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};
const center  = {
  lat: 19.4978,
  lng: -99.1269,
};
const libraries = ["drawing"];

export default function MapsGoogle(props) {
  const { setCoordsMap, report} = props;
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyB53WxFkvRCwORxy27DWzEI8z6MEsrquyU",
    libraries,

  });
  const onRectangleComplete = rectangle => {
    var bounds = rectangle.getBounds();
    const NE = bounds.getNorthEast();
    const SW = bounds.getSouthWest();
    // North West
    const NW = new google.maps.LatLng(NE.lat(),SW.lng());
    // South East
    const SE = new google.maps.LatLng(SW.lat(),NE.lng());
    const newCoords = {
        id: 0,
        name: '',
        position1:{
          latitude:NW.lat(),
          longitude:NW.lng()},
        position2:{
          latitude:NE.lat(),
          longitude:NE.lng()},
        position3:{
          latitude:SW.lat(),
          longitude:SW.lng()},
        position4:{
          latitude:SE.lat(),
          longitude:SE.lng()}
      };
    setCoordsMap(newCoords);
    // console.log('newCoords',newCoords)
    // console.log('report',report)
    // drawingManager.setMap(null);
    google.maps.event.addListener(rectangle, 'bounds_changed', () => boundsChanged(rectangle));
  }
  const boundsChanged = (rectangle) => {
    var bounds = rectangle.getBounds();
    // console.log('bounds',bounds);
    const NE = bounds.getNorthEast();
    const SW = bounds.getSouthWest();
    // North West
    const NW = new google.maps.LatLng(NE.lat(),SW.lng());
    // South East
    const SE = new google.maps.LatLng(SW.lat(),NE.lng());
    const newCoords = {
      id: 0,
      name: '',
      position1:{
        latitude:NW.lat(),
        longitude:NW.lng()},
      position2:{
        latitude:NE.lat(),
        longitude:NE.lng()},
      position3:{
        latitude:SW.lat(),
        longitude:SW.lng()},
      position4:{
        latitude:SE.lat(),
        longitude:SE.lng()}
    };
    setCoordsMap(newCoords);
  }

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {

    
    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
        ],
      },
      rectangleOptions: {
        editable: true,
        zIndex: 1,
        draggable: true,
      }
    });

    if (report.position1.latitude && report.position1.latitude[0] == NaN ){
      var bounds = {
        north: parseFloat (report.position1.latitude[0]),
        south: parseFloat(report.position3.latitude[0]),
        east: parseFloat(report.position2.longitude),
        west: parseFloat(report.position1.longitude),
      };
    }else{
      var bounds = {
        north: parseFloat (report.position1.latitude),
        south: parseFloat(report.position3.latitude),
        east: parseFloat(report.position2.longitude),
        west: parseFloat(report.position1.longitude),
      };
    }
    console.log('report nan',report.position1 == [])
    console.log('report nan',report.position1.length)
    if(report.position1.length == 0 && report.position2.length == 0 && report.position3.length == 0 && report.position4.length == 0){
      bounds =  {
          north:19.46154886259391,
          south: 19.272394000451268,
          east: -99.01978330453124,
          west:-99.3136675775
        }
    }
      console.log("Onloadmap report", report);
      console.log("OnloadMap bounds", bounds);
      
      var rectangle = new google.maps.Rectangle({
        bounds: bounds,
        editable: true,
        draggable: true,
      });
      rectangle.setEditable(true);
      rectangle.setMap(map);
      google.maps.event.addListener(rectangle, 'bounds_changed', () => boundsChanged(rectangle));
    
    google.maps.event.addListener(drawingManager, 'rectanglecomplete', onRectangleComplete);
    // bounds_changed
    drawingManager.setMap(map);
    
    mapRef.current = map;
  }, []);



  // if (loadError) return "Error";
  // if (!isLoaded) return "Loading...";
  return <>
              {!isLoaded ?
               'Cargando mapa...' :
                <div>
                  <GoogleMap
                    id="map"
                    mapContainerStyle={mapContainerStyle}
                    zoom={8}
                    center={center}
                    options={options}
                    onClick={() => {}}
                    onLoad={onMapLoad}
                  >
                  </GoogleMap>
                </div>
              }
              {loadError ? 'Error' : ''}
          </>;
}
