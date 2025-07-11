import { MessageSquare, BookOpen, Loader2 } from 'lucide-react'

const QuestionForm = ({ 
  question, 
  setQuestion, 
  onSubmit, 
  isAsking, 
  isVisible = true 
}) => {
  if (!isVisible) return null

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (question.trim() && !isAsking) {
        onSubmit()
      }
    }
  }

  return (
    <div className="section">
      <div className="section-header">
        <MessageSquare size={24} />
        <h2>Ask Questions</h2>
      </div>
      
      <div className="question-form">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask any question about your uploaded documents... (Press Enter to submit, Shift+Enter for new line)"
          className="question-input"
          rows={3}
        />
        <button 
          onClick={onSubmit}
          disabled={isAsking || !question.trim()}
          className="btn btn-primary"
        >
          {isAsking ? (
            <>
              <Loader2 className="spin" size={20} />
              Thinking...
            </>
          ) : (
            <>
              <BookOpen size={20} />
              Get Answer
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default QuestionForm 