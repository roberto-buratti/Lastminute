import * as React from 'react'
import {
  View, StyleProp, StyleSheet, TouchableOpacity,
  Image, ImageStyle, ImageProps, ImageURISource, ImageSourcePropType, ImageRequireSource
} from 'react-native'
import { avatar_camera } from '../Assets/Images'

interface IEditableImageProps extends ImageProps {
  onPress: () => void
  style?: StyleProp<ImageStyle>
  height?: number,
  width?: number,
  fallbackSource?: ImageRequireSource,
  url?: string,
  rounded?: boolean,
  disabled?: boolean,
}

interface IEditableImageState {
  imageSource?: ImageSourcePropType
}

export default class EditableImage extends React.Component<IEditableImageProps, IEditableImageState> {

  constructor(props: IEditableImageProps) {
      super(props)
      this.state = { imageSource: props.source }
  }

  // public componentDidUpdate(prevProps: Readonly<IEditableImageProps>, prevState: Readonly<IEditableImageState>, snapshot?: any): void {
  //   console.log(`*** ROB DEBUG:EditableImage:componentDidUpdate: props=${JSON.stringify(this.props)}`)
  // }

  public render() {
    const {
      onPress,
      style,
      width,
      height,
      rounded,
      disabled,
      fallbackSource,
      ...imageProps
    } = this.props

    const { imageSource } = this.state

    const containerStyle = [
      style,
      { width, height },
      rounded ? { borderRadius: (width || 0) / 2 } : {},
      rounded ? styles.rounded : {}
    ]

    const dims = {
      width: width && width,
      height: height && height,
    }

    const props = {
      ...imageProps,
      resizeMode: 'cover' as 'cover',
      style: [style, dims],
      ...dims,
    }

    // CAVE: we don't support ImageURISource[]
    const isStatic = Number.isInteger(imageProps.source as ImageRequireSource)
    const isUndefined = !(isStatic ? imageProps.source : ((((imageProps.source as ImageURISource).uri) as string) || '').trim().length)
    const sourceOrFallback: ImageSourcePropType | undefined = !isUndefined 
      ? imageProps.source 
      : (imageSource || fallbackSource)
    
    console.log(`*** ROB DEBUG:EditableImage:render: source=${JSON.stringify(sourceOrFallback)}`)

    return <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View style={containerStyle}>
        { sourceOrFallback ? <Image {...props} source={sourceOrFallback}/> : null }
      </View>
      <Image source={avatar_camera} style={{...styles.camera, opacity: this.props.disabled ? 0 : 1}}/>
    </TouchableOpacity>
  }
}

const styles = StyleSheet.create({
  rounded: {
    borderWidth: 2,
    borderColor: "coral",
    overflow: 'hidden',
  },
  camera: {
    position: 'absolute',
    right: 3,
    bottom: 3
  },
})
