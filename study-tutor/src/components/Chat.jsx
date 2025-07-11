import { useState, useRef, useEffect } from 'react'
import { MessageSquare, ArrowRight, Loader2 } from 'lucide-react'

const Chat = ({ 
  question, 
  setQuestion, 
  onSubmit, 
  isAsking, 
  conversations = [],
  isVisible = true
}) => {
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversations])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (question.trim() && !isAsking) {
        onSubmit()
      }
    }
  }

  const handleSubmit = () => {
    if (question.trim() && !isAsking) {
      onSubmit()
    }
  }

  const handleTextareaChange = (e) => {
    setQuestion(e.target.value)
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
    }
  }



  const deduplicateSources = (sources) => {
    if (!sources || !Array.isArray(sources)) return []
    return [...new Set(sources)]
  }

  if (!isVisible) return null

  return (
    <div 
      className="border rounded-xl shadow-xl flex flex-col overflow-hidden"
      style={{ 
        backgroundColor: 'var(--color-bg-secondary)',
        borderColor: 'var(--color-border-primary)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        height: '600px',
        minHeight: '600px',
        maxHeight: '600px'
      }}
    >
      <div 
        className="px-8 py-6 border-b flex-shrink-0"
        style={{ 
          borderColor: 'var(--color-border-primary)',
          background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3" style={{ color: 'var(--color-text-primary)' }}>
            <MessageSquare size={26} style={{ color: 'var(--color-accent-green)' }} />
            <h2 className="m-0 font-bold text-xl tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
              Chat with Documents
            </h2>
          </div>
        </div>
      </div>
      
      <div 
        className="flex-1 p-8 overflow-y-auto flex flex-col gap-8 custom-scrollbar smooth-scroll"
        style={{ 
          backgroundColor: 'var(--color-bg-primary)',
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '20px 20px',
          minHeight: 0
        }}
      >
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center gap-6" style={{ color: 'var(--color-text-secondary)' }}>
            <div 
              className="p-6 rounded-full"
              style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
            >
              <MessageSquare style={{ color: 'var(--color-accent-green)' }} size={56} />
            </div>
            <div className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Start a conversation
            </div>
            <div className="text-sm max-w-md px-4" style={{ color: 'var(--color-text-tertiary)' }}>
              Ask any question about your uploaded documents. Each question is answered independently based on the document content.
            </div>
          </div>
        ) : (
          conversations.map((conv, index) => (
            <div key={index} className="flex flex-col gap-6">
              <div className="flex w-full justify-end px-2">
                <div 
                  className="max-w-[80%] md:max-w-[85%] sm:max-w-[90%] py-5 px-8 rounded-2xl rounded-tr-md shadow-lg transform transition-all duration-300 hover:shadow-xl"
                  style={{ 
                    backgroundColor: 'var(--color-accent-green)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                    {conv.question}
                  </div>
                </div>
              </div>
              
              {conv.answer && (
                <div className="flex w-full justify-start px-2">
                  <div 
                    className="max-w-[80%] md:max-w-[85%] sm:max-w-[90%] py-5 px-8 rounded-2xl rounded-tl-md shadow-lg border-l-4 transform transition-all duration-300 hover:shadow-xl"
                    style={{ 
                      backgroundColor: 'var(--color-bg-secondary)',
                      color: 'var(--color-text-primary)',
                      borderColor: 'var(--color-border-primary)',
                      borderLeftColor: 'var(--color-accent-green)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap mb-2">
                      {conv.answer}
                    </div>
                    
                    {conv.sources && conv.sources.length > 0 && (
                      <div 
                        className="mt-5 pt-5 border-t"
                        style={{ borderColor: 'var(--color-border-primary)' }}
                      >
                        <h4 
                          className="text-xs mb-4 font-bold uppercase tracking-wider"
                          style={{ color: 'var(--color-accent-green)' }}
                        >
                          Sources:
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {deduplicateSources(conv.sources).map((source, sourceIndex) => (
                            <span 
                              key={sourceIndex} 
                              className="py-2 px-4 rounded-full text-xs font-semibold border shadow-sm transition-all duration-200 hover:shadow-md"
                              style={{ 
                                backgroundColor: 'var(--color-bg-primary)',
                                color: 'var(--color-accent-green)',
                                borderColor: 'var(--color-accent-green)',
                                boxShadow: '0 2px 4px rgba(16, 185, 129, 0.1)'
                              }}
                            >
                              {source}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        
        {isAsking && question && (
          <div className="flex w-full justify-end px-2">
            <div 
              className="max-w-[80%] md:max-w-[85%] sm:max-w-[90%] py-5 px-8 rounded-2xl rounded-tr-md shadow-lg animate-pulse"
              style={{ 
                backgroundColor: 'var(--color-accent-green)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
            >
              <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                {question}
              </div>
            </div>
          </div>
        )}
        
        {isAsking && (
          <div className="flex w-full justify-start px-2">
            <div 
              className="py-5 px-8 rounded-2xl rounded-tl-md shadow-lg border-l-4 flex items-center gap-3"
              style={{ 
                backgroundColor: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border-primary)',
                borderLeftColor: 'var(--color-accent-green)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Loader2 className="animate-spin" size={18} style={{ color: 'var(--color-accent-green)' }} />
              <div className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                Thinking...
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div 
        className="px-12 py-10 border-t flex-shrink-0"
        style={{ 
          borderColor: 'var(--color-border-primary)',
          backgroundColor: 'var(--color-bg-secondary)'
        }}
      >
        <div className="flex items-center gap-6">
          <div className="flex-1 flex justify-center px-4">
            <textarea
              ref={textareaRef}
              value={question}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your documents..."
              className="w-full max-w-lg py-6 px-10 border rounded-2xl text-sm font-medium resize-none max-h-32 min-h-[72px] transition-all duration-300 focus:outline-none shadow-lg leading-relaxed placeholder-opacity-70"
              style={{ 
                borderColor: 'var(--color-border-primary)',
                backgroundColor: 'var(--color-bg-primary)',
                color: 'var(--color-text-primary)',
                lineHeight: '1.6',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-accent-green)'
                e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border-primary)'
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
              rows={1}
              disabled={isAsking}
            />
          </div>
          <button 
            onClick={handleSubmit}
            disabled={isAsking || !question.trim()}
            className="flex-shrink-0 p-4 rounded-xl font-medium text-sm cursor-pointer transition-all duration-300 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            style={{ 
              backgroundColor: isAsking || !question.trim() ? 'var(--color-text-tertiary)' : 'var(--color-accent-green)',
              width: '52px',
              height: '52px',
              boxShadow: isAsking || !question.trim() ? '0 2px 4px rgba(0, 0, 0, 0.1)' : '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!isAsking && question.trim()) {
                e.target.style.backgroundColor = 'var(--color-accent-success-hover)'
                e.target.style.transform = 'scale(1.05)'
                e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isAsking && question.trim()) {
                e.target.style.backgroundColor = 'var(--color-accent-green)'
                e.target.style.transform = 'scale(1)'
                e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)'
              }
            }}
          >
            {isAsking ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <ArrowRight size={20} />
            )}
          </button>
        </div>
        
        <div className="mt-6 text-xs text-center" style={{ color: 'var(--color-text-tertiary)' }}>
          <span className="opacity-80">Press </span>
          <kbd className="px-2 py-1 bg-gray-700 rounded text-xs font-mono">Enter</kbd>
          <span className="opacity-80"> to send • </span>
          <kbd className="px-2 py-1 bg-gray-700 rounded text-xs font-mono">Shift+Enter</kbd>
          <span className="opacity-80"> for new line</span>
        </div>
      </div>
    </div>
  )
}

export default Chat 