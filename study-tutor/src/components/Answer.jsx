import { FileText } from 'lucide-react'

const Answer = ({ answer, sources, question, isVisible = true }) => {
  if (!isVisible || !answer) return null

  return (
    <div className="answer-section">
      <div className="section-header">
        <FileText size={24} />
        <h3>Conversation</h3>
      </div>
      
      <div className="chat-container">
        <div className="chat-message question">
          <div className="message-bubble question">
            <div className="message-content">
              {question}
            </div>
          </div>
        </div>
        
        <div className="chat-message answer">
          <div className="message-bubble answer">
            <div className="message-content">
              {answer}
            </div>
            
            {sources && sources.length > 0 && (
              <div className="message-sources">
                <h4>Sources:</h4>
                <div className="message-source-list">
                  {sources.map((source, index) => (
                    <span key={index} className="message-source-tag">
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Answer 