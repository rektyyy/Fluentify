import React from "react";

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

const LessonActions = ({
  handleAddLesson,
  handleDeleteNode,
  handleModifyLesson,
  selectedNode,
  handleViewLesson,
}) => (
  <div className="flex items-center justify-between pr-4 pl-4 bg-base-200 rounded-lg shadow-md">
    {/* Left Side: Selected Node Information */}
    <div className="flex items-center ">
      <div>
        <p className="text-base-content font-semibold">
          {selectedNode !== null ? selectedNode.name : ""}
        </p>
        <p className="text-sm text-base-content">
          {truncateText(
            selectedNode !== null ? selectedNode.attributes.description : "",
            60
          )}
        </p>
      </div>
    </div>
    {/* Right Side: Action Buttons */}
    <div className="flex items-center space-x-2 m-3">
      <button
        onClick={handleViewLesson}
        className={
          selectedNode === null
            ? "btn btn-success space-x-2 btn-disabled"
            : "btn btn-success space-x-2"
        }
      >
        Let's Learn!
      </button>
      <button
        onClick={handleAddLesson}
        className={
          selectedNode === null
            ? "btn btn-primary space-x-2 btn-disabled"
            : "btn btn-primary space-x-2"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>Add Lesson</span>
      </button>
      <>
        <button
          onClick={() => handleModifyLesson(selectedNode)}
          className={
            selectedNode === null
              ? "btn btn-warning space-x-2 btn-disabled"
              : "btn btn-warning space-x-2"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536M9 19l-5 1 1-5 11-11 3.536 3.536-11 11z"
            />
          </svg>
          <span>Modify Lesson</span>
        </button>

        <button
          onClick={() => handleDeleteNode(selectedNode)}
          className={
            selectedNode === null
              ? "btn btn-error space-x-2 btn-disabled"
              : "btn btn-error space-x-2"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span>Delete Lesson</span>
        </button>
      </>
    </div>
  </div>
);

export default LessonActions;
