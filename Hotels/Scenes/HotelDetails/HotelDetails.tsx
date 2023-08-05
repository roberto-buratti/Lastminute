import React, { Component } from 'react'
import { StyleSheet, View, Text, Dimensions, ImageSourcePropType, Linking, ScrollView, Image, Button } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'
import Dots from 'react-native-dots-pagination'

import IHotelDetailsViewModel from './IHotelDetailsViewModel'

import SmartImage from '../../Components/SmartImage'
import ActionButton from '../../Components/ActionButton'

import * as copy from '../../Assets/Copy'
import padding from '../../Styles/Padding'
import colors from '../../Styles/Colors'
import { image_not_available, star_empty, star_full, map, phone, email } from '../../Assets/Images'

interface IProps {
  viewModel: IHotelDetailsViewModel
  navigation: any
}

interface IState {
  width: number
  height: number
  dotIndex: number
}

class HotelDetailsScreen extends Component<IProps, IState> {
  public state: IState = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    dotIndex: 0
  }

  public render() {
    const { viewModel } = this.props

    const hotel = viewModel.hotel

    const carouselWidth = this.state.width
    const carouselHeight = this.state.height > this.state.width 
      ? carouselWidth / 1.6180339887  // [ROB] portrait => https://it.wikipedia.org/wiki/Sezione_aurea
      : this.state.height             // [ROB] landscape => only carousel shown

    let sources: ImageSourcePropType[] = hotel.gallery.map(url => { return { uri: url } as ImageSourcePropType })
    if (sources.length == 0) {
      sources.push(image_not_available)
    }
    const address = hotel.location.address + ', ' + hotel.location.city

    const stars = Array(5).fill(0).map((_, index) => {
      const value = Math.round(hotel.stars)
      return index >= value 
        ? <Image key={index} source={star_empty} style={styles.star}/>
        : <Image key={index} source={star_full} style={styles.star}/>
    })

    return (
      <ScrollView style={{ width: '100%', height: '100%'}}
        contentContainerStyle={styles.container}
        onLayout={e => { this.setState({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}}
      >
        <View>
          {this.state.height > this.state.width && 
            <View style={{...styles.row, paddingTop: padding.quarter}}>
              {stars}
            </View>
          }
          <Carousel
              style={{alignSelf: 'center'}}
              loop={sources.length > 1}
              width={carouselWidth}
              height={carouselHeight} 
              mode={'parallax'}
              autoPlay={false}
              data={sources}            
              scrollAnimationDuration={200}
              onSnapToItem={(index) => this.setState({dotIndex: index})}
              renderItem={({ index }) => {
                console.log(`*** HotelDetails:Carousel.renderItem: source=${JSON.stringify(sources[index])}`)
                return (              
                  <View
                      style={{
                          flex: 1,
                          justifyContent: 'center',                        
                      }}
                  >
                    <SmartImage
                      key={`${index}`}
                      resizeMode={'cover'}
                      source={sources[index]}
                      style={{width:'100%', height:'100%', borderRadius: 10, borderWidth: 1}}
                    />
                  </View>
                )
              }}
          />
          {sources.length > 1 && 
            <Dots 
              length={sources.length} 
              active={this.state.dotIndex} 
              alignDotsOnXAxis={true} 
              passiveDotWidth={6} 
              passiveDotHeight={6} 
              activeColor={colors.black}
              passiveColor={colors.midGrey}
            />
          }
        </View>
        <View style={styles.details}>
          <View style={styles.detailsRow}>
            <ActionButton
              source={map}
              onPress={() => {
                Linking.openURL(`maps://?q=${address}`)
              }}
              style={styles.action}
            />
            <Text style={styles.boldText}>
              {address}
            </Text>
          </View>
          <View style={styles.detailsRow}>
            <View style={styles.action}></View>
            <Text style={styles.text}>
              {copy.getString('rating')}:
            </Text>
            <Text style={styles.boldText}>
              {hotel.userRating}
            </Text>
          </View>
          <View style={styles.detailsRow}>
            <View style={styles.action}></View>
            <Text style={styles.text}>
              {copy.getString('price')}:
            </Text>
            <Text style={styles.boldText}>
              {hotel.price.description} 
            </Text>
          </View>
          <View style={styles.detailsRow}>
            <View style={styles.action}></View>
            <Text style={styles.text}>
              {copy.getString('check-in')}:
            </Text>
            <Text style={styles.boldText}>
              {hotel.checkIn.from} - {hotel.checkIn.to}
            </Text>
          </View>
          <View style={styles.detailsRow}>
            <View style={styles.action}></View>
            <Text style={styles.text}>
              {copy.getString('check-out')}:
            </Text>
            <Text style={styles.boldText}>
              {hotel.checkOut.from} - {hotel.checkOut.to}
            </Text>
          </View>
          <View style={styles.detailsRow}>
            <ActionButton
              source={phone}
              onPress={() => {
                Linking.openURL(`tel://${hotel.contact.phoneNumber}`)
              }}
              style={styles.action}
            />
            <Text style={styles.boldText}>
              {hotel.contact.phoneNumber}
            </Text>
          </View>
          <View style={styles.detailsRow}>
            <ActionButton
              source={email}
              onPress={() => {
                Linking.openURL(`mailto:${hotel.contact.email}`)
              }}
              style={styles.action}
            />
            <Text style={styles.boldText}>
              {hotel.contact.email}
            </Text>
          </View>
        </View>
        <ActionButton 
          title={copy.getString("book_now")}
          style={styles.bookNowbutton}
          contentStyle={{ color: colors.white, fontWeight: 'bold', fontSize: 18 }} 
          onPress={function (): void {
            Linking.openURL("https://www.it.lastminute.com")            
          } }        
        />
      </ScrollView>
    )
  }

  // MARK: - Private  
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  column: {
    flex: 0,
    flexDirection: 'column',
  },
  star: {
    width: 18,
    height: 18,
  },
  action: {
    flex: 0,
    width: 35, 
    height: 35
  },
  text: {
    flex: 2,
    fontWeight:'normal', 
    fontSize: 16
  },
  boldText: {
    flex: 2,
    fontWeight:'bold', 
    fontSize: 16
  },
  details: {
    flex: 1,
    justifyContent: 'flex-start',
    margin: padding.full,
    gap: 10
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 30,
    paddingTop: padding.quarter
  },
  bookNowbutton: {
    height: 100, 
    flex: 1, 
    justifyContent:'center', 
    margin: 50, 
    borderRadius: 10, 
    borderWidth: 1, 
    backgroundColor: colors.lastminute, 
    borderColor: colors.lastminute
  }
})

export default HotelDetailsScreen

