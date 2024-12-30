"use client";

import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useState, useEffect } from "react";
import sendMessage from "../utils/GenerateBotResponse";
import SelectLanguage from "./SelectLanguage";

export default function SpeechToText({ setConversation, conversation }) {
  const {
    transcript,
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [botResponse, setBotResponse] = useState();
  const [language, setLanguage] = useState(["en-US", "en"]);
  const [input, setInput] = useState("");
  const [changedLanguage, setChangedLanguage] = useState(false);

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser doesn&apos;t support speech recognition.</span>;
  }
  useEffect(() => {
    if (finalTranscript) {
      setInput(finalTranscript);
      handleSend(finalTranscript);
    }
  }, [finalTranscript]);

  useEffect(() => {
    if (changedLanguage) {
      setConversation((prevConversation) => [
        ...prevConversation,
        {
          role: "user",
          content: `Change the language to ${language[1]}.`,
        },
        {
          role: "assistant",
          content: `Sure.`,
        },
      ]);
      setChangedLanguage(false);
    }
  }, [changedLanguage]);

  const handleSend = async (message) => {
    if (!message) return;
    console.log("SENDING MESSAGE: " + message);
    try {
      const response = await sendMessage(
        message,
        setBotResponse,
        setConversation,
        conversation,
        language[1]
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
    }
  };

  return (
    <div>
      <SelectLanguage
        setLanguage={setLanguage}
        setChangedLanguage={setChangedLanguage}
      />
      <div>Transcript: {transcript}</div>
      <div>Response: {botResponse}</div>
      <div className="flex gap-2 items-center mt-4">
        {/* Replace FormControl with a DaisyUI input */}
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Type or say something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {/* Replace Bootstrap Button with DaisyUI button */}
        <button className="btn btn-primary" onClick={() => handleSend(input)}>
          Send
        </button>
      </div>
      {/* You can similarly style other elements with DaisyUI classes */}
    </div>
  );
}
