"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ChatHistory from "../components/ChatHistory";

const SpeechToText = dynamic(() => import("../components/SpeechRecognition"), {
  ssr: false,
});

export default function Page() {
  const systemPrompt = [
    {
      role: "system",
      content: "You are a large language model known as OpenChat, ...",
    },
  ];

  const [conversation, setConversation] = useState([...systemPrompt]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Chat area fills available space */}
      <ChatHistory conversation={conversation} />
      {/* Speech input stays at bottom */}
      <SpeechToText
        setConversation={setConversation}
        conversation={conversation}
      />
    </div>
  );
}
