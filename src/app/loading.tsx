export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="h-16 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 animate-pulse" />
      <div className="py-16 px-6 max-w-6xl mx-auto">
        <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-lg w-1/3 mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden"
            >
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/4 animate-pulse" />
                <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
