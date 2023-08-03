//
//  NativeHelperBridge.m
//
//  Created by Roberto O. Buratti on 25/04/2019.
//

#import "NativeHelperBridge.h"
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_REMAP_MODULE(NativeHelperModule, NativeHelper, NSObject)

RCT_EXTERN_METHOD(postLocalNotification:(NSString *)title
                  body:(NSString *)body
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(forceTermination:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject);
@end
