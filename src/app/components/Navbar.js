"use client";
import { useContext } from "react";
import UserContext from "./UserContext";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

export default function AppNavbar() {
  const { userData } = useContext(UserContext);

  async function handleDelete() {
    if (
      confirm("Are you sure you want to delete your data? THIS IS PERMANENT!")
    ) {
      try {
        await fetch("/api/userData", {
          method: "DELETE",
        });

        await fetch("/api/treeData", {
          method: "DELETE",
        });
        const response = await fetch("/api/treeData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Lessons",
            attributes: {
              id: "root",
            },
            children: [],
          }),
        });

        if (response.ok) {
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }

  return (
    <div className="navbar bg-base-200">
      {/* Left side (brand) */}
      <div className="flex-1">
        <a href="/" className="btn btn-ghost text-xl">
          My app
        </a>
        {/* Flag image if userData exists */}
        {userData?.language?.[1] && (
          <Image
            src={`/flags/${userData.language[1]}.jpg`}
            alt={`${userData.language[1]} flag`}
            width={40}
            height={25}
          />
        )}
      </div>

      {/* Right side (menu/links) */}
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a href="/learn">Learn</a>
          </li>
          <li>
            <a href="/talk">Talk</a>
          </li>
          {userData ? (
            <li tabIndex={0}>
              <details>
                <summary>{userData.name}</summary>
                <ul className="bg-base-100 rounded-t-none p-2">
                  <li>
                    <a href="/">Change profile</a>
                  </li>
                  <li>
                    <a onClick={handleDelete}>Delete data</a>
                  </li>
                </ul>
              </details>
            </li>
          ) : (
            <li>
              <a href="/">Create profile</a>
            </li>
          )}
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </div>
  );
}
