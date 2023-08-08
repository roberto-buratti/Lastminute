import * as React from 'react'
import { Animated, ViewStyle } from "react-native"

interface IProps {
  isVisible: boolean
  style?: ViewStyle
  children?: any
}

interface IState {  
  height: number
  yCoord: Animated.Value
  yScale: Animated.Value
  style: ViewStyle
}

export default class Fade extends React.Component<IProps,IState>  {


  constructor(props: IProps) {
    super(props)
    this.state = {
      height: 0,
      style: { position: 'absolute', opacity: 0 },
      yCoord: new Animated.Value(0),
      yScale: new Animated.Value(0)
    }
  }

  public componentDidUpdate(prevProps: IProps) {
    console.log(`*** Fade:componentDidUpdate: isVisible=${JSON.stringify(this.props.isVisible)}`)
    if (this.props.isVisible != prevProps.isVisible) {
      if (this.props.isVisible) {
        this.setState({ style: { position: 'relative', opacity: 1 } })
      }    
    }
  }

  render() {
    const { isVisible, children } = this.props
    const { yCoord, yScale, height } = this.state

    

    console.log(`*** Fade:render: { yCoord, height, opacity }=${JSON.stringify({ yCoord, yScale, height })}`)
    Animated.parallel([
      Animated.timing(yCoord, { 
        toValue: isVisible ? 0 : -height, 
        duration: 1000, 
        useNativeDriver: false 
      }),
      Animated.timing(yScale, { 
        toValue: isVisible ? 1 : 0, 
        duration: 1000, 
        useNativeDriver: false
      }),
    ])
    .start(({finished}) => {
      if (finished && !isVisible) {
        this.setState({ style: { position: 'absolute', opacity: 0 } })
      }
      console.log(`*** Fade:start: finished=${finished}`)
    })

    
    return (
      <Animated.View 
        style={[this.props.style, this.state.style, {flex: 0, borderWidth: 1, transform: [{ translateY: yCoord }, { scaleY: yScale }] }]} 
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height          
          console.log(`*** Fade:Animated.View.onLayout: h=${h}`)
          this.setState({ 
            height: h,
            yCoord: new Animated.Value(this.props.isVisible ? 0 : -h), 
            yScale: new Animated.Value(this.props.isVisible ? 1 : 0), 
          })
        }}>
        {children}
      </Animated.View>
    );
  }
}
