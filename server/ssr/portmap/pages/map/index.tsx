import React from 'react'
import { MKNPortMapProvider, PortMapControl, MKNMap } from '../../components'
import { get } from 'ol/proj'
import * as OLSource from 'ol/source'
import GeoJSON from 'ol/format/GeoJSON'
import { Style, Stroke } from 'ol/style'
const api_key = "AIzaSyAKNGpdR0rVxhgg1N4uf4FMmszL0IqF-_0"
const region = 'KH'; const language = 'en'

const styles = {
  MultiPygon: new Style({
    stroke: new Stroke({
      color: 'blue', width: 1
    })
  })
}

const map = () => {
  const [center, setCenter] = React.useState({
    lat: 11.56208085128822,
    lng: 104.92627819902457,
  });

  return (
    <div className="flex flex-col h-full">
      <MKNMap.Provider>
        <MKNMap.Controler />
        <MKNMap.MKNMap />
        <MKNMap.MarkerLayer />
        <MKNMap.MKNMapInteractiveInfo />
      </MKNMap.Provider>
    </div>
  );
};


export default map