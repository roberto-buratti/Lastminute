//
//  NativeHelper.swift
//
//  Created by Roberto O. Buratti on 25/04/2019.
//

import Foundation
import UserNotifications

@objc(NativeHelper)
public class NativeHelper: RCTEventEmitter {
  
  // MARK: - Lifecycle

    override public init() {
      super.init()
    }
    
    // MARK: - RCTEventEmitter
  
    override public static func requiresMainQueueSetup() -> Bool {
        return true;
    }

    @objc(supportedEvents)
    override public func supportedEvents() -> [String] {
        return []
    }
  
    // MARK: - Bridged Methods
    
    @objc(postLocalNotification:body:resolve:reject:)
    public func postLocalNotification(title: String?, body: String?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
      DispatchQueue.main.async {
        let content = UNMutableNotificationContent()
        if (title != nil) { content.title = title! }
        if (body != nil) { content.body = body! }
        content.sound = UNNotificationSound.defaultCritical
        
        // show this notification now
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 0.1, repeats: false)

        // choose a random identifier
        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: trigger)

        // add our notification request
        UNUserNotificationCenter.current().add(request) { err in
          print(err)
        }
        
        resolve(nil)
      }
    }
    
    @objc(forceTermination:reject:)
    public func forceTermination(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
      print("*** forceTermination: bye, bye...")
      exit(0)
    }
  
}
