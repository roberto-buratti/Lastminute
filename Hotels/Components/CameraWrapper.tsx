import * as React from 'react'
import { StyleSheet, View, ActivityIndicator, Alert } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { RNCamera } from 'react-native-camera'
import ImagePicker, { Image as PickerImage } from 'react-native-image-crop-picker'
import Permissions, { PERMISSIONS, PermissionStatus } from 'react-native-permissions'

import { photos, take_photo, camera_front } from '../Assets/Images'
import IImageProps from './Interfaces/IImageProps'

import ImageButton from './ImageButton'

export interface ICamerWrapperProps {
  onPictureSelect: (image: IImageProps) => void
}

interface ICamerWrapperState {
  hideControls: boolean,
  loading: boolean,
  frontCamera: boolean
}

export default class Camera extends React.Component<ICamerWrapperProps, ICamerWrapperState> {
  public state: ICamerWrapperState = {
    hideControls: false,
    loading: false,
    frontCamera: true,
  }

  private camera = React.createRef<RNCamera>()
  private mounted: boolean = false

  public render() {
    const { hideControls, loading, frontCamera } = this.state
    return (
      <View style={styles.container}>
        <RNCamera
          ref={this.camera}
          style={styles.preview}
          type={frontCamera ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          captureAudio={false}
          permissionDialogTitle={'camera_permission_title'}
          permissionDialogMessage={'camera_permission_body'}
          onStatusChange={this.handlePermission}
        />
        {hideControls ? null : <View style={styles.buttons}>
          <View style={styles.left}>
            <ImageButton
              source={photos}
              onPress={this.goToLibrary}
            />
          </View>
          <ImageButton
            source={take_photo}
            onPress={this.takePicture}
          />
          <View style={styles.right}>
            <ImageButton
              source={camera_front}
              onPress={() => this.setState(state => ({ frontCamera: !state.frontCamera }))}
            />
          </View>
        </View>}
        {loading ? <View
          style={styles.loadingContainer}
        >
          <ActivityIndicator animating={true} size="large" color={Colors.white} />
        </View> : null}
      </View>
    )
  }

  public componentDidMount() {
    this.mounted = true
  }

  public componentWillUnmount() {
    this.mounted = false
  }

  private takePicture = () => {
    if (this.camera && this.camera.current) {
      this.setState({hideControls: true, loading: true})
      this.camera.current.takePictureAsync({
        quality: 0.5,
        exif: true,
        fixOrientation: true,
        width: 800,
      })
      .then(image => {
        return this.onPictureSelect(image.uri)
      })
      .finally(() => this.mounted && this.setState({hideControls: false, loading: false}))
    }
  }

  private goToLibrary = () => {
    this.setState({hideControls: true, loading: true})
    ImagePicker.openPicker({
      forceJpg: true,
      includeExif: true,
      mediaType: 'photo',
    })
    .then(image => image as PickerImage)
    .then(image => this.onPictureSelect(image.path))
    .finally(() => this.mounted && this.setState({hideControls: false, loading: false}))
  }

  private onPictureSelect = (uri: string) => ImagePicker.openCropper({
    mediaType: 'photo',
    path: uri,
    width: 400,
    height: 400,
    includeBase64: true,
  })
  .then(croppedImage => {
    if (!croppedImage.data) {
        throw "Gulp!"
    }
    return this.props.onPictureSelect({
      uri: `file://${croppedImage.path}`,
      base64: croppedImage.data, 
      contentType: croppedImage.mime,
    })
  })

  private handlePermission = (permission: any) => {
    if (permission.cameraStatus === 'NOT_AUTHORIZED') {
      Alert.alert(
        'camera_permission_title',
        'camera_permission_body',
        [
          {
            text: 'grant_permission', onPress: () => {
              Permissions.request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((response: any) => {
                console.log(`*** CameraWrapper:handlePermission: response=${JSON.stringify(response)}`);
              })
            },
          },
          {
            text: 'deny_permission', onPress: () => {
            },
          },
        ]
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 8,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  right: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.black,
  },
})
