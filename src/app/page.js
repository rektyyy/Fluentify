"use client";

import { useContext, useState } from "react";
import UserContext from "./components/UserContext";

export default function Home() {
  const { userData, setUserData, userNotFound, setUserNotFound } =
    useContext(UserContext);
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("");
  const [creating, setCreating] = useState(false);

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
  // Display simple home page if no user
  if (userNotFound && !creating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-4">
        <div className="card w-full max-w-lg bg-base-100 shadow-xl">
          <div className="card-body text-base-content">
            <h2 className="card-title text-2xl mb-4">Welcome to Fluentify</h2>
            <p className="mb-4">
              This is a language learning platform using AI to help you achive
              your language goals. Please create an account to continue.
            </p>
            <button
              onClick={() => setCreating(true)}
              className="btn btn-primary"
            >
              Get started
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (userNotFound && creating) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-base-200">
        <form
          onSubmit={handleSubmit}
          className="bg-base-100 p-6 rounded shadow-md max-w-md w-full space-y-4"
        >
          <h2 className="text-2xl font-bold text-base-content">
            Create your profile
          </h2>

          {/* Name field */}
          <div>
            <label className="label">
              <span className="label-text text-base-content">Name:</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full text-base-content"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Language select */}
          <div>
            <label className="label">
              <span className="label-text text-base-content">Language:</span>
            </label>
            <select
              className="select select-bordered w-full text-base-content"
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
          </div>

          {/* Submit button */}
          <button type="submit" className="btn btn-primary w-full">
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-2 text-base-content">
            Welcome, {userData.name}!
          </h2>
          <p className="text-base-content/70">
            Your language: {userData.language[2]}
          </p>

          {userData.allLessons === 0 ? (
            <div className="alert alert-warning bg-warning/20 text-warning-content shadow-lg">
              <span>Please add a lesson to start learning</span>
            </div>
          ) : (
            <div>
              <progress
                className="progress progress-primary w-full bg-base-200"
                value={userData.finished}
                max={userData.allLessons}
              ></progress>
              <p className="text-sm text-base-content/50 mt-2">
                {userData.finished} / {userData.allLessons} lessons completed
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
