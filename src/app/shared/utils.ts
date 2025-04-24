export function getDeviceInformation() {
  return new Promise<{ isMobile: boolean, orientation: string }>(
    (resolve) => {
      let isMobile = false;
      let orientation = "unknown";

      if (navigator.userAgent) {
        isMobile = /mobile|android|iPhone|iPad|iPod/.test(
          navigator.userAgent.toLowerCase()
        );
        orientation = screen.orientation.type;

        resolve({ isMobile, orientation });
      }
    }
  );
}