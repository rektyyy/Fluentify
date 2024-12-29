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

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/userData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        language: language,
        finished: 0,
        allLessons: 0,
      }),
    });
    if (res.ok) {
      setUserData({
        name: name,
        language: language,
        finished: 0,
        allLessons: 0,
      });
      setUserNotFound(false);
    }
  }

  if (userNotFound) {
    return (
      <div className="container mt-5">
        <h1 className="text-danger mb-4">User not found</h1>
        <form className="bg-light p-4 rounded" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">
              Name:
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="mb-3">
            <label className="form-label">
              Language:
              <select
                className="form-select"
                onChange={handleLanguageChange}
                required
              >
                <option value="">Select your language</option>
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
      <p className="fw-light">Lessons finished: {userData.finished}</p>
      {userData.allLessons === 0 ? (
        <p className="text-warning">Please add a lesson to start learning</p>
      ) : (
        <progress
          className="progress w-56"
          value={userData.finished}
          max={userData.allLessons}
        ></progress>
      )}
    </div>
  );
}
