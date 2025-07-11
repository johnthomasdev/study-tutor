import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const apiService = {
  uploadPDFs: async (sessionId, files) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await api.post(`/upload-pdfs/${sessionId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data
  },

  askQuestion: async (sessionId, question) => {
    const response = await api.post(`/ask/${sessionId}`, {
      question: question.trim()
    })
    
    return response.data
  },

  getSessionInfo: async (sessionId) => {
    const response = await api.get(`/session/${sessionId}`)
    return response.data
  },



  generateSession: async () => {
    const response = await api.get('/generate-session')
    return response.data
  },

  healthCheck: async () => {
    const response = await api.get('/health')
    return response.data
  },
}

export default apiService 