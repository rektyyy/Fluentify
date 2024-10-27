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

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser doesn't support speech recognition.</span>;
  }
  useEffect(() => {
    async function getMessage(transcript) {
      console.log("SENDING MESSAGE: " + transcript);
      const message = await sendMessage(
        transcript,
        setBotResponse,
        setConversation,
        conversation,
        language[1]
      );
      console.log(message);
      //setBotResponse(message);
    }
    if (finalTranscript) {
      getMessage(finalTranscript).catch(console.error);
    }
  }, [finalTranscript]);

  return (
    <div>
      <SelectLanguage setLanguage={setLanguage} />
      <div>Microphone: {listening ? "on" : "off"}</div>
      <button
        onClick={() =>
          SpeechRecognition.startListening({ language: language[0] })
        }
      >
        Start
      </button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <div>Transcript: {transcript}</div>
      <div>Response: {botResponse}</div>
    </div>
  );
}
