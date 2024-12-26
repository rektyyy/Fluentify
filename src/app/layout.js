"use client";

import { useState, useEffect } from "react";
import localFont from "next/font/local";
import "bootstrap/dist/css/bootstrap.min.css";
import AppNavbar from "./components/Navbar";
import "./globals.css";
import UserContext from "./components/UserContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  const [userData, setUserData] = useState(null);
  const [userNotFound, setUserNotFound] = useState(false);

  useEffect(() => {
    fetch("/api/getUserData")
      .then((response) => {
        if (response.status === 404) {
          setUserNotFound(true);
          return null;
        }
        return response.json();
      })
      .then((data) => setUserData(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <UserContext.Provider value={{ userData, userNotFound }}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <AppNavbar />
          {children}
        </body>
      </html>
    </UserContext.Provider>
  );
}
