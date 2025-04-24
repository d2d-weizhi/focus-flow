export enum DeviceTypes {
  PC_LAPTOP = "PC/Laptop",
  TABLET = "Tablet",
  MOBILE_PHONE = "Mobile"
}

export function getDeviceInformation() {
  return new Promise<{ deviceType: string, orientation: string }>(
    (resolve) => {
      let deviceType = DeviceTypes.PC_LAPTOP;
      let orientation = "unknown";

      if (navigator.userAgent) {
        if (navigator.userAgent.toLowerCase().match(/mobile/i))
          deviceType = DeviceTypes.MOBILE_PHONE;

        orientation = screen.orientation.type;
        resolve({ deviceType, orientation });
      }
    }
  );
}