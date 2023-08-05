import React from "react"
import { Image, ImageProps, ImageSourcePropType } from "react-native"

import { image_not_available } from '../Assets/Images'

interface IState {
  source: ImageSourcePropType
}

export default class SmartImage extends React.Component<ImageProps, IState> {
  constructor(props: ImageProps) {
    super(props)
    this.state = {
      source: props.source
    }
  }

  public render() {
    return (
      <Image
        {...this.props}
        source={this.state.source}
        onError={(event) => {
          console.log(`*** SmartImage:onError: got error for source=${JSON.stringify(this.state.source)}`, JSON.stringify(event.nativeEvent))
          this.setState({source: image_not_available})
        }}               
      />
    )
  }
}