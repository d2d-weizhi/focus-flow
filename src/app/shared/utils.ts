var platform = require("platform");

export function getDeviceInformation() {
  return new Promise<{ deviceType: string, orientation: string }>(
    (resolve) => {
      let deviceType = "PC/Laptop";
      let orientation = "unknown";

      if (navigator.userAgent) {
        if (navigator.userAgent.toLowerCase().match(/mobile/i)) {
          deviceType = "Mobile";
        } else if (platform.os.indexOf("iOS") != -1 || platform.os.indexOf("Android") != -1) {
          deviceType = "Tablet";
        }
        orientation = screen.orientation.type;

        resolve({ deviceType, orientation });
      }
    }
  );
}