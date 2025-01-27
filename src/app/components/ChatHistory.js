import { useEffect, useRef } from "react";

export default function ChatHistory({ conversation }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom whenever the conversation changes
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  return (
    <div className="flex-1 min-h-0 overflow-auto p-4">
      {conversation.slice(2).map((item, index) => {
        const isUser = item.role === "user";
        return (
          <div
            key={index}
            className={`mb-3 flex items-start ${
              isUser ? "justify-start" : "justify-end"
            }`}
          >
            {/* Left icon for user */}
            {isUser && (
              <div className="mr-2 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3"
                  />
                  <circle cx="12" cy="10" r="3" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
            )}

            <div className="card bg-base-200 shadow-md w-auto max-w-xl">
              <div className="card-body p-3 text-base-content">
                <p>{item.content}</p>
              </div>
            </div>

            {/* Right icon for assistant */}
            {!isUser && (
              <div className="ml-2 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3"
                  />
                  <circle cx="12" cy="10" r="3" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
      {/* Dummy div to scroll into view */}
      <div ref={bottomRef} />
    </div>
  );
}
