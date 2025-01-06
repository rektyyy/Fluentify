"use client";

import { useState, useEffect } from "react";

export default function CreateAssistant({
  setShowCreate,
  userData,
  setUserData,
}) {
  const [speakers, setSpeakers] = useState({});
  const [selectedSpeaker, setSelectedSpeaker] = useState("");
  const [name, setName] = useState("");
  const [testText, setTestText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [characterPrompt, setCharacterPrompt] = useState("");
  useEffect(() => {
    async function fetchSpeakers() {
      try {
        const response = await fetch("/api/speakers");
        if (!response.ok) throw new Error("Failed to fetch speakers");
        const data = await response.json();
        setSpeakers(data);
      } catch (error) {
        setError("Failed to load speakers");
      }
    }
    fetchSpeakers();
  }, []);

  const handleTest = async () => {
    if (!selectedSpeaker || !testText) return;

    setIsLoading(true);
    try {
      const speaker = speakers[selectedSpeaker];
      const response = await fetch("/api/ttsStream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: testText,
          language: userData.language[1],
          speaker_embedding: speaker.speaker_embedding,
          gpt_cond_latent: speaker.gpt_cond_latent,
          add_wav_header: true,
          stream_chunk_size: "512",
        }),
      });

      if (!response.ok) throw new Error("TTS failed");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      setError("Failed to test speaker");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedSpeaker || !name || !characterPrompt) {
      setError("Please fill in all required fields");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/userData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userData,
          assistantName: name,
          prompt: characterPrompt,
          speakerRef: speakers[selectedSpeaker],
        }),
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.message || "Failed to save assistant");
      }
      setUserData({
        ...userData,
        assistantName: name,
        prompt: characterPrompt,
        speakerRef: speakers[selectedSpeaker],
      });
      setShowCreate(false);
    } catch (err) {
      setError(err.message || "Failed to save assistant");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 mt-4 max-w-2xl mx-auto bg-base-200 rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Create your assistant
      </h2>

      {error && (
        <div className="alert alert-error mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Voice Selection */}
        <div className="card bg-base-100">
          <div className="card-body">
            <h3 className="card-title text-xl mb-4 text-base-content">
              Voice selection
            </h3>
            <div className="form-control bg-base-100 border-none">
              <label className="label">
                <span className="label-text font-medium">
                  Select speaker voice
                </span>
              </label>
              <select
                className="select select-bordered w-full text-base-content focus:outline-none focus:ring-0"
                value={selectedSpeaker}
                onChange={(e) => setSelectedSpeaker(e.target.value)}
                required
              >
                <option value="">Choose a voice</option>
                {Object.keys(speakers).map((speaker) => (
                  <option key={speaker} value={speaker}>
                    {speaker}
                  </option>
                ))}
              </select>
              <label className="label">
                <span className="label-text-alt">
                  Selected voice will be used for all conversations
                </span>
              </label>
              <label className="label">
                <span className="label-text font-medium">
                  Test the selected voice
                </span>
              </label>
              <div className="join">
                <input
                  type="text"
                  placeholder="Enter text to test the voice..."
                  className="input input-bordered join-item w-full text-base-content focus:outline-none"
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                />
                <button
                  className={`btn btn-primary join-item ${
                    isLoading ? "loading" : ""
                  }`}
                  onClick={handleTest}
                  disabled={!selectedSpeaker || !testText || isLoading}
                >
                  Test
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Character Prompt */}
        <div className="card bg-base-100">
          <div className="card-body">
            <h3 className="card-title text-xl mb-4 text-base-content">
              Character
            </h3>
            <div className="form-control bg-base-100 border-none">
              <label className="label">
                <span className="label-text font-medium">
                  Define assistant&apos;s name
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full text-base-content"
                placeholder="Example: Mike"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label className="label">
                <span className="label-text font-medium">
                  Define assistant&apos;s personality
                </span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24 text-base-content focus:outline-none focus:ring-0"
                placeholder="Example: You are a helpful and friendly assistant who speaks in a casual, conversational tone..."
                value={characterPrompt}
                onChange={(e) => setCharacterPrompt(e.target.value)}
                required
              />
              <label className="label">
                <span className="label-text-alt ">
                  This will define how your assistant communicates
                </span>
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() =>
                    setCharacterPrompt("Friendly and casual teacher")
                  }
                >
                  Teacher
                </button>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() =>
                    setCharacterPrompt("Professional language tutor")
                  }
                >
                  Tutor
                </button>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() =>
                    setCharacterPrompt("Encouraging conversation partner")
                  }
                >
                  Partner
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button
            className="btn btn-ghost"
            onClick={() => setShowCreate(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-success"
            onClick={handleSave}
            disabled={!selectedSpeaker || !characterPrompt}
          >
            Save assistant
          </button>
        </div>
      </div>
    </div>
  );
}
