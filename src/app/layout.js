"use client";

import { useState, useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import AppNavbar from "./components/Navbar";
import "./globals.css";
import UserContext from "./components/UserContext";

export default function RootLayout({ children }) {
  const [userData, setUserData] = useState(null);
  const [userNotFound, setUserNotFound] = useState(false);

  useEffect(() => {
    fetch("/api/userData")
      .then((res) => {
        if (res.status === 404) {
          setUserNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => setUserData(data))
      .catch(console.error);
  }, []);

  return (
    <UserContext.Provider
      value={{ userData, userNotFound, setUserData, setUserNotFound }}
    >
      <html lang="en">
        <body className="flex flex-col h-screen overflow-hidden bg-base-100 text-base-content">
          <AppNavbar />

          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Children will be the page-specific content */}
            {children}
          </main>
        </body>
      </html>
    </UserContext.Provider>
  );
}
