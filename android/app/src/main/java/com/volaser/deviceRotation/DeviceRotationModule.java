package com.volaser.deviceRotation;
// Based on https://github.com/muxe/react-native-device-rotation

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class DeviceRotationModule extends ReactContextBaseJavaModule {

    private DeviceRotation deviceRotation;
    private ReactApplicationContext reactContext;

    public DeviceRotationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "DeviceRotation";
    }

    @ReactMethod
    public boolean start() {
        if (deviceRotation == null) {
            deviceRotation = new DeviceRotation(reactContext);
        }
        return deviceRotation.start();
    }

    @ReactMethod
    public void stop() {
        if (deviceRotation != null) {
            deviceRotation.stop();
        }
    }

    @ReactMethod
    public void setUpdateInterval(float interval) {
        // do nothing
    }
}