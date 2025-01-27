import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const LessonWords = z.object({
  words: z.array(
    z.object({
      en: z.string(),
      other: z.string(),
    })
  ),
});

export default async function generateLessonWords(
  lessonName,
  description,
  language
) {
  try {
    const prompt = `You are a master in ${language}. Generate words for this lesson: name "${lessonName}" and description "${description}". Please provide a list of words in English and their translations in ${language}. Return as JSON object with words array containing objects with en and other properties. For example: { "words": [ { "en": "hello", "other": "hola" }, { "en": "goodbye", "other": "adios" } ] }. If you don't follow this format, I will fail the lesson.`;

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.1",
        messages: [{ role: "user", content: prompt }],
        stream: false,
        format: zodToJsonSchema(LessonWords),
        temperature: 0,
      }),
    });

    const data = await response.json();
    console.log("Raw response data:", data); // Log the raw response data
    const lessonWords = LessonWords.parse(JSON.parse(data.message.content));
    console.log("Parsed lesson words:", lessonWords); // Log the parsed lesson words
    return lessonWords;
  } catch (error) {
    console.error("Error generating lesson words:", error);
    throw error;
  }
}
