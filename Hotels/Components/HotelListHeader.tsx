import * as React from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import Popover from 'react-native-popover-view';

import ImageButton from './ImageButton'
import FilterAndSortingDialog from './FilterAndSortingDialog';

import * as copy from '../Assets/Copy'
import padding from '../Styles/Padding'
import { filter, sort, refresh } from '../Assets/Images'
import colors from '../Styles/Colors'

interface IProps {
  isRefreshing: boolean
  onDidTapFilter: () => void
  onDidTapSort: () => void
  onDidTapRefresh: () => void
}

interface IState {
  isFilterPopoverVisibile: boolean
}

export default class HotelListHeader extends React.Component<IProps, IState> {

  private filterButtonRef = React.createRef<View>()

  constructor(props: IProps) {
    super(props)
    this.state = {
      isFilterPopoverVisibile: false
    }
  }

  public render() {
    const { isRefreshing, onDidTapFilter, onDidTapSort, onDidTapRefresh } = this.props


    return <View style={styles.container}>
      <View style={styles.horizontalContainer}>
        <View style={styles.leftButtonBar}>
          <View ref={this.filterButtonRef}>
            <ImageButton            
              source={filter}
              onPress={() => this.setState({isFilterPopoverVisibile: true})}
              disabled={isRefreshing}
              style={{...styles.activity}} 
            />
          </View>
          <View>
            <ImageButton
              source={sort}
              onPress={onDidTapSort}
              disabled={isRefreshing}
              style={{...styles.activity}} 
            />
          </View>
        </View>
        <Text style={{...styles.title}}>
          {copy.getString('hotels_list_title')}
        </Text>
        <View style={styles.rightButtonBar}>
          {isRefreshing
            ? <ActivityIndicator animating={true} size="small" style={styles.activity} color={colors.grey}/>
            : <ImageButton
              source={refresh}
              onPress={onDidTapRefresh}
              disabled={isRefreshing}
              style={{...styles.activity}}
            />
          }
        </View>
      </View>
      <Popover 
        from={this.filterButtonRef} 
        isVisible={this.state.isFilterPopoverVisibile} 
        onRequestClose={() => this.setState({isFilterPopoverVisibile: false})}
      >
        <FilterAndSortingDialog/>
      </Popover>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: padding.half,
    paddingBottom: padding.full,
  },
  horizontalContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftButtonBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '25%'
  },
  rightButtonBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '25%',
  },
  title: {
    flex: 1,
    textAlign: 'center'
  },
  activity: {
    paddingRight: padding.quarter,
    width: 35,
    height: 35,
  },
})
