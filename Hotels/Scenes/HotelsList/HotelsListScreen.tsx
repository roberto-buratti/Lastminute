import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
  
import HotelModel from '../../Models/HotelModel'
import MapPointModel from '../../Models/MapPoint'
import IHotelsListViewModel, { HotelsViewModelEvents } from './IHotelsListViewModel'

import ParallaxScrollView from '../../Components/ParallaxScrollView'
import MapWrapper from '../../Components/MapWrapper'
import HotelListHeader from '../../Components/HotelListHeader'
import HotelListItem, { HotelListItemMode } from '../../Components/HotelListItem'

import padding from '../../Styles/Padding'
import colors from '../../Styles/Colors'
import { image_not_available } from '../../Assets/Images'

interface IProps {
  viewModel: IHotelsListViewModel
  navigation: any
}

interface IState {
    isLoading: boolean
    isFilterComponentVisibile: boolean
}

const headerHeight = 75

class HotelsListScreen extends Component<IProps, IState> {
  public state: IState = {
    isLoading: false,
    isFilterComponentVisibile: false
  }

  private parallaxView = React.createRef<ParallaxScrollView>()
  private mapRef = React.createRef<MapWrapper>()

  public componentDidMount() {

    const { viewModel, navigation } = this.props

    viewModel.events.addListener(HotelsViewModelEvents.isLoading, (value) => {
      this.setState({ isLoading: value })
    })    
  }

  public componentWillUnmount() {
    const { viewModel } = this.props
    viewModel.events.removeAllListeners()
  }

  public render() {
    const { viewModel } = this.props
    const { isLoading, isFilterComponentVisibile } = this.state

    const hotels = viewModel.hotels

    const headerView = <HotelListHeader
      viewModel={viewModel}
      disabled={isLoading}
      onToggleFilterComponent={(visible: boolean) => {
        this.setState({ isFilterComponentVisibile: visible }, () => {
          this.parallaxView.current?.redraw()
        })        
      }}
    />

    return <ParallaxScrollView
      ref={this.parallaxView}
      style={styles.container}
      parallaxView={<MapWrapper
        ref={this.mapRef}
        style={styles.map}
        items={hotels.map(h => new MapPointModel(
          h.id, 
          h.name, 
          h.gallery.length > 0 ? { uri: h.gallery[0] } : image_not_available, 
          h.location)) 
        }
        renderCallout={(id: string) => {
          const hotel = viewModel.getHotelById(id)
          if (!hotel) { 
            return null
          }
          return <HotelListItem
            hotel={hotel}
            disabled={isLoading || isFilterComponentVisibile}
            mode={HotelListItemMode.tall}
            style={{backgroundColor: colors.transparent}}
          />
        }}        
        showCallout={true}
        onCalloutPress={(id: string) => {
          const hotel = viewModel.getHotelById(id)
          if (!hotel) { 
            return null
          }
          this.onDidSelectHotel(hotel)
        }}
      />}
      stickyHeaderView={headerView}
      data={hotels.map((hotel, index) => ({key: `${index}`, hotel}))}
      renderItem={(data) => {
        return <HotelListItem
          key={data.item.hotel.id}
          hotel={data.item.hotel}
          style={{backgroundColor: colors.white}}
          disabled={isLoading || isFilterComponentVisibile}
          mode={HotelListItemMode.wide}
          onDidTapItem={() => { this.onDidSelectHotel(data.item.hotel)}}
        />
      }}
      itemWrapperStyle={styles.itemsWrapper}
    />
  }

  // MARK: - Private

  onDidSelectHotel(hotel: HotelModel) {
    const { navigation } = this.props
    navigation.navigate("hotel_details_scene", { hotel: hotel })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkSlateGrey,
  },
  map: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  itemsWrapper: {
    marginLeft: padding.half,
    marginRight: padding.half,
  },
})

export default HotelsListScreen

