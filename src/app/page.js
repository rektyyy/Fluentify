"use client";

import { useContext, useState } from "react";
import UserContext from "./components/UserContext";

export default function Home() {
  const { userData, setUserData, userNotFound, setUserNotFound } =
    useContext(UserContext);
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("");

  function handleLanguageChange(e) {
    setLanguage(e.target.value.split(" "));
  }

  if (userNotFound) {
    return (
      <div className="container mt-5">
        <h1 className="text-danger mb-4">User not found</h1>
        <form
          className="bg-light p-4 rounded"
          onSubmit={async (e) => {
            e.preventDefault();
            const res = await fetch("/api/saveUserData", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, language }),
            });
            if (res.ok) {
              setUserData({ name: name, language: language });
              setUserNotFound(false);
            }
          }}
        >
          <div className="mb-3">
            <label className="form-label">
              Name:
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          </div>
          <div className="mb-3">
            <label className="form-label">
              Language:
              <select className="form-select" onChange={handleLanguageChange}>
                <option value="en-US en English">English</option>
                <option value="es-ES es Spanish">Spanish</option>
                <option value="fr-FR fr French">French</option>
                <option value="de-DE de German">German</option>
                <option value="it-IT it Italian">Italian</option>
                <option value="pt-BR pt Portuguese">Portuguese</option>
                <option value="pl-PL pl Polish">Polish</option>
                <option value="tr-TR tr Turkish">Turkish</option>
                <option value="ru-RU ru Russian">Russian</option>
                <option value="nl-NL nl Dutch">Dutch</option>
                <option value="zh-CN zh Chinese">Chinese</option>
                <option value="ko-KR ko Korean">Korean</option>
                <option value="ja-JP ja Japanese">Japanese</option>
              </select>
            </label>
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    );
  }

  if (!userData) {
    return <div className="container mt-5">Loading user data...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-3">Welcome, {userData.name}!</h1>
      <p className="fw-light">Your language: {userData.language[2]}</p>
    </div>
  );
}
