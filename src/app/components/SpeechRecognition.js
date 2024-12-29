"use client";

import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useState, useEffect } from "react";
import { Button, InputGroup, FormControl } from "react-bootstrap";
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
      <InputGroup className="mb-3 mt-auto p-4">
        <FormControl
          placeholder="Type your message..."
          value={transcript ? transcript : input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <Button
          variant={listening ? "danger" : "primary"}
          onClick={handleListening}
        >
          {listening ? "Stop" : "Voice"}
        </Button>
        <Button variant="success" onClick={() => handleSend(input)}>
          Send
        </Button>
      </InputGroup>
    </div>
  );
}
