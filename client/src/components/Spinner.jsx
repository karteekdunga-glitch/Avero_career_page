export function Spinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }
  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} border-4 border-t-[var(--brand)] border-opacity-20 rounded-full animate-spin`} />
    </div>
  )
}