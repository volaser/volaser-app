package com.volaser.deviceRotation;
// Based on https://github.com/muxe/react-native-device-rotation

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import androidx.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class DeviceRotation implements SensorEventListener {
    private SensorManager mSensorManager;
    private Sensor mRotationVector;
    private boolean isRegistered = false;

    private ReactContext mReactContext;

    private AlertDialog.Builder alertDialogBuilder;

    public DeviceRotation(ReactApplicationContext reactContext) {
        mSensorManager = (SensorManager) reactContext.getSystemService(reactContext.SENSOR_SERVICE);
        assert mSensorManager != null;
        mRotationVector = mSensorManager.getDefaultSensor(Sensor.TYPE_GAME_ROTATION_VECTOR);
        mReactContext = reactContext;
        alertDialogBuilder = new AlertDialog.Builder(mReactContext.getCurrentActivity());
        alertDialogBuilder
                .setTitle("Error")
                .setPositiveButton("Ok", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
            }
        });
    }

    public boolean start() {
        if (mRotationVector == null) {
            this.alertDialogBuilder
                    .setMessage("The rotation vector sensor couldn't be found. This could indicate that it doesn't exit or that the application doesn't have the appropriate permissions.")
                    .create()
                    .show();
            return false;
        }

        if (!isRegistered) {
            boolean success = mSensorManager.registerListener(this, mRotationVector, SensorManager.SENSOR_DELAY_UI);
            if (!success) {
                this.alertDialogBuilder
                        .setMessage("An error occurred trying to register the rotation vector listener. This might mean the sensor isn't supported by the device.")
                        .create()
                        .show();
                return false;
            }
            isRegistered = true;
            return true;
        }
        return false;
    }

    public void stop() {
        if (isRegistered == true) {
            mSensorManager.unregisterListener(this);
            isRegistered = false;
        }
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        try {
            mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
        } catch (RuntimeException e) {
            Log.e("ERROR", "java.lang.RuntimeException: Trying to invoke JS before CatalystInstance has been set!");
        }
    }

    @Override
    public void onSensorChanged(SensorEvent sensorEvent) {
        Sensor mySensor = sensorEvent.sensor;

        if (mySensor.getType() == Sensor.TYPE_GAME_ROTATION_VECTOR) {
            float R[] = new float[16];
            mSensorManager.getRotationMatrixFromVector(R, sensorEvent.values);
            long curTime = System.currentTimeMillis();
            float orientation[] = new float[3];
            mSensorManager.getOrientation(R, orientation);
            this.sendRotationEvent(orientation[0], orientation[1], orientation[2]);
        }
    }

    private void sendRotationEvent(float heading, float pitch, float roll) {
        WritableMap map = Arguments.createMap();
        heading = (float) ((Math.toDegrees(heading)) % 360.0f);
        pitch = (float) ((Math.toDegrees(pitch)) % 360.0f);
        roll = (float) ((Math.toDegrees(roll)) % 360.0f);

        if (heading < 0) {
            heading = 360 - (0 - heading);
        }

        if (pitch < 0) {
            pitch = 360 - (0 - pitch);
        }

        if (roll < 0) {
            roll = 360 - (0 - roll);
        }

        map.putDouble("azimuth", heading);
        map.putDouble("pitch", pitch);
        map.putDouble("roll", roll);
        sendEvent("DeviceRotation", map);
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
    }
}
