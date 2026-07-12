export default function CourseLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gray-900 dark:bg-gray-950 py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="h-4 bg-gray-800 rounded w-20 animate-pulse" />
            <div className="h-10 bg-gray-800 rounded w-3/4 animate-pulse" />
            <div className="h-20 bg-gray-800 rounded w-full animate-pulse" />
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl h-64 animate-pulse" />
        </div>
      </div>
      <div className="max-w-5xl mx-auto py-16 px-6 space-y-4">
        <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded w-48 animate-pulse" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
