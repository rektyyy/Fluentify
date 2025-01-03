import { useState } from "react";

export default function LessonType1({ lessonData, onBack, finishLesson }) {
  const [userInputs, setUserInputs] = useState({});
  const [answersFeedback, setAnswersFeedback] = useState({});
  const [isAllCorrect, setIsAllCorrect] = useState(null);

  const [hiddenFields] = useState(() => {
    let lastType = null;
    return lessonData.attributes.words.map(() => {
      let newType;
      do {
        newType = Math.random() < 0.5 ? "other" : "en";
      } while (newType === lastType);
      lastType = newType;
      return newType;
    });
  });

  const handleWin = () => {
    finishLesson();
    onBack();
  };

  const handleChange = (e, index) => {
    setUserInputs({
      ...userInputs,
      [index]: e.target.value,
    });
  };

  const checkAnswers = () => {
    let allCorrect = true;
    const feedback = {};

    lessonData.attributes.words.forEach((word, index) => {
      const userAnswer = userInputs[index]?.trim().toLowerCase() || "";
      const correctAnswer =
        hiddenFields[index] === "other"
          ? word.other.toLowerCase()
          : word.en.toLowerCase();
      const isCorrect = userAnswer === correctAnswer;
      feedback[index] = isCorrect;
      if (!isCorrect) {
        allCorrect = false;
      }
    });
    setAnswersFeedback(feedback);
    setIsAllCorrect(allCorrect);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-base-100">
      <div className="card bg-base-100 shadow-xl p-8 max-w-2xl w-full">
        <div className="prose max-w-none mb-8">
          <h2 className="text-center">Fill in the missing words</h2>
          <p className="text-center text-base-content/70">
            Complete the sentences by filling in the blanks
          </p>
        </div>

        <div className="space-y-6 max-h-96 overflow-y-auto">
          {lessonData.attributes.words.map((word, index) => (
            <div key={index} className="flex items-center gap-3 text-lg">
              <span className="font-medium min-w-[100px]">
                {hiddenFields[index] === "other" ? word.en : word.other}
              </span>
              <div className="flex-1 max-w-xs">
                <input
                  type="text"
                  className={`input input-bordered w-full ${
                    answersFeedback[index] === false
                      ? "input-error"
                      : answersFeedback[index] === true
                      ? "input-success"
                      : ""
                  }`}
                  value={userInputs[index] || ""}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="Type answer here..."
                />
              </div>
              {answersFeedback[index] === false && (
                <div className="badge badge-error gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-4 h-4 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              )}
              {answersFeedback[index] === true && (
                <div className="badge badge-success gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-4 h-4 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="divider my-8"></div>

        <div className="card-actions justify-end mt-6 space-x-2">
          <button onClick={onBack} className="btn btn-ghost">
            Back
          </button>
          <button onClick={checkAnswers} className="btn btn-primary">
            Check Answers
          </button>
        </div>
      </div>

      {/* Alert appears below the card */}
      {isAllCorrect === true && (
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
              Great job! You've completed this lesson!
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
