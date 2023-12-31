import React, { Component } from 'react'
import { Dimensions, View, StyleSheet, ViewProps, Image } from 'react-native'
import MapView, { Region, Marker, MapMarker, Callout } from 'react-native-maps'

import MapPointModel from '../Models/MapPoint'

import MapPin from './MapPin'
import ActionButton from './ActionButton'

import padding from '../Styles/Padding'
import { center_map, image_not_available } from '../Assets/Images'

const pinHeight = 114
const pinWidth = 86
const pinScale = 0.8
const pinPadding = 8

interface IProps extends ViewProps {
  items: MapPointModel[]
  renderCallout: (id: string) => React.JSX.Element | null
  onCalloutPress: (id: string) => void
  showCallout: boolean
}

interface IState {
}

class MapWrapper extends Component<IProps, IState> {
  private mapRef = React.createRef<MapView>()
  private markerRef = React.createRef<MapMarker>()
  
  private mapIsReady: boolean = false
  private mapDidLayout: boolean = false

  constructor(props: IProps) {
    super(props)

    this.state = {
    }
  }

  public render() {
    const { items, showCallout, ...viewProps } = this.props

    return <View {...viewProps} collapsable={false}
      onLayout={() => this.centerMap() }>
      <MapView
        collapsable={false}
        style={viewProps.style}
        ref={this.mapRef}
        initialRegion={this.initialRegion()}
        // [ROB] sometimes onMapReady() doesn't work properly on android...
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
              // [ROB] google-maps bug? see https://github.com/react-native-community/react-native-maps/issues/2082
              tracksViewChanges={false}
              tracksInfoWindowChanges={false}
              coordinate={{
                latitude: item.location.latitude,
                longitude: item.location.longitude,
              }}
              centerOffset={{
                x: 0,
                y: -pinHeight * pinScale / 2.0,
              }}
              onCalloutPress={() => { this.props.onCalloutPress(item.id) }}
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
      <ActionButton
        source={center_map}
        contentStyle={{tintColor: '#DE307C'}}
        onPress={() => { if (this.mapRef.current) { this.centerMap() } }}
        style={styles.centerButton}
      />
    </View>
  }

  // MARK: - Private

  private onMapReady = (mapIsReady: boolean, mapDidLayout: boolean) => {
    if (this.mapIsReady && this.mapDidLayout) {
      return
    }
    this.mapIsReady = this.mapIsReady || mapIsReady
    this.mapDidLayout = this.mapDidLayout || mapDidLayout
    if (this.mapIsReady && this.mapDidLayout) {
      if (this.mapRef.current) {
        this.forceUpdate(() => {
          this.centerMap()
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
    const locations = this.props.items.map((i) => i.location)
    const coordinates = locations.map((l) => { return { latitude: l.latitude, longitude: l.longitude }})
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

  private async centerMap() {
    if (!this.mapIsReady || !this.mapDidLayout || !this.mapRef.current) { // map not yet ready, retry later
      console.log(`*** Map:centerMap: map not yet ready, retry later`)
      return
    }
    this.forceUpdate(() => {
      this.fitToItems()
    })
  }

  private async fitToItems() {
    const coordinates = await this.coordinatesForItems()
    const edgePadding = {
      top: 1.5 * pinHeight * pinScale,
      left: pinWidth * pinScale,
      right: pinWidth * pinScale,
      bottom: 0.5 * pinHeight * pinScale
    }
    this.mapRef.current?.fitToCoordinates(coordinates, { edgePadding, animated: true })
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
    padding: 0,
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
    zIndex: 1000,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center'
    
  }
})
