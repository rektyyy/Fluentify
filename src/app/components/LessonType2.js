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
    <div className="p-4 max-w-md mx-auto bg-slate-100 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Translate this word:
      </h3>
      <p className="mb-6 text-center text-2xl font-bold text-indigo-600">
        {targetTranslation}
      </p>
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        {randomWords.map((word, index) => (
          <button
            key={index}
            onClick={() => handleClick(word)}
            className="px-6 py-3 rounded-lg bg-white hover:bg-indigo-50 border border-gray-200 
                     shadow-sm transition-colors duration-200 text-gray-700 hover:text-indigo-600"
          >
            {word}
          </button>
        ))}
      </div>
      {feedback && (
        <p
          className={`text-center font-bold mb-4 text-lg ${
            feedback === "Correct!" ? "text-green-600" : "text-red-600"
          }`}
        >
          {feedback}
        </p>
      )}
      {feedback === "Correct!" && (
        <button
          onClick={handleNext}
          className="block mx-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 
                   text-white rounded-lg transition-colors duration-200 
                   shadow-md hover:shadow-lg"
        >
          Next
        </button>
      )}
    </div>
  );
}
