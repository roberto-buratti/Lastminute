import * as React from 'react'
import {
  StyleSheet, View, FlatList, ListRenderItem, FlatListProps, Dimensions, Platform, KeyboardAvoidingView
} from 'react-native'
import padding from '../Styles/Padding'
import colors from '../Styles/Colors'

interface IProps extends FlatListProps<any> {
  stickyHeaderView?: React.ReactElement<any>
  // stickyHeaderHeight: number
  parallaxView?: React.ReactElement<any>
  fixedView?: React.ReactElement<any>
  data: any[]
  renderItem: ListRenderItem<any>
  itemWrapperStyle?: any
}

interface IState {
  height: number
  scrollOffset: number
  stickyHeaderHeight: number
}

const handleHeight = padding.quarter + 1

export default class ParallaxScrollView extends React.Component<IProps, IState> {
  public state: IState = {
    height: Dimensions.get('window').height,
    scrollOffset: 0,
    stickyHeaderHeight: 75
  }

  private scrollView = React.createRef<FlatList<any>>()
  private isDragging = false
  private resizeTimeout: NodeJS.Timeout | undefined = undefined

  public render() {
    const {
      stickyHeaderView,
      parallaxView,
      fixedView,
      data,
      renderItem,
      contentOffset,
      itemWrapperStyle,
      style,
      ...flatListProps
    } = this.props
    const { stickyHeaderHeight } = this.state

    const parallaxHeight = Math.max(0, this.state.height - this.state.scrollOffset - stickyHeaderHeight - handleHeight)

    // console.log(`*** ParallaxScrollView:render: height=${this.state.height} scrollOffset=${this.state.scrollOffset} parallaxHeight=${parallaxHeight}`)

    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <FlatList
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
                <View style={[styles.handleBar, { flex: 0 }]} >
                    <View style={styles.handle}/>
                    <View style={{flex: 0}}
                      onLayout={(e) => this.setState({stickyHeaderHeight: e.nativeEvent.layout.height}, () => {
                        this.forceUpdate()  // [ROB] sometimes the FlatList gets in troubles on this event... quick & dirty solution
                      })}>
                      {stickyHeaderView}
                    </View>
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
              this.setState({ height: e.nativeEvent.layout.height }, () => {
                if (flatListProps.onLayout) { flatListProps.onLayout(e) }
                // if (this.scrollView.current) {
                //   this.scrollView.current.scrollToOffset({ animated: true, offset: this.state.height / 2 })
                // }
                //this.scrollView.current?.scrollToIndex({animated: true, index: 1, viewPosition: 0.5})    
              })
            }
          }}
          onScrollBeginDrag={(e) => {
            this.isDragging = true
          }}
          onScrollEndDrag={(e) => {
            this.isDragging = false
            const scrollOffset = e.nativeEvent.targetContentOffset ? e.nativeEvent.targetContentOffset.y : e.nativeEvent.contentOffset.y
            if (this.resizeTimeout) {
              clearTimeout(this.resizeTimeout)
              this.resizeTimeout = undefined
            }
            if (scrollOffset < this.state.scrollOffset) {
              // if we are scrolling down (so enlarging the parallax view) resize it immediately (to make it visible while scrolling)
              this.setState({ scrollOffset: scrollOffset })
            } else if (scrollOffset > this.state.scrollOffset) {
              // if we are scrolling up (so reducing the parallax view) resize it after a small delay (to avoid flickering)
              this.resizeTimeout = setTimeout(() => {
                this.setState({ scrollOffset: scrollOffset })
              }, 1000)
            }
          }}
          onScroll={(e) => {
            const scrollOffset = e.nativeEvent.targetContentOffset ? e.nativeEvent.targetContentOffset.y : e.nativeEvent.contentOffset.y
            if (this.isDragging) {
              if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout)
                this.resizeTimeout = undefined
              }
              if (scrollOffset != this.state.scrollOffset) {
                this.setState({ scrollOffset: scrollOffset })
              }
            }
            if (flatListProps.onScroll) { flatListProps.onScroll(e) }
          }}
          onMomentumScrollEnd={(e) => {
            this.isDragging = false
            const scrollOffset = e.nativeEvent.contentOffset.y
            if (scrollOffset != this.state.scrollOffset) {
              if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout)
                this.resizeTimeout = undefined
              }
              this.setState({ scrollOffset: scrollOffset })
            }
          }}
        />
      </KeyboardAvoidingView>

    )    
  }

  public redraw() {
    this.forceUpdate(() => {
      console.log(`*** ParallaxView:redraw: now scrolling to end`)
      //this.scrollView.current?.scrollToOffset({ animated: true, offset: this.state.height / 2 })
      //this.scrollView.current?.scrollToEnd({animated: true})
      this.scrollView.current?.scrollToIndex({animated: true, index: 0, viewPosition: 0})
    })
  }

}

const styles = StyleSheet.create({
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
