"use client";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Welcome to Our Website</h1>
        <p className="text-lg mb-4">
          This is the home page of our application. Start customizing it based
          on your needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-3">Section One</h2>
            <p>Add your content here.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-3">Section Two</h2>
            <p>Add your content here.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
