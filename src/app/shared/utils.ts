import { UAParser } from "ua-parser-js";

export function getDeviceInformation() {
  const parser = UAParser();

  return new Promise<{ deviceType: string, orientation: string }>(
    (resolve) => {
      let deviceType = "PC/Laptop";
      let orientation = "unknown";

      if (navigator.userAgent) {
        if (navigator.userAgent.toLowerCase().match(/mobile/i)) {
          deviceType = "Mobile";
        } else if (parser.os.name! === "Android" || parser.os.name! === "iOS") {
          alert(parser.os.name!);
          deviceType = "Tablet";
        }
        orientation = screen.orientation.type;

        resolve({ deviceType, orientation });
      }
    }
  );
}