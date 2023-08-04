import React, { Component } from 'react'
import { StyleSheet, Text } from 'react-native'
  
import IHotelDetailsViewModel from './IHotelDetailsViewModel'

import HotelListItem, { HotelListItemMode } from '../../Components/HotelListItem'

import padding from '../../Styles/Padding'
import colors from '../../Styles/Colors'
import { image_not_available } from '../../Assets/Images'

interface IProps {
  viewModel: IHotelDetailsViewModel
  navigation: any
}

interface IState {

}

class HotelDetailsScreen extends Component<IProps, IState> {
  public state: IState = {
  }

  public render() {
    const { viewModel } = this.props

    const hotel = viewModel.hotel


    return <Text>
      {JSON.stringify(viewModel.hotel)}
    </Text>
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

export default HotelDetailsScreen

