#!/bin/bash
PROJECT_DIR="$(pwd)"
if [ -d "$PROJECT_DIR/platforms/ios/cordova" ]; then
    cat << 'EOF' > "$PROJECT_DIR/platforms/ios/cordova/build-extras.xcconfig"
SWIFT_OBJC_INTERFACE_HEADER_NAME = Moodle-Swift.h
DEVELOPMENT_TEAM = MV4454QGWS
EOF
fi

if [ -d "$PROJECT_DIR/platforms/ios/App/Assets.xcassets/AppIcon.appiconset" ] && [ -f "$PROJECT_DIR/resources/icon-ios.png" ]; then
    cp "$PROJECT_DIR/resources/icon-ios.png" "$PROJECT_DIR/platforms/ios/App/Assets.xcassets/AppIcon.appiconset/icon.png"
fi

