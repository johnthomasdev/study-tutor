import { AlertCircle } from 'lucide-react'

const ErrorAlert = ({ message }) => {
  if (!message) return null

  return (
    <div 
      className="flex items-center gap-3 py-3.5 px-4 rounded-md mb-4 font-medium animate-slide-in w-full border"
      style={{ 
        backgroundColor: 'var(--color-accent-error-bg)',
        color: 'var(--color-accent-error)',
        borderColor: 'var(--color-accent-error-border)'
      }}
    >
      <AlertCircle size={20} />
      <span>{message}</span>
    </div>
  )
}

export default ErrorAlert 