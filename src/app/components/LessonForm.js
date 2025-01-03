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
}) {
  const inputInfo = (
    <button
      className="btn btn-sm btn-ghost text-base-content"
      onClick={() => document.getElementById("my_modal_2").showModal()}
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
  return (
    <div className="flex justify-center mt-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-6 bg-base-200 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-base-content ">
          {isEditing ? "Edit Lesson" : "Add New Lesson"}
        </h2>

        <label className="label">
          <span className="label-text text-base-content">Lesson Name:</span>
        </label>
        <input
          type="text"
          value={lessonName}
          onChange={(e) => setLessonName(e.target.value)}
          className="input input-bordered w-full text-base-content"
          required
        />

        <label className="label">
          <span className="label-text text-base-content">
            Lesson Description:
          </span>
        </label>
        <textarea
          value={lessonDescription}
          onChange={(e) => setLessonDescription(e.target.value)}
          className="textarea textarea-bordered w-full text-base-content"
          rows="4"
          placeholder="Enter lesson description..."
        ></textarea>

        <label className="label">
          <span className="label-text text-base-content">Lesson Type:</span>
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
          <option value="2">Select Correct Word</option>
          <option value="3">Fill Sentence</option>
          <option value="4">Write Sentence</option>
        </select>

        <label className="label flex justify-between">
          <span className="label-text text-base-content">English Word:</span>
          {inputInfo}
        </label>
        <input
          type="text"
          value={englishWord}
          onChange={(e) => setEnglishWord(e.target.value)}
          className="input input-bordered w-full text-base-content"
          required
        />

        <label className="label flex justify-between">
          <span className="label-text text-base-content">
            Other Language Word:
          </span>
          {inputInfo}
        </label>
        <input
          type="text"
          value={otherLanguageWord}
          onChange={(e) => setOtherLanguageWord(e.target.value)}
          className="input input-bordered w-full text-base-content"
          required
        />

        <div className="flex space-x-4 mt-4">
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
      <dialog id="my_modal_2" className="modal bg-base-100 text-base-content">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">How to input words?</h3>
          <p className="py-4"></p>
          <p className="py-4">
            To input words correctly, you need to separate each word with a
            comma. Example:
            <span className="font-bold"> word1, word2, word3</span>
          </p>
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
  );
}
