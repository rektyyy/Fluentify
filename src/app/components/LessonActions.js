const LessonActions = ({
  setIsEditing,
  handleAddLesson,
  handleDeleteNode,
  handleModifyLesson,
}) => (
  <div>
    <button
      onClick={() => {
        handleAddLesson();
        setIsEditing(false);
      }}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Add Lesson
    </button>
    <button
      onClick={handleDeleteNode}
      className="px-4 py-2 bg-red-500 text-white rounded mt-2"
    >
      Delete Lesson
    </button>
    <button
      onClick={handleModifyLesson}
      className="px-4 py-2 bg-yellow-500 text-white rounded mt-2"
    >
      Modify Lesson
    </button>
  </div>
);

export default LessonActions;
