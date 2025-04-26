export enum DeviceTypes {
  PC_LAPTOP = "PC/Laptop",
  TABLET = "Tablet",
  MOBILE_PHONE = "Mobile"
}

export function getDeviceInformation() {
  return screen.orientation.type;
}