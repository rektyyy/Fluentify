import { useState } from "react";

export default function LessonType2({ lessonData }) {
  const englishWordArray = lessonData.attributes.words.map((word) => word.en);
  const otherWordArray = lessonData.attributes.words.map((word) => word.other);
  const randomLang = Math.random() < 0.5 ? "other" : "en";
  const randomWords = [];
  let randomOtherWord = "";
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * englishWordArray.length);
    randomWords.push(
      randomLang === "en"
        ? englishWordArray[randomIndex]
        : otherWordArray[randomIndex]
    );
    if (i === 0) {
      randomOtherWord = otherWordArray[randomIndex];
    }
  }
  const [feedback, setFeedback] = useState("");

  const [selectedWords, setSelectedWords] = useState([]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-2">Translate this word:</h3>
      <p className="mb-4 text-center text-xl">
        {randomLang === "en" ? randomOtherWord : randomWords[0]}
      </p>
      <div className="flex flex-wrap gap-3 justify-center mb-4">
        {randomWords.map((word, index) => {
          const isSelected = selectedWords.includes(word);
          return (
            <button
              key={index}
              onClick={() => {
                const correctWord =
                  randomLang === "en"
                    ? englishWordArray[otherWordArray.indexOf(randomOtherWord)]
                    : otherWordArray[englishWordArray.indexOf(randomWords[0])];
                if (word === correctWord) {
                  setFeedback("Correct!");
                  setSelectedWords([]);
                } else {
                  setFeedback("Try again!");
                  setSelectedWords([...selectedWords, word]);
                }
              }}
              className={`px-4 py-2 ${
                isSelected
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white rounded`}
              disabled={isSelected}
            >
              {word}
            </button>
          );
        })}
      </div>
      {feedback && <p className="text-center font-bold">{feedback}</p>}
    </div>
  );
}
