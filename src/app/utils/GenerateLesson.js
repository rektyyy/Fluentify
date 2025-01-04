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
    const prompt = `You are generating words for lesson in ${language}. Name of this lesson is ${lessonName} and user desrription: ${description}. Please provide a list of words in English and their translations in ${language}.`;

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.1",
        messages: [{ role: "user", content: prompt }],
        stream: false,
        format: zodToJsonSchema(LessonWords),
      }),
    });

    const data = await response.json();
    const lessonWords = LessonWords.parse(JSON.parse(data.message.content));
    return lessonWords;
  } catch (error) {
    console.error("Error generating lesson words:", error);
    throw error;
  }
}
