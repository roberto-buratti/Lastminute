import * as React from 'react'
import {
  StyleSheet, View, FlatList, ListRenderItem, FlatListProps, Dimensions
} from 'react-native'
import padding from '../Styles/Padding'
import colors from '../Styles/Colors'

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
  private shouldIgnoreScroll = false
  private resizeTimeout: NodeJS.Timeout | undefined = undefined

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
      style={[styles.container, style]}
      contentContainerStyle={{backgroundColor: colors.white}}
      scrollIndicatorInsets={{ right: 1 }}
      bounces={true}
      data={[{ key:'parallax' }, { key:'header' }, ...data]}
      stickyHeaderIndices={[1]}
      renderItem={itemData => {
        // console.log(`*** ParallaxScrollView:renderItem: itemData.index=${itemData.index} itemData=${JSON.stringify(itemData)}`)
        if (itemData.index === 0) {
          return <View
            key={itemData.item.key} 
            style={{...styles.parallaxContainer, height: this.state.height - stickyHeaderHeight - handleHeight}}
          >
            <View
              key={itemData.item.key} 
              style={{...styles.parallaxComponent, minHeight: parallaxHeight, maxHeight: parallaxHeight}}
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
      onLayout={e => {
        if (this.state.height !== e.nativeEvent.layout.height) {
          this.setState({ height: e.nativeEvent.layout.height })
        }
        if (flatListProps.onLayout) { flatListProps.onLayout(e) }
      }}
      onContentSizeChange={(w, h) => {
        if (this.scrollView.current) {
          this.scrollView.current.scrollToOffset({ animated: true, offset: h / 4 })
        }
      }}
      onScrollBeginDrag={(e) => {
        this.shouldIgnoreScroll = false
      }}
      onScrollEndDrag={(e) => {
        const scrollOffset = e.nativeEvent.targetContentOffset ? e.nativeEvent.targetContentOffset.y : undefined
        if (scrollOffset) {
          this.shouldIgnoreScroll = true  // we got `targetContentOffset`, so we can ignore any subsequent scroll event ;)
          if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout)
            this.resizeTimeout = undefined
          }
          if (scrollOffset < this.state.scrollOffset) {
            // if we are scrolling down (so enlarging the parallax view) resize it immediately (to make it visible while scrolling)
            this.setState({ scrollOffset: scrollOffset })
          } else if (scrollOffset > this.state.scrollOffset) {
            // if we are scrolling up (so reducing the parallax view) resize it after a small delay (to prevent flickering)
            this.resizeTimeout = setTimeout(() => {
              this.setState({ scrollOffset: scrollOffset })
            }, 1000)
          }
        }
      }}
      onScroll={(e) => {
        const scrollOffset = e.nativeEvent.targetContentOffset ? e.nativeEvent.targetContentOffset.y : e.nativeEvent.contentOffset.y
        if (!this.shouldIgnoreScroll && this.state.scrollOffset != scrollOffset) {
          if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout)
            this.resizeTimeout = undefined
          }
         this.setState({ scrollOffset: scrollOffset })
        }
        if (flatListProps.onScroll) { flatListProps.onScroll(e) }
      }}
      onMomentumScrollEnd={(e) => {
        const scrollOffset = e.nativeEvent.contentOffset.y
        this.shouldIgnoreScroll = false
        if (scrollOffset != this.state.scrollOffset) {
          if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout)
            this.resizeTimeout = undefined
          }
          this.setState({ scrollOffset: scrollOffset })
        }
      }}
    />
  }

}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: padding.triple,
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
    // ...shadows.invertedShadowObject,
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
