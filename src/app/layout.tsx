"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Geist, Geist_Mono } from "next/font/google";
// import { getDeviceInformation } from "./shared/utils";
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
  /* const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  }); */

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

  useEffect(() => {

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
  }, []);

  return (
    <html lang="en" data-theme={sessTheme}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex items-center justify-center h-screen`}
      >

        {/* Page Wrapper */}
        <div className="bg-gray-100 w-full h-full items-center 2xl:px-[5%]">
          {children}
        </div>
        {/* Display the userSessId */}
        {/* {userSessId && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 mb-2 session-id text-center text-sm text-[#141414] width-max">
            Session ID: {userSessId}
          </div>
        )} */}
      </body>
    </html>
  );
}
