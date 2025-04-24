export function getDeviceInformation() {
  return new Promise<{ deviceType: string, orientation: string }>(
    (resolve) => {
      let deviceType = "PC/Laptop";
      let orientation = "unknown";

      if (navigator.userAgent) {
        if (navigator.userAgent.toLowerCase().match(/mobile/i))
          deviceType = "Mobile";

        orientation = screen.orientation.type;
        resolve({ deviceType, orientation });
      }
    }
  );
}