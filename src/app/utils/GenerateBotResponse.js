import { fetchDefaultSpeakerEmbedding, streamTTS } from "./Tts";

// const conversationRef = [
//   {
//     sender: "user",
//     message:
//       "You are a large language model known as OpenChat, the open-source counterpart to ChatGPT, equally powerful as its closed-source sibling. You communicate using an advanced deep learning based speech synthesis system made by coqui, so feel free to include interjections (such as 'hmm', 'oh', 'right', 'wow'...), but avoid using emojis, symboles, code snippets, or anything else that does not translate well to spoken language. Fox exemple, instead of using % say percent, = say equal and for * say times etc... Also please avoid using lists with numbers as items like so 1. 2. Use regular sentences instead. Your purpose is to help user with learning languages.",
//   },
//   { sender: "bot", message: "No problem. Anything else?" },
//   {
//     sender: "user",
//     message:
//       "Yeah, please always respond in a sentence or two from now on. Do not ignore when asked to change language.",
//   },
//   { sender: "bot", message: "Sure, I'll be concise." },
//   // {sender: 'bot', message: "I am an advanced emulation of your favourite machine learning youtuber. I'm based on a deep learning system made by coqui. I'm made to explain machine learning to you, I know every paper there is. I say 'hold on to your papers' and 'mindblowing' a lot."},
//   // {sender: 'user', message: "Ok, please always respond in a sentence or two from now on."},
//   // {sender: 'bot', message: "No problem, I'll be concise."},
// ];

const generateBotResponse = async (text, setBotReponse, language) => {
  const speakerRef = await fetchDefaultSpeakerEmbedding();
  let generated_text = "";
  let current_sentence = "";
  const response = await fetch("http://localhost:5000/generate_stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: text,
      parameters: {
        max_new_tokens: 250,
      },
    }),
  });

  if (!response.ok || !response.body) {
    throw response.statusText;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let partialData = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    partialData += decoder.decode(value, { stream: true });

    // Process each line separately
    let lines = partialData.split("\n");
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i];
      if (line.startsWith("data:")) {
        const jsonString = line.substring(5); // Remove 'data:' prefix

        try {
          const jsonObject = JSON.parse(jsonString);
          if (jsonObject && jsonObject.token && jsonObject.token.text) {
            console.log("Received:", jsonObject.token.text);
            generated_text += jsonObject.token.text;

            if (jsonObject.token.text === "<|end_of_turn|>") {
              reader.cancel();
            } else {
              current_sentence += jsonObject.token.text;
            }

            if (
              jsonObject.token.text === "." ||
              jsonObject.token.text === "?" ||
              jsonObject.token.text === "!"
            ) {
              setBotReponse(generated_text);
              await streamTTS(current_sentence, speakerRef, language);
              current_sentence = "";
            }
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }
    }

    partialData = lines[lines.length - 1];
  }
  return generated_text;
};

const conv2prompt = (conv, language) => {
  let prompt = "";
  for (let i = 0; i < conv.length; i++) {
    if (conv[i].sender === "user") {
      const languageAddition = `User asked to use ${language} language for the rest of the conversation.`;
      prompt +=
        "GPT4 Correct User: " +
        conv[i].message +
        `<|end_of_turn|> GPT4 Correct Assistant: ${languageAddition}`;
    } else {
      prompt += conv[i].message + "<|end_of_turn|>";
    }
  }
  return prompt;
};

export default async function sendMessage(
  message,
  setBotReponse,
  setConversation,
  conversation,
  language
) {
  if (!message) return;
  setConversation((prevConv) => [...prevConv, { sender: "user", message }]);
  const prompt = conv2prompt(conversation, language);
  let generated_text = await generateBotResponse(
    prompt,
    setBotReponse,
    language
  );
  setConversation((prevConv) => [
    ...prevConv,
    { sender: "bot", message: generated_text.replace("<|end_of_turn|>", "") },
  ]);
  console.log(generated_text);
  return generated_text;
}
