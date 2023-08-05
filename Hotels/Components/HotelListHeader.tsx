import * as React from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import Popover from 'react-native-popover-view';

import ActionButton from './ActionButton'
import FilterAndSortingDialog from './FilterAndSortingDialog';

import * as copy from '../Assets/Copy'
import padding from '../Styles/Padding'
import { filter, sort, refresh } from '../Assets/Images'
import colors from '../Styles/Colors'
import { pad } from 'lodash';

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
            <ActionButton            
              source={filter}
              onPress={() => this.setState({isFilterPopoverVisibile: true})}
              disabled={isRefreshing}
              style={{...styles.activity}} 
            />
          </View>
          <View>
            <ActionButton
              source={sort}
              onPress={onDidTapSort}
              disabled={isRefreshing}
              style={{...styles.activity}} 
            />
          </View>
        </View>
        <View style={styles.rightButtonBar}>
          {isRefreshing
            ? <ActivityIndicator animating={true} size="small" style={styles.activity} color={colors.grey}/>
            : <ActionButton
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
    width: '25%',
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
    paddingHorizontal: padding.onehalf,
    width: 35,
    height: 35,
  },
})
