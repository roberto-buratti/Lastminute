import * as React from 'react'
import { StyleProp, StyleSheet, View, ImageStyle, Image, ImageProps, ImageSourcePropType } from 'react-native'

import { pin, image_not_available } from '../Assets/Images'

interface IProps extends ImageProps {
  style?: StyleProp<ImageStyle>
  height: number,
  width: number,
  borderWidth?: number,
  borderColor?: string,
}

interface IState {
  source: ImageSourcePropType
}

export default class MapPin extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      source: props.source
    }
  }

  public render() {
    const { style, width, height, borderWidth, borderColor } = this.props
    const { source } = this.state

    // using defaultSource={pin} is not needed, but it is a simple trick to make the pin be shown into a (buggy?) <Marker>
    return <View style={style}>
      <Image style={styles.background} source={pin} defaultSource={pin}/>
      <View style={styles.avatar}>
        <Image
          key={`${source}`}
          source={source}
          style={{
            borderWidth: borderWidth,
            borderColor: borderColor,
            borderRadius: width / 2,
            width: width,
            height:height
          }}
          onError={(event)=>{
            console.log(`*** MapPin:Image.onError: got error for source=${JSON.stringify(source)}`, JSON.stringify(event.nativeEvent))
            this.setState({source: image_not_available})
          }}               
        />
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
    background: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: '100%',
      height: '100%',
      zIndex: 1,
    },
    avatar: {
      zIndex: 2,
      marginTop: 7,
      marginLeft: 6.5,
      marginRight: 6.5,
    }
})
  
