import { useState, useEffect, useMemo, useCallback } from "react";

export default function LessonType2({ lessonData, onBack, finishLesson }) {
  const [randomWords, setRandomWords] = useState([]);
  const [solvedCount, setSolvedCount] = useState(0);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [selectedGuess, setSelectedGuess] = useState(null);
  const englishWordArray = useMemo(
    () => lessonData.attributes.words.map((word) => word.en),
    [lessonData]
  );

  const otherWordArray = useMemo(
    () => lessonData.attributes.words.map((word) => word.other),
    [lessonData]
  );

  // Pick a random language for the target word
  const [randomLang, setRandomLang] = useState(() =>
    Math.random() < 0.5 ? "other" : "en"
  );

  // Pick a random index for the target word
  const [targetIndex, setTargetIndex] = useState(() =>
    Math.floor(Math.random() * englishWordArray.length)
  );

  // Identify the target word and its translation
  const targetWord =
    randomLang === "en"
      ? englishWordArray[targetIndex]
      : otherWordArray[targetIndex];

  const targetTranslation =
    randomLang === "en"
      ? otherWordArray[targetIndex]
      : englishWordArray[targetIndex];

  // Generate random answer choices
  const generateRandomWords = useCallback(() => {
    const wordsSource = randomLang === "en" ? otherWordArray : englishWordArray;
    const correctWord =
      randomLang === "en"
        ? otherWordArray[targetIndex]
        : englishWordArray[targetIndex];

    // Take random unique words from the source array
    const shuffled = [...wordsSource]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    // Ensure correct word is included
    if (!shuffled.includes(correctWord)) {
      shuffled.pop();
      shuffled.push(correctWord);
    }

    // Shuffle final array
    shuffled.sort(() => 0.5 - Math.random());
    setRandomWords(shuffled);
  }, [englishWordArray, otherWordArray, targetIndex, randomLang]);

  // On component mount / target changes, generate new random words
  useEffect(() => {
    if (englishWordArray.length > 0 && !lessonCompleted) {
      generateRandomWords();
    }
  }, [englishWordArray.length, generateRandomWords, lessonCompleted]);

  // Guess handler
  const handleGuess = (word) => {
    setSelectedGuess(word);
    const isCorrect = word === targetTranslation;
    if (isCorrect) {
      setSolvedCount((prev) => prev + 1);
    }
  };

  // Handle next attempt or finish
  const handleNext = () => {
    if (solvedCount >= lessonData.attributes.words.length) {
      setLessonCompleted(true);
      return;
    }
    // Reset for new round
    setSelectedGuess(null);
    setRandomLang(Math.random() < 0.5 ? "other" : "en");
    setTargetIndex(Math.floor(Math.random() * englishWordArray.length));
  };

  const handleWin = () => {
    finishLesson();
    localStorage.setItem("lesson", JSON.stringify(lessonData));
    window.location.href = "/talk";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-base-100">
      <div className="card w-full max-w-xl shadow-xl bg-base-200">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h2 className="card-title text-center mb-2 text-base-content">
              Match the meaning
            </h2>
            <button
              className="btn btn-ghost text-base-content"
              onClick={() => document.getElementById("my_modal_2").showModal()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </button>

            <dialog
              id="my_modal_2"
              className="modal bg-base-100 text-base-content"
            >
              <form method="dialog" className="modal-box">
                <h3 className="font-bold text-lg">Match the meaning</h3>
                <p className="py-4"></p>
                This lesson helps you practice matching words between English
                and another language. You will be presented with a word in one
                language, and you need to select the correct translation from a
                list of options. Each correct answer will be counted, and you
                will receive feedback on your choice. The lesson is completed
                once you have correctly guessed the amount of the words in the
                lesson in a row.
                <div className="modal-action">
                  <button className="btn btn-primary">Close</button>
                </div>
              </form>
              <form
                method="dialog"
                className="modal-backdrop bg-base-300 bg-opacity-50"
              >
                <button>close</button>
              </form>
            </dialog>
          </div>
          {/* Target word */}
          <div className="text-center text-2xl font-bold text-primary mb-4">
            {targetWord}
          </div>
          {/* Answer choices */}
          <div className="flex flex-col gap-2 items-center">
            {randomWords.map((word, idx) => (
              <button
                key={idx}
                onClick={() => handleGuess(word)}
                className={`btn w-full md:w-2/3 text-base-content btn-ghost ${
                  selectedGuess === word
                    ? word === targetTranslation
                      ? "outline outline-2 outline-success"
                      : "outline outline-2 outline-error"
                    : ""
                }`}
                disabled={selectedGuess !== null}
              >
                {word}
              </button>
            ))}
          </div>
          {/* Actions */}
          <div className="divider my-4"></div>
          <div className="card-actions items-center w-full">
            <div className="ml-auto space-x-3">
              <button
                onClick={onBack}
                className="btn btn-ghost"
                disabled={lessonCompleted}
              >
                Back
              </button>
              {!lessonCompleted && (
                <button onClick={handleNext} className="btn btn-primary">
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {lessonCompleted && (
        <div className="mt-6 w-full max-w-xl">
          <div className="alert alert-success flex justify-between items-center p-4 rounded-lg shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
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
            <span className="text-lg font-semibold">
              Great job! You&apos;ve completed this lesson!
            </span>
            <button onClick={handleWin} className="btn btn-sm btn-success">
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
