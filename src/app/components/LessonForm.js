export default function LessonForm1({
  lessonName,
  lessonDescription,
  englishWord,
  otherLanguageWord,
  setLessonName,
  setLessonDescription,
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
