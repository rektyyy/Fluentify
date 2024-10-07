"use client";

import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useState, useEffect } from "react";
import sendMessage from "../utils/GenerateBotResponse";
export default function SpeechToText({ language }) {
  const {
    transcript,
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [botResponse, setBotResponse] = useState();

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser doesn't support speech recognition.</span>;
  }
  useEffect(() => {
    async function getMessage(transcript) {
      console.log("SENDING MESSAGE: " + transcript);
      const message = await sendMessage(transcript);
      console.log(message);
      setBotResponse(message);
    }
    if (finalTranscript) {
      getMessage(finalTranscript).catch(console.error);
    }
  }, [finalTranscript]);

  return (
    <div>
      <div>Microphone: {listening ? "on" : "off"}</div>
      <button onClick={() => SpeechRecognition.startListening({ language })}>
        Start
      </button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <div>Transcript: {transcript}</div>
      <div>Response: {botResponse}</div>
    </div>
  );
}
