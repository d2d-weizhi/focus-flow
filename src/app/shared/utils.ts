export function getDeviceInformation() {
  return new Promise<{ deviceType: string, orientation: string }>(
    (resolve) => {
      let deviceType = "PC/Laptop";
      let orientation = "unknown";
      let isAndroid = false;

      if (navigator.userAgent) {
        if (navigator.userAgent.toLowerCase().match(/mobile/i)) {
          deviceType = "Mobile";
        } else if (navigator.userAgent.toLowerCase().match(/android/i)) {
          deviceType = "Tablet";
        }
        orientation = screen.orientation.type;

        resolve({ deviceType, orientation });
      }
    }
  );
}