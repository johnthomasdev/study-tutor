import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import apiService from '../utils/api'

export const useRAG = () => {
  const [sessionId, setSessionId] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [question, setQuestion] = useState('')
  const [conversations, setConversations] = useState([])
  const [isAsking, setIsAsking] = useState(false)
  const [error, setError] = useState('')
  const [sessionInfo, setSessionInfo] = useState(null)

  useEffect(() => {
    const newSessionId = uuidv4()
    setSessionId(newSessionId)
  }, [])

  const handleFilesSelected = useCallback((files) => {
    setUploadedFiles(files)
    setUploadSuccess(false)
    setError('')
  }, [])

  const handleUpload = useCallback(async () => {
    if (!uploadedFiles.length || !sessionId) return

    setIsUploading(true)
    setError('')

    try {
      const response = await apiService.uploadPDFs(sessionId, uploadedFiles)
      setUploadSuccess(true)
      setSessionInfo(response)
      setConversations([])
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload PDFs')
    } finally {
      setIsUploading(false)
    }
  }, [uploadedFiles, sessionId])

  const handleAskQuestion = useCallback(async () => {
    if (!question.trim() || !sessionId) return

    const currentQuestion = question.trim()
    setIsAsking(true)
    setError('')
    setQuestion('')

    try {
      const response = await apiService.askQuestion(sessionId, currentQuestion)
      
      setConversations(prev => [...prev, {
        question: currentQuestion,
        answer: response.answer,
        sources: response.sources,
        timestamp: new Date()
      }])
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get answer')
      setQuestion(currentQuestion)
    } finally {
      setIsAsking(false)
    }
  }, [question, sessionId])

  const handleClearMemory = useCallback(async () => {
    if (!sessionId) return

    try {
      await apiService.clearMemory(sessionId)
      setConversations([])
      setError('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to clear memory')
    }
  }, [sessionId])

  const handleSetError = useCallback((errorMessage) => {
    setError(errorMessage)
  }, [])

  return {
    sessionId,
    uploadedFiles,
    isUploading,
    uploadSuccess,
    question,
    conversations,
    isAsking,
    error,
    sessionInfo,
    
    handleFilesSelected,
    handleUpload,
    handleAskQuestion,
    handleClearMemory,
    handleSetError,
    setQuestion,
  }
}

export default useRAG 