export default function ChatHistory({ conversation }) {
  return (
    <div className="h-[90vh] overflow-y-auto p-4">
      {conversation.slice(1).map((item, index) => (
        <div key={index} className="mb-3">
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <p>
                <strong>{item.role}:</strong> {item.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
