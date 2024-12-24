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
    <form onSubmit={handleSubmit} className="mt-4">
      <label className="block mb-2">
        Lesson name:
        <input
          type="text"
          value={lessonName}
          onChange={(e) => setLessonName(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </label>
      <label className="block mb-2">
        Lesson description:
        <textarea
          value={lessonDescription}
          onChange={(e) => setLessonDescription(e.target.value)}
          className="border p-2 w-full"
        />
      </label>
      <label className="block mb-2">
        Lesson type:
        <select
          value={lessonType}
          onChange={(e) => setLessonType(e.target.value)}
          className="border p-2 w-full"
          required
        >
          <option value="1">Translation</option>
          <option value="2">Select correct word</option>
          <option value="3">Fill sentence</option>
          <option value="4">Write sentence</option>
        </select>
      </label>
      <label className="block mb-2">
        English Word:
        <input
          type="text"
          value={englishWord}
          onChange={(e) => setEnglishWord(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </label>
      <label className="block mb-2">
        Other language word:
        <input
          type="text"
          value={otherLanguageWord}
          onChange={(e) => setOtherLanguageWord(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </label>
      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded mt-2"
      >
        {isEditing ? "Save changes" : "Add lesson"}
      </button>
      <button
        type="button"
        onClick={handleCancelChanges}
        className="px-4 py-2 bg-gray-500 text-white rounded mt-2 ml-2"
      >
        Cancel changes
      </button>
    </form>
  );
}
