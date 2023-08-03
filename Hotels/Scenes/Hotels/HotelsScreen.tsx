import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
  
import IHotelsViewModel, { HotelsViewModelEvents } from './IHotelsViewModel'
import MapPointModel from '../../Models/MapPoint'

import ParallaxScrollView from '../../Components/ParallaxScrollView'
import MapWrapper from '../../Components/MapWrapper'
import HotelListHeader from '../../Components/HotelListHeader'
import HotelListItem from '../../Components/HotelListItem'

import padding from '../../Styles/Padding'
import colors from '../../Styles/Colors'
import { image_not_available } from '../../Assets/Images'

interface IProps {
  viewModel: IHotelsViewModel
}

interface IState {
    isLoading: boolean
}

const headerHeight = 75

class HotelsScreen extends Component<IProps, IState> {
  public state: IState = {
    isLoading: false,
  }

  private parallaxView = React.createRef<ParallaxScrollView>()
  private mapRef = React.createRef<MapWrapper>()

  public componentDidMount() {

    const { viewModel } = this.props

    // console.log(`*** HotelsScreen:componentDidMount: viewModel=${JSON.stringify(viewModel)}`)
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
    const { isLoading } = this.state

    const hotels = viewModel.hotels

    const headerView = <HotelListHeader
      onDidTapSort={() => { viewModel.reverseSorting() }}
      onDidTapRefresh={() => { viewModel.refresh() }}
      isRefreshing={isLoading}      
    />

    return <ParallaxScrollView
      ref={this.parallaxView}
      // onScroll={(e) => {
      //   if (this.mapRef.current) {
      //     this.mapRef.current.setContentOffset(e.nativeEvent.contentOffset.y)
      //   }
      // }}
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
            isLoading={isLoading}
            style={{backgroundColor: colors.transparent}}
            onItemTap={() => { /* this.navigateToAgent(navigationStore, data.item.agent) */}}
        />
        }}
        onItemTap={(item) => { /*this.navigateToAgent(navigationStore, agent)*/ }}
        showCallout={true}        
      />}
      stickyHeaderView={headerView}
      stickyHeaderHeight={headerHeight}
      data={hotels.map((hotel, index) => ({key: `${index}`, hotel}))}
      renderItem={(data) => {
        return <HotelListItem
          key={data.item.hotel.id}
          hotel={data.item.hotel}
          style={{backgroundColor: colors.white}}
          isLoading={isLoading}
          onItemTap={() => { /* this.navigateToAgent(navigationStore, data.item.agent) */}}
        />
      }}
      itemWrapperStyle={styles.itemsWrapper}
    />
  }

  // MARK: - Private  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGrey,
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

export default HotelsScreen

