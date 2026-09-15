#!/bin/bash

# Ensure build output directories match the legacy paths expected by Ionic CLI / native-run.
# Cordova-iOS 7+ outputs to Debug-iphonesimulator / Release-iphonesimulator,
# while @ionic/cli looks for platforms/ios/build/emulator and platforms/ios/build/device.

PROJECT_DIR="$(pwd)"

if [ -d "$PROJECT_DIR/platforms/ios/build" ]; then
    BUILD_DIR="$PROJECT_DIR/platforms/ios/build"
elif [ -d "$PROJECT_DIR/build" ]; then
    BUILD_DIR="$PROJECT_DIR/build"
else
    exit 0
fi

cd "$BUILD_DIR" || exit 0

# Handle simulator symlink
if [ -d "Debug-iphonesimulator" ] && [ ! -e "emulator" ]; then
    ln -sf Debug-iphonesimulator emulator
    echo "[Cordova Hook] Created symlink: build/emulator -> Debug-iphonesimulator"
elif [ -d "Release-iphonesimulator" ] && [ ! -e "emulator" ]; then
    ln -sf Release-iphonesimulator emulator
    echo "[Cordova Hook] Created symlink: build/emulator -> Release-iphonesimulator"
fi

# Handle device symlink
if [ -d "Release-iphoneos" ] && [ ! -e "device" ]; then
    ln -sf Release-iphoneos device
    echo "[Cordova Hook] Created symlink: build/device -> Release-iphoneos"
elif [ -d "Debug-iphoneos" ] && [ ! -e "device" ]; then
    ln -sf Debug-iphoneos device
    echo "[Cordova Hook] Created symlink: build/device -> Debug-iphoneos"
fi
