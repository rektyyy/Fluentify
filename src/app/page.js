"use client";

import { useContext, useState } from "react";
import UserContext from "./components/UserContext";

export default function Home() {
  const { userData, setUserData, userNotFound, setUserNotFound } =
    useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

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
              body: JSON.stringify({ name, email }),
            });
            if (res.ok) {
              setUserData({ name: name, email: email });
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
              Email:
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
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
      <p className="fw-light">Your email: {userData.email}</p>
    </div>
  );
}
