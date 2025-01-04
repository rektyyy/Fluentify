"use client";

import { useState, useContext, useEffect } from "react";
import dynamic from "next/dynamic";
import ChatHistory from "../components/ChatHistory";
import UserContext from "../components/UserContext";

const SpeechToText = dynamic(() => import("../components/SpeechRecognition"), {
  ssr: false,
});

export default function Page() {
  const { userData } = useContext(UserContext);
  const [conversation, setConversation] = useState([]);

  useEffect(() => {
    if (userData) {
      const systemPrompt = [
        {
          role: "system",
          content: `You are a large language model known as Llama, designed to assist users in learning languages. Please respond to the user's queries only in ${userData.language[0]}. If you will not comply with language requirement user will fail lesson. Address user as ${userData.name}. Your goal is to help the user learn the language. Try not to use numbers or symbols in your responses. If you notice user spelling mistake you can correct it. Good luck!`,
        },
      ];
      setConversation(systemPrompt);
    }
  }, [userData]);

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <ChatHistory conversation={conversation} />
      <SpeechToText
        setConversation={setConversation}
        conversation={conversation}
      />
    </div>
  );
}
