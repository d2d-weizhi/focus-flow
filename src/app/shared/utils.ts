export function getDeviceInformation() {
  return new Promise<{ isMobile: boolean, orientation: string }>(
    (resolve) => {
      let isMobile = false;
      let orientation = "unknown";

      if (navigator.userAgent) {
        isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|OperaMini/i.test(
          navigator.userAgent
        );
        orientation = screen.orientation.type;

        window.addEventListener("orientationchange", () => {
          orientation = screen.orientation.type;
          resolve({ isMobile, orientation });
        });

        resolve({ isMobile, orientation });
      }
    }
  );
}