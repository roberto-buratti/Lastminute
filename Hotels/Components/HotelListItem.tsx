import * as React from 'react'
import { Text, Image, View, StyleSheet, TouchableOpacity } from 'react-native'

import SmartImage from './SmartImage'

import * as copy from '../Assets/Copy'
import padding from '../Styles/Padding'
import shadow from '../Styles/Shadow'
import { star_full, star_empty, image_not_available, chevron_right } from '../Assets/Images'
import colors from '../Styles/Colors'
import HotelModel from '../Models/HotelModel'

export enum HotelListItemMode {
  wide,
  tall
}

interface IProps {
  hotel: HotelModel
  isLoading: boolean
  mode: HotelListItemMode
  onDidTapItem?: () => void
  style: any
}

interface IState {
  image: any
}

export default class HotelListItem extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      image: props.hotel.gallery.length > 0 ? { uri: props.hotel.gallery[0] } : image_not_available
    }
  }

  public render() {
    const { hotel, isLoading, mode, style, onDidTapItem } = this.props

    const details = mode == HotelListItemMode.wide 
      ? <View style={{...styles.details}}>
          <View style={styles.detailsRow}>
            <Text style={{fontWeight: 'bold'}}>{hotel.name}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={{}}>
              {hotel.location.address}, {hotel.location.city}
            </Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={{}}>
              {copy.getString('rating')}: {hotel.userRating} • {copy.getString('price')}: {hotel.price.description} 
            </Text>
          </View>
        </View>
      : <View style={{...styles.details}}>
          <View style={styles.detailsRow}>
            <Text style={{fontWeight: 'bold'}}>{hotel.name}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={{}}>
              {hotel.location.address}, {hotel.location.city}
            </Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={{}}>
              {copy.getString('rating')}: {hotel.userRating}
            </Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={{}}>
              {copy.getString('price')}: {hotel.price.description} 
            </Text>
          </View>
        </View>

    const stars = Array(5).fill(0).map((_, index) => {
      const value = Math.round(hotel.stars)
      return index >= value 
        ? <Image key={index} source={star_empty} style={styles.star}/>
        : <Image key={index} source={star_full} style={styles.star}/>
    })

    return <TouchableOpacity onPress={onDidTapItem} disabled={isLoading} style={{...styles.container, ...styles.row, ...style, opacity: isLoading ? 0.2 : 1.0}}>
      <View style={styles.column}>
        <SmartImage
          style={styles.avatar}
          source={this.state.image}
        />
        <View style={{...styles.row, paddingTop: padding.quarter}}>
          {stars}
        </View>
      </View>
      {details}
      <View style={styles.indicators}>
        <Image source={chevron_right} style={{tintColor: colors.lastminute}}/>
      </View>
    </TouchableOpacity>
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: padding.half,
    padding: padding.half,
    marginBottom: padding.half,
    ...shadow.shadowObject,
  },
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  column: {
    flex: 0,
    flexDirection: 'column',
    backgroundColor: colors.transparent,
  },
  star: {
    width: 10,
    height: 10,
  },
  avatar: {
    width: 50, 
    height: 50,
    borderRadius: 10,
  },
  details: {
    justifyContent: 'flex-start',
    marginLeft: padding.half,
    flex: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingTop: padding.quarter
  },
  indicators: {
    justifyContent: 'center',
    marginLeft: padding.quarter,
  },
})
