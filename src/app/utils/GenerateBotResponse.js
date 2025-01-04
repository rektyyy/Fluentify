import { fetchDefaultSpeakerEmbedding, streamTTS } from "./Tts";

async function generateBotResponse(messages, setConversation, language) {
  console.log(messages);
  const speakerRef = await fetchDefaultSpeakerEmbedding();
  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3.1", // Replace with your model name
      messages: messages, // Messages should be an array of message objects
      stream: true, // Enable streaming
    }),
  });

  if (!response.ok) {
    console.error("Error fetching bot response:", response.statusText);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let generated_text = "";
  let current_sentence = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.trim()) {
        try {
          const jsonObject = JSON.parse(line.trim());

          if (jsonObject.done) {
            break;
          }

          if (jsonObject.message && jsonObject.message.content) {
            const token = jsonObject.message.content;

            current_sentence += token;
            generated_text += token;
            setConversation((prevConv) => {
              if (
                prevConv.length > 0 &&
                prevConv[prevConv.length - 1].role === "assistant"
              ) {
                return [
                  ...prevConv.slice(0, -1),
                  { role: "assistant", content: generated_text },
                ];
              } else {
                return [
                  ...prevConv,
                  { role: "assistant", content: generated_text },
                ];
              }
            });

            if (token === "." || token === "?" || token === "!") {
              await streamTTS(current_sentence, speakerRef, language);
              current_sentence = "";
            }
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }
    }
  }

  return generated_text;
}

export default async function sendMessage(
  message,
  setConversation,
  conversation,
  language
) {
  if (!message) return;
  setConversation((prevConv) => [
    ...prevConv,
    { role: "user", content: message },
  ]);

  let generated_text = await generateBotResponse(
    [...conversation, { role: "user", content: message }],
    setConversation,
    language
  );

  return generated_text;
}
