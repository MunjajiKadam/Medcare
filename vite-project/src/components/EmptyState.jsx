export default function EmptyState({ 
  icon = "📭", 
  title = "No data found", 
  description = "", 
  actionLabel = "", 
  onAction = null,
  className = ""
}) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 p-8 sm:p-12 text-center border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="text-6xl sm:text-7xl mb-4" role="img" aria-label={title}>
        {icon}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base max-w-md mx-auto">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 sm:px-8 py-2.5 sm:py-3 bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 text-white rounded-lg transition font-semibold text-sm sm:text-base active:scale-95 shadow-md"
          aria-label={actionLabel}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
