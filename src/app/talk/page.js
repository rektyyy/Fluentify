"use client";

import { useState, useContext, useEffect } from "react";
import dynamic from "next/dynamic";
import ChatHistory from "../components/ChatHistory";
import UserContext from "../components/UserContext";
import CreateAssistant from "../components/CreateAssistant";

const SpeechToText = dynamic(() => import("../components/SpeechRecognition"), {
  ssr: false,
});

export default function Page() {
  const { userData, setUserData } = useContext(UserContext);
  const [conversation, setConversation] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [usedWords, setUsedWords] = useState(new Set());
  const [showCongrats, setShowCongrats] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    // Check localStorage for lesson data
    const lesson = localStorage.getItem("lesson");
    if (lesson) {
      setLesson(JSON.parse(lesson));
    }
  }, []);

  useEffect(() => {
    if (userData) {
      const systemPrompt = [
        {
          role: "system",
          content: `You are a large language model known as ${
            userData.assistantName
          }, designed to assist users in learning languages. You are a master in language teachin. Please respond to the user's queries only in ${
            userData.language[0]
          }. If you will not comply with language requirement user will fail lesson. Address user as ${
            userData.name
          }. Your goal is to help the user learn the language. Try not to use numbers or symbols in your responses. If you notice user spelling mistake you can correct it. User describes your behavior as "${
            userData.prompt
          }". ${
            lesson
              ? `This lesson name is: ${lesson.name} and description: "${
                  lesson.attributes.description
                }". Here are the words from lesson to practice with: ${lesson.attributes.words
                  .map((w) => `${w.other}`)
                  .join(", ")}.`
              : ""
          } Good luck!`,
        },
      ];
      setConversation(systemPrompt);
    }
  }, [userData, lesson]);

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const checkWordsInSentence = (lesson, message) => {
    if (!lesson) return;
    const newUsedWords = new Set(usedWords);
    lesson.attributes.words.forEach((word) => {
      if (message.toLowerCase().includes(word.other.toLowerCase())) {
        newUsedWords.add(word.other);
      }
    });
    setUsedWords(newUsedWords);

    if (newUsedWords.size === lesson.attributes.words.length) {
      setShowCongrats(true);
      setTimeout(() => {
        dropLesson();
        setShowCongrats(false);
      }, 10000);
    }
  };

  const dropLesson = () => {
    localStorage.removeItem("lesson");
    setLesson(null);
    setUsedWords(new Set());
  };
  if (showCreate || userData.assistantName === undefined) {
    return (
      <CreateAssistant
        setShowCreate={setShowCreate}
        userData={userData}
        setUserData={setUserData}
      />
    );
  }
  return (
    <div className="flex flex-col h-screen">
      {showCongrats && (
        <div className="alert alert-success shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Congratulations! You've successfully used all the words!
            </span>
          </div>
        </div>
      )}
      {lesson && !showCongrats && (
        <div className="bg-base-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Lesson words:</h3>
            <button onClick={dropLesson} className="btn btn-error btn-sm gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Drop Lesson
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {lesson.attributes.words.map((word, index) => (
              <div
                key={index}
                className={`badge ${
                  usedWords.has(word.other) ? "badge-success" : "badge-primary"
                }`}
              >
                {word.en} - {word.other}
              </div>
            ))}
          </div>
        </div>
      )}
      <ChatHistory conversation={conversation} />
      <SpeechToText
        setConversation={setConversation}
        conversation={conversation}
        language={userData.language}
        onMessage={(message) => checkWordsInSentence(lesson, message)}
        speakerRef={userData.speakerRef}
        setShowCreate={setShowCreate}
      />
    </div>
  );
}
