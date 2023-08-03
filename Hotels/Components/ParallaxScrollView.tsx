import * as React from 'react'
import {
  Animated, StyleSheet, View, FlatList, ListRenderItem, FlatListProps, Dimensions
} from 'react-native'
import padding from '../Styles/Padding'
import colors from '../Styles/Colors'
import shadows from '../Styles/Shadow'

interface IProps extends FlatListProps<any> {
  stickyHeaderView?: React.ReactElement<any>
  stickyHeaderHeight: number
  parallaxView?: React.ReactElement<any>
  fixedView?: React.ReactElement<any>
  data: any[]
  renderItem: ListRenderItem<any>
  itemWrapperStyle?: any
}

interface IState {
  height: number
  scrollOffset: number
}

const handleHeight = padding.quarter + 1

export default class ParallaxScrollView extends React.Component<IProps, IState> {
  public state: IState = {
    height: Dimensions.get('window').height,
    scrollOffset: 0
  }

  private scrollView = React.createRef<FlatList<any>>()

  public render() {
    const {
      stickyHeaderView,
      stickyHeaderHeight,
      parallaxView,
      fixedView,
      data,
      renderItem,
      contentOffset,
      itemWrapperStyle,
      style,
      ...flatListProps
    } = this.props

    const parallaxHeight = Math.max(0, this.state.height - this.state.scrollOffset - stickyHeaderHeight - handleHeight)
    // console.log(`*** ParallaxScrollView:render: height=${this.state.height} scrollOffset=${this.state.scrollOffset} parallaxHeight=${parallaxHeight}`)

    return <FlatList
      ref={this.scrollView}
      {...flatListProps}
      onLayout={e => {
        if (this.state.height !== e.nativeEvent.layout.height) {
          this.setState({ height: e.nativeEvent.layout.height })
        }
        if (flatListProps.onLayout) { flatListProps.onLayout(e) }
      }}
      style={[styles.container, style]}
      scrollIndicatorInsets={{ right: 1 }}
      bounces={true}
      data={[{ key:'parallax' }, { key:'header' }, ...data]}
      stickyHeaderIndices={[1]}
      renderItem={itemData => {
        console.log(`*** ParallaxScrollView:renderItem: itemData.index=${itemData.index} itemData=${JSON.stringify(itemData)}`)
        if (itemData.index === 0) {
          return <View
            key={itemData.item.key} 
            style={{...styles.parallaxContainer, height: this.state.height - stickyHeaderHeight - handleHeight}}
          >
            <View
              key={itemData.item.key} 
              style={{...styles.parallaxComponent, height: parallaxHeight}}
            >
              {parallaxView}
            </View>
          </View>
        } else if (itemData.index === 1) { 
          return <View 
            key={itemData.item.key} 
            style={{backgroundColor: colors.white}}
          >
            {fixedView}
            <View style={[styles.handleBar, { height: stickyHeaderHeight + handleHeight}]} >
                <View style={styles.handle}/>
                {stickyHeaderView}
            </View>
          </View>
        } else {
          return <View style={itemWrapperStyle}>
            {renderItem({...itemData, index: itemData.index - 2})}
          </View>
        }
      }}
      onContentSizeChange={(w, h) => {
        if (this.scrollView.current) {
          this.scrollView.current.scrollToOffset({ animated: true, offset: h / 4 })
        }
    }}
      onScroll={(e) => {
        if (flatListProps.onScroll) { flatListProps.onScroll(e) }
        const scrollOffset = e.nativeEvent.contentOffset.y
        if (scrollOffset >= 0) {
          this.setState({ scrollOffset: scrollOffset })
        }
      }}
    />
  }

}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: padding.triple
  },
  parallaxContainer: {
    overflow: 'hidden',
  },
  parallaxComponent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  handleBar: {
    backgroundColor: colors.white,
    ...shadows.invertedShadowObject,
    borderBottomColor: colors.veryLightGrey,
    borderTopColor: colors.veryLightGrey,
    borderLeftColor: colors.white,
    borderRightColor: colors.white,
    borderWidth: 0.5
  },
  handle: {
    width: padding.double + padding.half,
    height: handleHeight,
    backgroundColor: colors.midGrey,
    borderRadius: padding.quarter,
    marginTop: padding.half - 1,
    alignSelf: 'center',
  },
})
