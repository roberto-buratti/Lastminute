import * as React from 'react'
import { Text, Image, View, StyleSheet, TouchableOpacity } from 'react-native'

import * as copy from '../Assets/Copy'
import padding from '../Styles/Padding'
import shadow from '../Styles/Shadow'
import { star_full, star_empty, image_not_available, chevron_right } from '../Assets/Images'
import colors from '../Styles/Colors'
import HotelModel from '../Models/HotelModel'

interface IProps {
  hotel: HotelModel
  isLoading: boolean
  onItemTap: () => void
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
    const { hotel, isLoading, style, onItemTap } = this.props

    const details = <View style={{...styles.details}}>
      <View style={styles.detailsRow}>
        <Text style={{fontWeight: 'bold'}}>{hotel.name}</Text>
      </View>
      <View style={styles.detailsRow}>
        <Text style={{}}>
          {hotel.location.address} ({hotel.location.city})
        </Text>
      </View>
      <View style={styles.detailsRow}>
        <Text style={{}}>
          {copy.getString('rating')}: {hotel.userRating} • {copy.getString('price')}: {hotel.price.description} 
        </Text>
      </View>
    </View> 

    const stars = Array(5).fill(0).map((_, index) => {
      const value = Math.round(hotel.userRating * 5.0 / 10.0)
      return index >= value 
        ? <Image key={index} source={star_empty} style={styles.star}/>
        : <Image key={index} source={star_full} style={styles.star}/>
    })

    return <TouchableOpacity onPress={onItemTap} disabled={isLoading} style={{...styles.container, ...styles.row, ...style, opacity: isLoading ? 0.2 : 1.0}}>
      <View style={styles.column}>
        <Image
          style={styles.avatar}
          source={this.state.image}
          onError={(event)=>{
            console.log(`*** HotelListItem:Image.onError: got error for uri=${hotel.gallery[0]}`, JSON.stringify(event.nativeEvent))
            this.setState({image: image_not_available})
          }}
        />
        <View style={{...styles.row, paddingTop: padding.quarter}}>
          {stars}
        </View>
      </View>
      {details}
      <View style={styles.indicators}>
        <Image source={chevron_right} />
      </View>
    </TouchableOpacity>
  }
}

const styles = StyleSheet.create({
  container: {
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
    height: 10
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
