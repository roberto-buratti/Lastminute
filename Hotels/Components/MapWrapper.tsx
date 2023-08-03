import React, { Component } from 'react'
import { Dimensions, View, StyleSheet, ViewProps } from 'react-native'
import MapView, { Region, Marker, Callout } from 'react-native-maps'

import MapPointModel from '../Models/MapPoint'

import MapPin from './MapPin'
import ImageButton from './ImageButton'
import { center_map } from '../Assets/Images'
import padding from '../Styles/Padding'

const pinHeight = 114
const pinWidth = 86
const pinScale = 0.8
const pinPadding = 8

interface IProps extends ViewProps {
  items: MapPointModel[]
  onItemTap: (hotel: MapPointModel) => void
  renderCallout: (id: string) => React.JSX.Element | null
  showCallout: boolean
}

interface IState {
}

class MapWrapper extends Component<IProps, IState> {
  private mapRef = React.createRef<MapView>()
  private markerRef = React.createRef<Marker>()
  
  private mapIsReady: boolean = false
  private mapDidLayout: boolean = false

  private mapWidth: number = 0
  private mapHeight: number = 0

  constructor(props: IProps) {
    super(props)

    this.state = {
    }
  }

  private onMapReady = (mapIsReady: boolean, mapDidLayout: boolean) => {
    this.mapIsReady = this.mapIsReady || mapIsReady
    this.mapDidLayout = this.mapDidLayout || mapDidLayout
    if (this.mapIsReady && this.mapDidLayout) {
      if (this.mapRef.current) {
        this.forceUpdate(() => {
          // console.log(`*** Map:onMapReady: now centering map`)
          this.centerMap(true)
        })
      }
    }
  }

  private async coordinatesForItems() {
    if (!this.mapRef.current) {
      return []
    }
    if (this.props.items.length == 0) {
      return []
    }
    // console.log(`*** Map:coordinatesForItems: items=${this.props.items.length} => ${JSON.stringify(this.props.items)}`)
    const locations = this.props.items.map((i) => i.location)
    // console.log(`*** Map:coordinatesForItems: locations=${JSON.stringify(locations)}`)
    const coordinates = locations.map((l) => { return { latitude: l.latitude, longitude: l.longitude }})
    // console.log(`*** Map:coordinatesForItems: coordinates=${JSON.stringify(coordinates)}`)
    const avgLat = coordinates.map(c => c.latitude).reduce((sum, value) => { return sum + value }, 0) / coordinates.length
    const avgLon = coordinates.map(c => c.longitude).reduce((sum, value) => { return sum + value }, 0) / coordinates.length
    const minLatitudeDelta = 1.0 / 110.574 // not less than 1 km
    const minLongitudeDelta = 1.0 / 111.320 * Math.cos(avgLat * Math.PI / 180.0) // not less than 1 km

    coordinates.push({
      latitude: avgLat + minLatitudeDelta / 2,
      longitude: avgLon + minLongitudeDelta / 2
    })
    coordinates.push({
      latitude: avgLat + minLatitudeDelta / 2,
      longitude: avgLon - minLongitudeDelta / 2
    })
    coordinates.push({
      latitude: avgLat - minLatitudeDelta / 2,
      longitude: avgLon + minLongitudeDelta / 2
    })
    coordinates.push({
      latitude: avgLat - minLatitudeDelta / 2,
      longitude: avgLon - minLongitudeDelta / 2
    })
    return coordinates
  }

  private async fitToItems() {
    const coordinates = await this.coordinatesForItems()
    const edgePadding = {
      top: 1.5 * pinHeight * pinScale,
      left: pinWidth * pinScale,
      right: pinWidth * pinScale,
      bottom: 0.5 * pinHeight * pinScale
    }
    console.log(`*** Map:fitToItems: coordinates=${JSON.stringify(coordinates)} edgePadding=${JSON.stringify(edgePadding)}`)
    this.mapRef.current!.fitToCoordinates(coordinates, { edgePadding, animated: true })
  }

  private initialRegion(): Region | undefined {
    const { items } = this.props
    if (items.length == 0) {
      return undefined
    }
    const maxLat = items.map(i => i.location.latitude).reduce((max, value) => Math.max(max, value), -90)
    const minLat = items.map(i => i.location.latitude).reduce((min, value) => Math.min(min, value), 90)
    const maxLon = items.map(i => i.location.longitude).reduce((max, value) => Math.max(max, value), -180)
    const minLon = items.map(i => i.location.longitude).reduce((min, value) => Math.min(min, value), 180)
    const avgLat = items.map(i => i.location.latitude).reduce((sum, value) => { return sum + value }, 0) / items.length
    const avgLon = items.map(i => i.location.longitude).reduce((sum, value) => { return sum + value }, 0) / items.length
    const minLatitudeDelta = 100.0 / 110.574 // 100 km
    const minLongitudeDelta = 100.0 / 111.320 * Math.cos(avgLat * Math.PI / 180.0) // 100 km
    const region = {
      latitude: (maxLat + minLat) / 2,
      longitude: (maxLon + minLon) / 2,
      latitudeDelta: Math.max(maxLat - minLat, minLatitudeDelta),
      longitudeDelta: Math.max(maxLon - minLon, minLongitudeDelta)
    }
    return region
  }

  public componentDidUpdate = (_: IProps, prevState: IState) => {
    if (!(this.mapIsReady && this.mapDidLayout)) {
      return
    }
    this.centerMap()
  }

  public async centerMap(force: boolean = false) {
    if (!this.mapIsReady || !this.mapDidLayout || !this.mapRef.current) { // map not yet ready, retry later
      console.log(`*** Map:centerMap: map not yet ready, retry later`)
      return
    }
    const pw = pinWidth * pinScale
    const ph = pinHeight * pinScale

    let needsRedraw = force
    // console.log(`*** Map:centerMap: force=${force} needsRedraw=${needsRedraw}`)
    const locations = this.props.items.map(l => l.location)
    for (const location of locations) {
      try {
        const point = await this.mapRef.current!.pointForCoordinate({ latitude: location.latitude!, longitude: location.longitude! })
        if (point.x < pw / 2 || point.y < 1.5 * ph) {  // 1.5 * ph => heuristic adjustment for callout
          needsRedraw = true
          break
        }
        if (point.x > this.mapWidth - pw / 2 || point.y > this.mapHeight) {
          needsRedraw = true
          break
        }
    } catch (error: any) {
        console.log('*** Map:centerMap: got error from pointForCoordinate()', error.message)
        needsRedraw = true
        break
      }
    }
    if (needsRedraw) {
      this.fitToItems()
    }
  }

  public render() {
    const { items, onItemTap, showCallout, ...viewProps } = this.props

    return <View {...viewProps} collapsable={false}
      onLayout={(event: any) => {
        this.mapWidth = event.nativeEvent.layout.width
        this.mapHeight = event.nativeEvent.layout.height
      }}>
      <MapView
        collapsable={false}
        style={viewProps.style}
        ref={this.mapRef}
        initialRegion={this.initialRegion()}
        // sometimes onMapReady() doesn't work properly on android...
        onLayout={() => { 
          this.onMapReady(false, true)
        }}
        onMapReady={() => {
          this.onMapReady(true, false)
        }}
        showsCompass={true}
        rotateEnabled={false}
        moveOnMarkerPress={true}
      >
        {this.mapIsReady && this.mapDidLayout && items
          .map((item, i) => {
            return <Marker
              key={item.id}
              ref={this.markerRef}
              // google-maps bug? see https://github.com/react-native-community/react-native-maps/issues/2082
              tracksViewChanges={false}
              tracksInfoWindowChanges={false}
              coordinate={{
                latitude: item.location.latitude,
                longitude: item.location.longitude,
              }}
              onPress={() => {
                // onAgentPress(point)
              }}
              centerOffset={{
                x: 0,
                y: -pinHeight * pinScale / 2.0,
              }}
            >
              <MapPin
                style={styles.pin}
                source={item.imageSource}
                width={(pinWidth - 2.0 * pinPadding) * pinScale}
                height={(pinWidth - 2.0 * pinPadding) * pinScale}
                borderWidth={0}
                borderColor={undefined}
              />
              {showCallout && <Callout style={styles.calloutView}>
                <View style={styles.calloutContainer}>
                  {this.props.renderCallout(item.id)}
                </View>
              </Callout>}
            </Marker>
          })
        }
      </MapView>
      <ImageButton
        source={center_map}
        onPress={() => { if (this.mapRef.current) { this.centerMap(true) } }}
        style={styles.centerButton}
      />
    </View>
  }

}

export default MapWrapper

const styles = StyleSheet.create({
  blankMap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  pin: {
    width: pinWidth * pinScale,
    height: pinHeight * pinScale,
  },
  calloutView: {
    minWidth: Dimensions.get('window').width * 0.9
  },
  calloutContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 0
  },
  calloutContent: {
    textAlign: 'left'
  },
  calloutTitle: {
    fontWeight: 'bold'
  },
  centerButton: {
    position: 'absolute',
    top: padding.half,
    right: padding.half,
    zIndex: 1000
  }
})
