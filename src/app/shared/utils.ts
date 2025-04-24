export function getDeviceInformation() {
  return new Promise<{ isMobile: boolean, orientation: string, fullUA: string }>(
    (resolve) => {
      let isMobile = false;
      let orientation = "unknown";
      let fullUA = "";

      if (navigator.userAgent) {
        isMobile = /mobile|android|iPhone|iPad|iPod/.test(
          navigator.userAgent.toLowerCase()
        );
        fullUA = navigator.userAgent.toString();
        orientation = screen.orientation.type;

        resolve({ isMobile, orientation, fullUA });
      }
    }
  );
}