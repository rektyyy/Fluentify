"use client";

import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useState, useEffect } from "react";
import sendMessage from "../utils/GenerateBotResponse";

export default function SpeechToText({
  setConversation,
  conversation,
  language,
  onMessage,
  setShowCreate,
  speakerRef,
}) {
  const {
    transcript,
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [input, setInput] = useState("");
  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="alert alert-warning shadow-lg max-w-md">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <h3 className="font-bold">Browser Compatibility Issue</h3>
            <p className="text-sm">
              Speech recognition is not supported in your browser. Please try
              using Chrome or Edge for the best experience.
            </p>
          </div>
        </div>
      </div>
    );
  }
  useEffect(() => {
    if (finalTranscript) {
      handleSend(finalTranscript);
      resetTranscript();
    } else {
      setInput(transcript);
    }
  }, [finalTranscript, transcript]);

  async function handleSend(message) {
    if (!message) return;
    onMessage(message);
    try {
      const response = await sendMessage(
        message,
        setConversation,
        conversation,
        language[1],
        speakerRef
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setInput("");
    resetTranscript();
  }

  const handleListening = () => {
    if (!listening) {
      SpeechRecognition.startListening({ language: language[0] });
    } else {
      SpeechRecognition.stopListening();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSend(input);
      setInput("");
    }
  };

  return (
    <div className="flex-none p-4 bg-base-200 overflow-hidden">
      <div className="flex gap-2 items-center">
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3"
            />
            <circle cx="12" cy="10" r="3" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </button>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Type or say something..."
          value={input}
          onChange={(e) => handleInputChange(e)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn btn-primary" onClick={handleListening}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2c-1.7 0-3 1.2-3 2.6v6.8c0 1.4 1.3 2.6 3 2.6s3-1.2 3-2.6V4.6C15 3.2 13.7 2 12 2z" />
            <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18.4v3.3M8 22h8" />
          </svg>
        </button>
        <button className="btn btn-primary" onClick={() => handleSend(input)}>
          <svg
            className="w-6 h-6 transform rotate-90"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M12 2a1 1 0 0 1 .932.638l7 18a1 1 0 0 1-1.326 1.281L13 19.517V13a1 1 0 1 0-2 0v6.517l-5.606 2.402a1 1 0 0 1-1.326-1.281l7-18A1 1 0 0 1 12 2Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
