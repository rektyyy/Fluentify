"use client";

import { useState } from "react";
import { sendMessage } from "../utils/GenerateBotResponse";
const BotComponent = () => {
  const [inputText, setInputText] = useState("");
  const [botResponse, setBotResponse] = useState("");

  // Funkcja do obsługi przesłania tekstu
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBotResponse("Loading..."); // Ustawia wiadomość, gdy oczekujemy na odpowiedź bota

    try {
      const response = await sendMessage(inputText);
      setBotResponse(response); // Ustawia odpowiedź bota
    } catch (error) {
      console.error("Error generating response:", error);
      setBotResponse("Error generating response.");
    }
  };

  return (
    <div>
      <h1>Chatbot</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your message"
        />
        <button type="submit">Send</button>
      </form>
      <div>
        <h2>Bot Response:</h2>
        <p>{botResponse}</p>
      </div>
    </div>
  );
};

export default BotComponent;
