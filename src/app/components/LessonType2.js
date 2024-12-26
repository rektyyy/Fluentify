import { useState, useEffect, useMemo } from "react";

export default function LessonType2({ lessonData }) {
  const englishWordArray = useMemo(
    () => lessonData.attributes.words.map((word) => word.en),
    [lessonData]
  );
  const otherWordArray = useMemo(
    () => lessonData.attributes.words.map((word) => word.other),
    [lessonData]
  );

  const [randomLang, setRandomLang] = useState(() =>
    Math.random() < 0.5 ? "other" : "en"
  );
  const [targetIndex, setTargetIndex] = useState(() =>
    Math.floor(Math.random() * englishWordArray.length)
  );

  const targetWord =
    randomLang === "en"
      ? englishWordArray[targetIndex]
      : otherWordArray[targetIndex];

  const targetTranslation =
    randomLang === "en"
      ? otherWordArray[targetIndex]
      : englishWordArray[targetIndex];

  const [randomWords, setRandomWords] = useState([]);
  const [feedback, setFeedback] = useState("");

  function generateRandomWords(chosenLang, chosenIndex) {
    const correctWord =
      chosenLang === "en"
        ? englishWordArray[chosenIndex]
        : otherWordArray[chosenIndex];

    // Build a list of all indexes except the correct one
    let availableIndexes = [...Array(englishWordArray.length).keys()].filter(
      (i) => i !== chosenIndex
    );

    // Pick 3 unique random indexes
    const wrongWords = [];
    for (let i = 0; i < 3; i++) {
      const randIdx = Math.floor(Math.random() * availableIndexes.length);
      const pickedIndex = availableIndexes[randIdx];
      availableIndexes.splice(randIdx, 1);
      wrongWords.push(
        chosenLang === "en"
          ? englishWordArray[pickedIndex]
          : otherWordArray[pickedIndex]
      );
    }

    const tempWords = [correctWord, ...wrongWords];
    return tempWords.sort(() => Math.random() - 0.5);
  }
  useEffect(() => {
    setRandomWords(generateRandomWords(randomLang, targetIndex));
  }, [lessonData, randomLang, targetIndex]);

  function handleClick(word) {
    setFeedback(word === targetWord ? "Correct!" : "Incorrect. Try again.");
  }

  function handleNext() {
    setFeedback("");
    const newLang = Math.random() < 0.5 ? "en" : "other";
    const newIndex = Math.floor(Math.random() * englishWordArray.length);
    setRandomLang(newLang);
    setTargetIndex(newIndex);
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-2">Translate this word:</h3>
      <p className="mb-4 text-center text-xl">{targetTranslation}</p>
      <div className="flex flex-wrap gap-3 justify-center mb-4">
        {randomWords.map((word, index) => (
          <button
            key={index}
            onClick={() => handleClick(word)}
            className="px-4 py-2 rounded"
          >
            {word}
          </button>
        ))}
      </div>
      {feedback && <p className="text-center font-bold mb-2">{feedback}</p>}
      {feedback === "Correct!" && (
        <button
          onClick={handleNext}
          className="block mx-auto px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      )}
    </div>
  );
}
