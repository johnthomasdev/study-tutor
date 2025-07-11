import { Brain } from 'lucide-react'

const Header = () => {
  return (
    <div className="py-6 mb-4 md:py-4">
      <div className="flex justify-center items-center">
        <div className="flex items-center gap-4 md:flex-col md:gap-2 md:text-center">
          <Brain className="text-shadow-green flex-shrink-0" style={{ color: 'var(--color-accent-green)' }} size={40} />
          <div className="text-left md:text-center">
            <h1 className="text-5xl font-bold m-0 leading-tight md:text-4xl sm:text-3xl" style={{ color: 'var(--color-text-primary)' }}>
              Study Tutor
            </h1>
            <p className="text-lg mt-2 m-0 leading-relaxed md:text-base sm:text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Upload your PDFs and get instant answers powered by AI
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header 