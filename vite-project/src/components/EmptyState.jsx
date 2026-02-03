export default function EmptyState({ 
  icon = "📭", 
  title = "No data found", 
  description = "", 
  actionLabel = "", 
  onAction = null,
  className = ""
}) {
  return (
    <div className={`bg-white rounded-lg shadow p-8 sm:p-12 text-center ${className}`}>
      <div className="text-6xl sm:text-7xl mb-4" role="img" aria-label={title}>
        {icon}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-dark mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 mb-6 text-sm sm:text-base max-w-md mx-auto">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 sm:px-8 py-2.5 sm:py-3 bg-accent text-white rounded-lg hover:opacity-90 transition font-semibold text-sm sm:text-base active:scale-95"
          aria-label={actionLabel}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
