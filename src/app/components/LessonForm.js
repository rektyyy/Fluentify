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
  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-base-content dark:text-base-300">
          {isEditing ? "Edit Lesson" : "Add New Lesson"}
        </h2>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-base-content dark:text-base-300">
              Lesson Name:
            </span>
          </label>
          <input
            type="text"
            value={lessonName}
            onChange={(e) => setLessonName(e.target.value)}
            className="input input-bordered w-full bg-base-100 dark:bg-gray-700 text-base-content dark:text-base-300"
            required
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-base-content dark:text-base-300">
              Lesson Description:
            </span>
          </label>
          <textarea
            value={lessonDescription}
            onChange={(e) => setLessonDescription(e.target.value)}
            className="textarea textarea-bordered w-full bg-base-100 dark:bg-gray-700 text-base-content dark:text-base-300"
            rows="4"
            placeholder="Enter lesson description..."
          ></textarea>
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-base-content dark:text-base-300">
              Lesson Type:
            </span>
          </label>
          <select
            value={lessonType}
            onChange={(e) => setLessonType(e.target.value)}
            className="select select-bordered w-full bg-base-100 dark:bg-gray-700 text-base-content dark:text-base-300"
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
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-base-content dark:text-base-300">
              English Word:
            </span>
          </label>
          <input
            type="text"
            value={englishWord}
            onChange={(e) => setEnglishWord(e.target.value)}
            className="input input-bordered w-full bg-base-100 dark:bg-gray-700 text-base-content dark:text-base-300"
            required
          />
        </div>

        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text text-base-content dark:text-base-300">
              Other Language Word:
            </span>
          </label>
          <input
            type="text"
            value={otherLanguageWord}
            onChange={(e) => setOtherLanguageWord(e.target.value)}
            className="input input-bordered w-full bg-base-100 dark:bg-gray-700 text-base-content dark:text-base-300"
            required
          />
        </div>

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
    </div>
  );
}
