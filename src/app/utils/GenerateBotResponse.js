import { fetchDefaultSpeakerEmbedding, streamTTS } from "./Tts";

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
        //stop: ["<|eot_id|>"],
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

            if (jsonObject.token.text === "<|eot_id|>") {
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

const conv2prompt = (conv, language, systemMessage) => {
  const systemPrompt = `You are a friendly and helpful language teaching assistant that communicates in ${language}. You help users learn new languages by engaging in conversation, correcting their mistakes, and providing explanations and examples in the target language. Try to avoid lists, code snippets, or anything that doesn't translate well to spoken language. Your goal is to help users learn new languages in a fun and engaging way.`;
  systemMessage = systemPrompt;
  let prompt = "<|begin_of_text|>\n";

  prompt += "<|start_header_id|>system<|end_header_id|>\n\n";

  prompt += `${systemMessage}<|eot_id|>\n`;

  for (let i = 0; i < conv.length; i++) {
    const sender = conv[i].sender;
    prompt += `<|start_header_id|>${sender}<|end_header_id|>\n\n`;
    prompt += `${conv[i].message}<|eot_id|>\n`;
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
  console.log(prompt);
  let generated_text = await generateBotResponse(
    prompt,
    setBotReponse,
    language
  );
  setConversation((prevConv) => [
    ...prevConv,
    { sender: "assistant", message: generated_text },
  ]);
  return generated_text;
}
