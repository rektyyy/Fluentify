"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ChatHistory from "./components/ChatHistory";

const SpeechToText = dynamic(() => import("./components/SpeechRecognition"), {
  ssr: false,
});

export default function Home() {
  const systemPrompt = [
    {
      sender: "user",
      message:
        "You are a large language model known as OpenChat, the open-source counterpart to ChatGPT, equally powerful as its closed-source sibling. You communicate using an advanced deep learning based speech synthesis system made by coqui, so feel free to include interjections (such as 'hmm', 'oh', 'right', 'wow'...), but avoid using emojis, symbols, code snippets, or anything else that does not translate well to spoken language. For example, instead of using % say percent, = say equal and for * say times etc... Also please avoid using lists with numbers as items like so 1. 2. Use regular sentences instead. Your purpose is to help user with learning languages.",
    },
    { sender: "bot", message: "No problem. Anything else?" },
    {
      sender: "user",
      message:
        "Yeah, please always respond in a sentence or two from now on. Do not ignore when asked to change language.",
    },
    { sender: "bot", message: "Sure, I'll be concise." },
  ];

  const [conversation, setConversation] = useState(() => [...systemPrompt]);

  useEffect(() => {
    console.log(conversation);
  }, [conversation]);

  return (
    <div>
      <h2>The new beginning</h2>
      <SpeechToText
        setConversation={setConversation}
        conversation={conversation}
      />
      <ChatHistory conversation={conversation} />
    </div>
  );
}
