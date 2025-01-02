"use client";

import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useState, useEffect, useContext } from "react";
import UserContext from "./UserContext";
import sendMessage from "../utils/GenerateBotResponse";

export default function SpeechToText({ setConversation, conversation }) {
  const {
    transcript,
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const { userData } = useContext(UserContext);
  const [botResponse, setBotResponse] = useState();
  const [input, setInput] = useState("");

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser doesn&apos;t support speech recognition.</span>;
  }
  useEffect(() => {
    if (finalTranscript) {
      setInput(finalTranscript);
      handleSend(finalTranscript);
    }
  }, [finalTranscript]);

  const handleSend = async (message) => {
    if (!message) return;
    console.log("SENDING MESSAGE: " + message);
    try {
      const response = await sendMessage(
        message,
        setBotResponse,
        setConversation,
        conversation,
        userData.language[1]
      );
      console.log(response);
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setInput("");
    resetTranscript();
  };

  const handleListening = () => {
    if (!listening) {
      SpeechRecognition.startListening({ language: userData.language[0] });
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
    <div>
      <div className="flex gap-2 items-center mt-4">
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
          Send
        </button>
      </div>
    </div>
  );
}
