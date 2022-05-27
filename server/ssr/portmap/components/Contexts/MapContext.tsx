import React from 'react'
import { Feature, Map, MapBrowserEvent, View } from 'ol'
import Overlay from 'ol/Overlay'
import { Geometry, Point } from 'ol/geom'
import { Coordinate } from 'ol/coordinate'
import * as olLayer from 'ol/layer'
import OlVectorLayer from 'ol/layer/Vector'
import * as olSource from 'ol/source'
import { IMapProps, IBox, ISurveyLocationRequest, IDeployedBox } from '/project/shared'
import * as OLStyle from 'ol/style'
import { fromLonLat, toLonLat } from 'ol/proj'
import { DropList } from '../components'
import { useInputModal} from './ModalInputContext'
import { FontAwesomeIcon as FA } from '@fortawesome/react-fontawesome'
import ReactDOM from 'react-dom'
import { outsideClick } from '../Hooks'
import { FeatureLike } from 'ol/Feature'
import { useAuth } from '.'

export enum OLProjection  {
  'EPSG:4326' = 'EPSG:4326',
  'EPSG:3857' = 'EPSG:3857'
}

const randomMarkerStyle = new OLStyle.Style({
  image: new OLStyle.Circle({
    radius: 8,
    fill: new OLStyle.Fill({ color: [0,0,0,0] }),
    stroke: new OLStyle.Stroke({
      color: [3,105,161], width: 3
    })
  })
})

const markerHoverStyle = new OLStyle.Style({
  image: new OLStyle.Circle({
    radius: 8,
    stroke: new OLStyle.Stroke({
      color: [123,123,123], width: 3
    })
  })
})

interface IRandomMarker {
  id: number | string
  coord: Coordinate,
}

export interface IMapContext {
  state: {
    zoom: number,
    randomMarker: IRandomMarker
  },
  ref:{ 
    mapRef: React.RefObject<HTMLDivElement>,
    overlayRef: React.RefObject<HTMLElement>,
  },
  handler: {
    addRandomMarker: (e: MapBrowserEvent<any>) => void,
    addSurveyRequest: (coord?:Coordinate) => Promise<void>,
    addNewBoxLocation: (coord?:Coordinate) => Promise<void>,
    setMouseClick: (e: Coordinate) => void
  },
  element: {
    overlay: {
      olPopup: Overlay
    },
    vectorlayer: {
      marker: { 
        layer: olLayer.Vector<olSource.Vector<Geometry>>,
        source: olSource.Vector<Geometry>
      },
    }
  }
  map: Map|undefined,
  mouse: {
    coordinate: Coordinate
    clicked: Coordinate
  }
}
export const MapContext = React.createContext<IMapContext>({} as IMapContext)

export const MKNPortMapProvider = React.memo((props: IMapProps) => {
  const { children } = props
  const authContext = useAuth()

  const mapRef = React.useRef<HTMLDivElement>(null)
  const overlayRef = React.useRef<HTMLDivElement>(null)

  const [ map, setMap ] = React.useState<Map>()
  const [ zoom, setZoom ] = React.useState(15)
  const [ center ] = React.useState([104.92627819902457, 11.56208085128822])
  const [ mouseCoordiate, setMouseCoordinate ] = React.useState<Coordinate>([0,0])
  const [ mouseClick, setMouseClick ] = React.useState<Coordinate>([0,0])

  const [ randomMarker, setRandomMarker ] = React.useState<IRandomMarker>({ id: 0, coord: [0,0] })
  const [ loadedFeature, setLoadedFeature ] = React.useState([])
  const [ markerLayerSource ] = React.useState(new olSource.Vector({ features: loadedFeature }))
  const [ markerLayer ] = React.useState(new OlVectorLayer({ source: markerLayerSource }))
  const [ olPopup ] = React.useState<Overlay>(new Overlay({
                                                positioning: 'center-center',
                                                stopEvent: true,
                                              }))

  const modalInputContext = useInputModal()

  async function addSurveyRequest(coord?: Coordinate){
    modalInputContext.addObjectInput<ISurveyLocationRequest, "coordinate">({
      readOnly: true,
      proKey: "coordinate", 
      proValue: coord,
      type: [
        { "proKey": 0, label: 'Latt' },
        { "proKey": 1, label: 'Long' }
      ]
    })
    modalInputContext.addTextField<ISurveyLocationRequest>({
      "proKey":"requestBy", 
      proValue: authContext.currentUser!.username, 
      readOnly: true,
    })
    const input_confirmed = await modalInputContext.open({ title: "Add box survey request"})
  }

  async function addNewBoxLocation(coord?: Coordinate){
    modalInputContext.addObjectInput<IDeployedBox, "coordinate">({ 
                                                      readOnly: true,
                                                      proKey: "coordinate", 
                                                      proValue: coord,
                                                      type: [
                                                        { "proKey": 0, label: 'Latt' },
                                                        { "proKey": 1, label: 'Long' }
                                                      ]
                                                    })
    modalInputContext.addTextField<IDeployedBox>({ proKey: "deployedBy", label: "Deployed By" })

    const input_confirmed = await modalInputContext.open({ "title": "Add new box" })
  }

  function addRandomMarker(e: MapBrowserEvent<any>){
    const featureToAdd = new Feature({
      geometry: new Point(e.coordinate),
    });
    const featureID = new Date().getTime()
    featureToAdd.setStyle(randomMarkerStyle);
    featureToAdd.setId(featureID)
    const previousRandomPOI = markerLayerSource.getFeatureById(randomMarker.id)
    if(previousRandomPOI){
      markerLayerSource.removeFeature(previousRandomPOI)
      markerLayerSource.clear()
    }
    markerLayerSource.addFeature(featureToAdd);
    mapRef.current!.style.cursor = 'pointer'
    setRandomMarker({
      id: featureID,
      coord: e.coordinate
    })
  }

  React.useEffect(() => {
    const mapobject = new Map({
      view: new View({ zoom, center: fromLonLat(center) }),
      layers: [
        new olLayer.Tile({
          source: new olSource.OSM()
        }),
        markerLayer,
      ],
      controls: [],
      overlays: [olPopup]
    })
    setMap(mapobject)
    return () => { 
      mapobject.setTarget(undefined)
    }
  }, [])

  React.useEffect(() => { 
    if(overlayRef.current) olPopup.setElement(overlayRef.current) 
  }, [overlayRef])

  React.useEffect(() => {
    if(!map) return
    map.on('pointermove', e => {
      if(!map) return
      const coord = e.coordinate;
      setMouseCoordinate(toLonLat(coord))
    })
    map.on('moveend', () => { 
      const newZoom = map.getView().getZoom()
      if(newZoom && newZoom != zoom) setZoom(newZoom)
    })
  }, [map])


  const mapContext : IMapContext = {
    state: {
      zoom,
      randomMarker
    },
    ref: {
      mapRef, overlayRef
    },
    handler: {
      setMouseClick,
      addRandomMarker, 
      addSurveyRequest,
      addNewBoxLocation,
    },
    element: {
      overlay: {
        olPopup
      },
      vectorlayer: {
        marker: {
          layer: markerLayer,
          source: markerLayerSource
        }
      },
    },
    map,
    mouse: {
      coordinate: mouseCoordiate,
      clicked: mouseClick
    }
  }

  return (
    <MapContext.Provider value={mapContext}>
      <div ref={overlayRef} className='ol-popup'></div>
      { children }
    </MapContext.Provider>
  )
})

export function _MKNMap (){
  const { map, ref } = React.useContext(MapContext)
  React.useEffect(() => { ref.mapRef.current 
    && ref.mapRef.current != null 
    && map
    && map.setTarget(ref.mapRef.current)
  },[map, ref.mapRef])

  return <div className='ol-map' ref={ref.mapRef}></div>
}

export function MKNMapInteractiveInfo () {
  const { mouse, state } = React.useContext(MapContext)

  return (
    <div className='p-2 text-[12px]'>
      <div className='flex flex-row'>
        <div className='flex'>
          <span>Mouse Position:</span>
          <span>
            <div>
              <span>Latt:</span>
              <span>{mouse.coordinate[0].toFixed(4)}</span>
            </div>
            <div>
              <span>Long:</span>
              <span>{mouse.coordinate[1].toFixed(4)}</span>
            </div>
          </span>
        </div>

        <div className='flex ml-2'>
          <span>Marker:</span>
          <span>
            <div>
              <span>Latt:</span>
              <span>{mouse.clicked[0].toFixed(4)}</span>
            </div>
            <div>
              <span>Long:</span>
              <span>{mouse.clicked[1].toFixed(4)}</span>
            </div>
          </span>
        </div>

        <div className='flex ml-2'>
          <span>Zoom:</span>
          <span>{state.zoom}</span>
            
        </div>

      </div>
    </div>
  )
}

export const MarkerLayer = () => {
  const { map, ref, element, state, handler } = React.useContext(MapContext)
  const { randomMarker } = state
  const { overlay: { olPopup } } = element
  const [ willshow, setShowPopup ] = React.useState(false)

  function showPopup(e: MapBrowserEvent<any>, features: FeatureLike[]){
    const _feature = features[0]
    const featureID = _feature.getId()
    
    if(featureID && featureID != randomMarker.id){
      return
    }

    olPopup.setPosition(randomMarker.coord)
    const olPopupElement = olPopup.getElement()
    if(!olPopupElement){
      alert(`can not find dom of element popup`)
      return
    }
    setShowPopup(true)
    olPopupElement.style.display = 'block'
  }

  function closePopup(){
    const olPopupElement = ref.overlayRef.current
    if(olPopupElement){
      setShowPopup(false)
      olPopupElement.style.display = ''
    }
  }

  outsideClick(ref.overlayRef, closePopup )

  function pointermove(e: MapBrowserEvent<any>){
    if(!map) {
      // show popup message here
      return
    }
    const targetElement = map.getTargetElement()
    const featureAtPixcel = map.getFeaturesAtPixel(e.pixel)
    if(featureAtPixcel.length > 0){
      targetElement.style.cursor = 'pointer'
    } else {
      targetElement.style.cursor = ''
    }
  }

  function singleclick(e: MapBrowserEvent<any>) {
    const featureAtPixcel = map?.getFeaturesAtPixel(e.pixel)
    /// case has feature
    if(featureAtPixcel && featureAtPixcel.length > 0){
      return showPopup(e, featureAtPixcel)
    }
  }

  React.useEffect(() => {
    if(map){
      map.on('pointermove', pointermove)
    }
  }, [map])

  React.useEffect(() => {
    if(!map) return
    map.on('singleclick', singleclick )
    return () => { if(map) { map.un('singleclick', singleclick ) }}
  }, [map, randomMarker.id])

  function addMarker(e: MapBrowserEvent<any>){
    const featuresAtPixcel = map?.getFeaturesAtPixel(e.pixel)
    if(!featuresAtPixcel || featuresAtPixcel.length == 0){
      handler.addRandomMarker(e)
      handler.setMouseClick(e.coordinate)
    }
  }

  React.useEffect(() => {
    if(map){
      map.on('singleclick', addMarker)
    }
    return () => { if(map){ map.un('singleclick', addMarker) }}
  }, [map, randomMarker.id])

  
  return (
    willshow ? ReactDOM.createPortal(
      <div>
        <div>
          <div 
            onClick={() => handler.addSurveyRequest(toLonLat(randomMarker.coord))}
            className='font-semibold whitespace-nowrap cursor-pointer text-gray-500 hover:text-gray-900 py-1 w-full'>
              Add survey request
          </div>
          <div 
            onClick={() => handler.addNewBoxLocation(toLonLat(randomMarker.coord))}
            className='font-semibold whitespace-nowrap cursor-pointer text-gray-500 hover:text-gray-900 py-1 w-full'>
              Add new box
          </div>
        </div>
        <div 
          onClick={closePopup}
          className='cursor-pointer py-1 mt-1 bg-sky-700 hover:bg-sky-500 text-white text-center rounded-md'>
            Close
        </div>
      </div>,
      ref.overlayRef.current!
    ): null
  )
}

export const PortMapControl = React.memo(() => {
  const { map, handler } = React.useContext(MapContext)

 

  return (
    <div className='px-8 py-4 flex justify-between'>
      <div>
        filter
      </div>
      <div>
      </div>
      
    </div>
  )
})

export const MKNMap = {
  Provider: MKNPortMapProvider,
  Controler: PortMapControl,
  MarkerLayer,
  MKNMap: _MKNMap,
  MKNMapInteractiveInfo,
}