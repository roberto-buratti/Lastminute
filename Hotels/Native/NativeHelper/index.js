import { NativeModules } from 'react-native'

const { NativeHelperModule: NativeHelper } = NativeModules

module.exports.postLocalNotification = postLocalNotification
module.exports.forceTermination = forceTermination

function postLocalNotification(title, body) {
    if (title || body) {
      return NativeHelper.postLocalNotification(title, body)
    } else {
      return Promise.reject()
    }
}
  
function forceTermination() {
    NativeHelper.forceTermination()
}

