"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Geist, Geist_Mono } from "next/font/google";
import { DoorOpen } from "lucide-react";
import { KRButton } from "./components/FFComponents";
import "@progress/kendo-theme-material/dist/material-main.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  /**
   * @description - Acts as a unique identifier for each user's session.
   */
  const [userSessId, setUserSessId] = useState<string | null>(null);

  /**
	 * @description - By default, this app will start in a light material theme.
	 * @type {string} - Possible values are "light" | "dark"
	 * @default {"light"}
	 */
	const [sessTheme, setSessTheme] = useState<"light" | "dark">("light");

  //const [userFocusTime, setUserFocusTime] = useState<number>(25);

  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial dimensions on mount

    const storedSessId = localStorage.getItem("userSessId");

    if (storedSessId) {
      // continue with last session.
      setUserSessId(storedSessId);
      setSessTheme(localStorage.getItem("sessTheme") === "light" ? "light" : "dark");
      //setUserFocusTime(parseInt(localStorage.getItem("userFocusTime")!));
      console.log("userFocusTime is:", parseInt(localStorage.getItem("userFocusTime")!));
    } else {
      // new session.
      const newSessId = uuidv4();
      localStorage.setItem("userSessId", newSessId);
      localStorage.setItem("sessTheme", "light");   // default theme
      localStorage.setItem("userFocusTime", "25");  // default focus time
      //setUserFocusTime(25);
    }

    return () => window.removeEventListener('resize', handleResize); // Cleanup
  }, []);

  function onExitClicked() {
    setShowOverlay(true);
  }

  return (
    <html lang="en" data-theme={sessTheme}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex items-center justify-center h-screen bg-gray-300`}
      >
        <div id="dimensions-container" className="dimensions-container">
          <div className="dimension-tab" id="width-tab">
            <span className="dimension-text">Width: {windowDimensions.width}px</span>
          </div>
          <div className="dimension-tab" id="height-tab">
            <span className="dimension-text">Height: {windowDimensions.height}px</span>
          </div>
        </div>
        {/* Page Wrapper */}
        <div className="relative h-screen w-screen flex items-center justify-center">
          {/* Exit Button */}
          <KRButton 
            id="btnExitApp"
            type="button" 
            fillMode={'outline'}
            onClick={onExitClicked}
            style={{ position: 'absolute', top: '1rem', right: '1rem' }}
          >
            <DoorOpen stroke="#141414" strokeWidth={1.5} />
          </KRButton>
          {children}
        </div>
        {/* Display the userSessId */}
        {userSessId && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-4 text-center text-sm text-[#141414]">
            Session ID: {userSessId}
          </div>
        )}

        {/* Overlay */}
        {showOverlay && (
            <div 
              className="fixed top-0 left-0 w-screen h-screen bg-[#FAF9F6] flex items-center justify-center z-50"
              style={{
                opacity: 0.95
              }}  
            > 
              <p className="text-lg text-gray-800 mx-6">
                Your session has ended. You may now close this tab/window.
              </p>
            </div>
          )}
      </body>
    </html>
  );
}
