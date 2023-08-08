import * as React from 'react'
import { Animated, View, StyleSheet, ActivityIndicator, Modal } from 'react-native'

import IHotelsListViewModel from '../Scenes/HotelsList/IHotelsListViewModel'

import ActionButton from './ActionButton'
import Fade from './Fade'
import FilterAndSorting from './FilterAndSorting'

import padding from '../Styles/Padding'
import { filter, sort, refresh } from '../Assets/Images'
import colors from '../Styles/Colors'

interface IProps {
  viewModel: IHotelsListViewModel
  disabled: boolean
  onToggleFilterComponent: (status: boolean) => void
}

interface IState {
  isFilterComponentVisibile: boolean
}

const minHeight = 75
const maxHeight = 630

export default class HotelListHeader extends React.Component<IProps, IState> {

  private filterButtonRef = React.createRef<View>()

  constructor(props: IProps) {
    super(props)
    this.state = {
      isFilterComponentVisibile: false
    }
  }

  public render() {
    const { viewModel, disabled, onToggleFilterComponent } = this.props
    const { isFilterComponentVisibile } = this.state

    const height = isFilterComponentVisibile ? maxHeight : minHeight

    return <View style={{...styles.container, height: height}}>
      <View style={styles.horizontalContainer}>
        <View style={styles.leftButtonBar}>
          <View ref={this.filterButtonRef}>
            <ActionButton            
              source={filter}
              onPress={() => {
                this.setState({isFilterComponentVisibile: !isFilterComponentVisibile}, () => {
                  onToggleFilterComponent(this.state.isFilterComponentVisibile)
                }) 
              }}
              disabled={disabled}
              style={{...styles.activity}} 
            />
          </View>
          <View>
            <ActionButton
              source={sort}
              onPress={() => { viewModel.reverseSorting() }}
              disabled={disabled}
              style={{...styles.activity}} 
            />
          </View>
        </View>
        <View style={styles.rightButtonBar}>
          {disabled
            ? <ActivityIndicator animating={true} size="small" style={styles.activity} color={colors.grey}/>
            : <ActionButton
              source={refresh}
              onPress={() => { viewModel.refresh() }}
              disabled={disabled}
              style={{...styles.activity}}
            />
          }
        </View>
      </View>
      <FilterAndSorting 
        viewModel={viewModel} 
        disabled={disabled}
        style={{...styles.filterAndSorting, display: isFilterComponentVisibile ? 'flex' : 'none'}}
        onSubmit={() => {
          this.setState({isFilterComponentVisibile: false}, () => {
            onToggleFilterComponent(this.state.isFilterComponentVisibile)
          }) 
        }}
      />
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    padding: padding.half,
    paddingBottom: padding.full,
    minHeight: minHeight,
  },
  horizontalContainer: {
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
  filterAndSorting: {
    width: '100%',
    height: maxHeight - minHeight,
  }
})
