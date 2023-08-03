import * as React from 'react'
import { Image, StyleSheet, TouchableOpacity, View, Animated, ImageSourcePropType, ViewStyle, ImageStyle, Text, ViewProps } from 'react-native'

interface IImageButtonProps extends ViewProps {
  source: ImageSourcePropType
  onPress: () => void
  onLongPress?: () => void
  style?: ViewStyle
  imageStyle?: ImageStyle
  disabled?: boolean
  pulse?: boolean
  badge?: string
}

interface IImageButtonState {
  fade: Animated.Value
}

export default class ImageButton extends React.Component<IImageButtonProps, IImageButtonState> {

  private pulseAnimation?: Animated.CompositeAnimation

  public constructor(props: IImageButtonProps) {
    super(props)
    this.state = {
      fade: new Animated.Value(0), // Initial value for fade pulsing: 0
    }
  }

  public componentDidMount() {
    const { pulse } = this.props
    if (pulse) {
      this.startPulse()
    } else {
      this.stopPulse()
    }
  }

  public componentDidUpdate(prevProps: IImageButtonProps) {
    if (this.props.pulse !== prevProps.pulse) {
      const { pulse } = this.props
      if (pulse) {
        this.startPulse()
      } else {
        this.stopPulse()
      }
    }
  }

  public componentWillUnmount() {
    this.stopPulse()
  }

  public render() {
    const { source, onPress, style, imageStyle, onLongPress, disabled } = this.props
    const opacity = (disabled ? 0.5 : 1.0)
    const { fade } = this.state


    // It seems that TouchableOpacity always needs to have child View component.
    // So a component that composes a View isn't enough.
    // This is why we add a simple <View> outside of the <Animated.View>.
    return (<TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      onLongPress={onLongPress}
      style={[style, { opacity }]}
    >
    <View>
      <Animated.View style={{ opacity: fade }}>
        <Image source={source} style={[imageStyle, { alignSelf:'center' }]}/>
        { this.props.children
          ? <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            {this.props.children}
          </View>
          : null
        }
        { this.props.badge !== undefined        
          ? <Text style={styles.badge}>{this.props.badge}</Text>
          : null
        }
      </Animated.View>
    </View>
    </TouchableOpacity>)
  }

  private startPulse() {
    if (this.pulseAnimation !== undefined) {
      return
    }
    this.state.fade.setValue(0)
    this.pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.fade, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true
        }),
        Animated.timing(this.state.fade, {
          toValue: 0,
          duration: 750,
          useNativeDriver: true
        }),
      ]),
      {
        iterations: -1, // default -1 for infinite
      })
    this.pulseAnimation!.start()
  }

  private stopPulse() {
    if (this.pulseAnimation !== undefined) {
      this.pulseAnimation.stop()
      this.pulseAnimation = undefined
    }
    this.state.fade.setValue(1)
  }

}

const styles = StyleSheet.create({
  badge: { 
    position: 'absolute',
    width: 20,
    height: 20,
    right: -5,
    top: -5,
    zIndex: 20,
    backgroundColor: 'red',
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'red',
    overflow: 'hidden'
  }
})

