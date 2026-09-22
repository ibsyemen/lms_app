cordova.define("cordova-plugin-moodleapp.moodleapp", function(require, exports, module) {
    "use strict";
(() => {
  // src/ts/plugins/Diagnostic.ts
  var Diagnostic = class {
    constructor() {
      this.permissionStatus = permissionStatus;
      this.permission = permission;
      this.requestInProgress = false;
    }
    /**
     * Opens settings page for this app.
     */
    switchToSettings() {
      return new Promise((resolve, reject) => cordova.exec(resolve, reject, "Diagnostic", "switchToSettings"));
    }
    /**
     * Requests access to microphone if authorization was never granted nor denied, will only return access status otherwise.
     *
     * @returns Permission status.
     */
    requestMicrophoneAuthorization() {
      return new Promise((resolve, reject) => {
        if (cordova.platformId === "ios") {
          cordova.exec(
            (isGranted) => resolve(isGranted ? permissionStatus.granted : permissionStatus.deniedAlways),
            reject,
            "Diagnostic_Microphone",
            "requestMicrophoneAuthorization"
          );
          return;
        }
        this.requestRuntimePermission(permission.recordAudio).then(resolve).catch(reject);
      });
    }
    /**
     * Android only. Given a list of permissions, returns the status for each permission.
     *
     * @param permissions Permissions to check.
     * @returns Status for each permission.
     */
    getPermissionsAuthorizationStatus(permissions) {
      return new Promise((resolve, reject) => {
        if (cordova.platformId !== "android") {
          resolve({});
          return;
        }
        cordova.exec(
          (statuses) => {
            for (const permission2 in statuses) {
              statuses[permission2] = this.convertPermissionStatus(statuses[permission2]);
            }
            resolve(statuses);
          },
          reject,
          "Diagnostic",
          "getPermissionsAuthorizationStatus",
          [permissions]
        );
      });
    }
    /**
     * Android only. Requests app to be granted authorisation for a runtime permission.
     *
     * @param permission Permissions to request.
     * @returns Status for each permission.
     */
    requestRuntimePermission(permission2) {
      return new Promise((resolve, reject) => {
        if (cordova.platformId !== "android") {
          resolve(permissionStatus.granted);
          return;
        }
        if (this.requestInProgress) {
          reject("A runtime permissions request is already in progress");
        }
        this.requestInProgress = true;
        cordova.exec(
          (statuses) => {
            this.requestInProgress = false;
            resolve(this.convertPermissionStatus(statuses[permission2]));
          },
          (error) => {
            this.requestInProgress = false;
            reject(error);
          },
          "Diagnostic",
          "requestRuntimePermission",
          [permission2]
        );
      });
    }
    /**
     * Convert a permission status so it has the same value in all platforms.
     * Each platform can return a different value for a status, e.g. a granted permission returns 'authorized' in iOS and
     * 'GRANTED' in Android. This function will convert the status so it uses the iOS value in all platforms, unless it's an
     * Android specific value.
     *
     * @param status Original status.
     * @returns Converted status.
     */
    convertPermissionStatus(status) {
      for (const name in androidPermissionStatus) {
        const androidStatus = androidPermissionStatus[name];
        const iosStatus = iosPermissionStatus[name];
        if (status === androidStatus && iosStatus !== void 0) {
          return iosStatus;
        }
      }
      return status;
    }
  };
  var permission = {
    recordAudio: "RECORD_AUDIO"
  };
  var androidPermissionStatus = {
    granted: "GRANTED",
    // User granted access to this permission.
    grantedWhenInUse: "authorized_when_in_use",
    // User granted access to this permission only when app is in use.
    deniedOnce: "DENIED_ONCE",
    // User denied access to this permission.
    deniedAlways: "DENIED_ALWAYS",
    // User denied access to this permission and checked "Never Ask Again" box.
    notRequested: "NOT_REQUESTED"
    // App has not yet requested access to this permission.
  };
  var iosPermissionStatus = {
    notRequested: "not_determined",
    // App has not yet requested this permission
    deniedAlways: "denied_always",
    // User denied access to this permission
    restricted: "restricted",
    // Permission is unavailable and user cannot enable it. For example, when parental controls are on.
    granted: "authorized",
    //  User granted access to this permission.
    grantedWhenInUse: "authorized_when_in_use",
    //  User granted access to this permission only when app is in use
    ephimeral: "ephemeral",
    // The app is authorized to schedule or receive notifications for a limited amount of time.
    provisional: "provisional",
    // The application is provisionally authorized to post non-interruptive user notifications.
    limited: "limited"
    // The app has limited access to the Photo Library.
  };
  var permissionStatus = {
    ...androidPermissionStatus,
    ...iosPermissionStatus
  };

  // src/ts/plugins/InstallReferrer.ts
  var InstallReferrer = class {
    /**
     * Get referrer data.
     *
     * @returns Referrer data.
     */
    async getReferrer() {
      return new Promise((resolve, reject) => {
        cordova.exec(resolve, reject, "InstallReferrer", "getReferrer", []);
      });
    }
  };

  // src/ts/plugins/SecureStorage.ts
  var SecureStorage = class {
    /**
     * Get one or more values.
     *
     * @param names Names of the values to get.
     * @param collection The collection where the values are stored.
     * @returns Object with name -> value. If a name isn't found it won't be included in the result.
     */
    async get(names, collection) {
      if (typeof names === "string") {
        names = [names];
      }
      return new Promise((resolve, reject) => {
        cordova.exec(resolve, reject, "SecureStorage", "get", [names, collection]);
      });
    }
    /**
     * Set one or more values.
     *
     * @param data Object with values to store, in format name -> value. Null or undefined valid values will be ignored.
     * @param collection The collection where to store the values.
     */
    async store(data, collection) {
      for (const name in data) {
        const value = data[name];
        if (value === void 0 || value === null) {
          delete data[name];
        } else if (typeof value !== "string") {
          throw new Error(`SecureStorage: Invalid value for ${name}. Expected string, received ${typeof value}`);
        }
      }
      await new Promise((resolve, reject) => {
        cordova.exec(resolve, reject, "SecureStorage", "store", [data, collection]);
      });
    }
    /**
     * Delete one or more values.
     *
     * @param names Names to delete.
     * @param collection The collection where to delete the values.
     */
    async delete(names, collection) {
      if (typeof names === "string") {
        names = [names];
      }
      await new Promise((resolve, reject) => {
        cordova.exec(resolve, reject, "SecureStorage", "delete", [names, collection]);
      });
    }
    /**
     * Delete all values for a certain collection.
     *
     * @param collection The collection to delete.
     */
    async deleteCollection(collection) {
      await new Promise((resolve, reject) => {
        cordova.exec(resolve, reject, "SecureStorage", "deleteCollection", [collection]);
      });
    }
  };

  // src/ts/index.ts
  var api = {
    secureStorage: new SecureStorage(),
    installReferrer: new InstallReferrer(),
    diagnostic: new Diagnostic()
  };
  module.exports = api;
})();

});
