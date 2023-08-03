export = NativeHelper

declare namespace NativeHelper {
  export function postLocalNotification(title: string, body: string): Promise<void>
  export function forceTermination(): Promise<void>
}
