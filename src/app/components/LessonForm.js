import generateLessonWords from "../utils/GenerateLesson";
import { useState } from "react";
export default function LessonForm({
  lessonName,
  lessonDescription,
  lessonType,
  englishWord,
  otherLanguageWord,
  setLessonName,
  setLessonDescription,
  setLessonType,
  setEnglishWord,
  setOtherLanguageWord,
  handleSubmit,
  handleCancelChanges,
  isEditing,
  language,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const InfoButton = ({ modalId }) => (
    <button
      type="button"
      className="btn btn-ghost btn-circle"
      onClick={() => document.getElementById(modalId).showModal()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
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
  );

  async function handleGenerateWords(language) {
    try {
      setIsLoading(true);
      const lessonWords = await generateLessonWords(
        lessonName,
        lessonDescription,
        language
      );
      const englishWords = lessonWords.words.map((word) => word.en).join(",");
      const otherWords = lessonWords.words.map((word) => word.other).join(",");
      setEnglishWord(englishWords);
      setOtherLanguageWord(otherWords);
      console.log("Generated Lesson Words:", lessonWords);
    } catch (error) {
      console.error("Error generating words:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center mt-8 w-1/3 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full  p-8 bg-base-200 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-base-content ">
          {isEditing ? "Edit Lesson" : "Add New Lesson"}
        </h2>

        <label className="label">
          <span className="label-text text-base-content">Lesson name:</span>
        </label>
        <input
          type="text"
          value={lessonName}
          onChange={(e) => setLessonName(e.target.value)}
          className="input input-bordered w-full text-base-content"
          placeholder="Enter lesson name..."
          required
        />

        <label className="label">
          <span className="label-text text-base-content">
            Lesson description:
          </span>
        </label>
        <textarea
          value={lessonDescription}
          onChange={(e) => setLessonDescription(e.target.value)}
          className="textarea textarea-bordered w-full text-base-content"
          rows="4"
          placeholder="Enter lesson description..."
          required
        ></textarea>

        <label className="label">
          <span className="label-text text-base-content">Lesson type:</span>
        </label>
        <select
          value={lessonType}
          onChange={(e) => setLessonType(e.target.value)}
          className="select select-bordered w-full text-base-content"
          required
        >
          <option disabled value="">
            Select lesson type
          </option>
          <option value="1">Translation</option>
          <option value="2">Match the meaning</option>
        </select>

        <div className="flex gap-2 items-center mt-4">
          <button
            type="button"
            className="btn btn-primary flex-1"
            onClick={handleGenerateWords}
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Words"}
          </button>

          <InfoButton modalId="generate_info_modal" />
        </div>
        <div className="form-group">
          <label className="label cursor-text justify-between items-center">
            <span className="label-text text-base-content pointer-events-none">
              English words:
            </span>
            <div className="flex-none">
              <InfoButton modalId="english_words_modal" />
            </div>
          </label>
          <input
            type="text"
            value={englishWord}
            onChange={(e) => setEnglishWord(e.target.value)}
            className="input input-bordered w-full text-base-content"
            required
          />
        </div>

        <label className="label">
          <span className="label-text text-base-content">
            Other language words:
          </span>
          <InfoButton modalId="other_words_modal" />
        </label>
        <input
          type="text"
          value={otherLanguageWord}
          onChange={(e) => setOtherLanguageWord(e.target.value)}
          className="input input-bordered w-full text-base-content mb-4"
          required
        />

        <div className="flex space-x-4">
          <button type="submit" className="btn btn-success flex-1">
            {isEditing ? "Save Changes" : "Add Lesson"}
          </button>
          <button
            type="button"
            onClick={handleCancelChanges}
            className="btn btn-error flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
      <dialog id="generate_info_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">About word generation</h3>
          <p className="py-4">
            This feature uses AI to automatically generate word pairs based on
            your lesson name and description. The AI will create relevant
            vocabulary pairs in English and your target language.
            <br />
            For best results:
          </p>

          <ul className="list-disc list-inside">
            <li>Provide a clear lesson name</li>
            <li>Add a detailed description</li>
            <li>Check generated words for accuracy</li>
          </ul>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="english_words_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">English words</h3>
          <p className="py-4">
            Enter English words separated by commas. These will be used as the
            source words for translation. <br />
            <strong>Example: word1,word2,word3</strong>
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="other_words_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Other language words</h3>
          <p className="py-4">
            Enter translated words separated by commas. These should match the
            order of English words entered above. <br />
            <strong>Example: word1,word2,word3</strong>
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
