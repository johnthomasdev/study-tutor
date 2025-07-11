import { Header, ErrorAlert, FileUpload, Chat } from './components'
import { useRAG } from './hooks/useRAG'
import './App.css'

function App() {
  const {
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
    handleSetError,
    setQuestion,
  } = useRAG()

  return (
    <div className="min-h-screen w-screen flex flex-col p-4 md:p-2 box-border">
      <div className="w-full flex flex-col gap-6 mx-auto relative flex-1" style={{ maxWidth: '1600px' }}>
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <ErrorAlert message={error} />
            <Header />
          </div>
        </div>
        
        <div className="flex justify-center flex-1">
          <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0 w-full max-w-6xl">
            <div className="flex-1 min-w-0 flex justify-center">
              <div className="w-full max-w-lg">
                <FileUpload
                  uploadedFiles={uploadedFiles}
                  onFilesSelected={handleFilesSelected}
                  onUpload={handleUpload}
                  isUploading={isUploading}
                  uploadSuccess={uploadSuccess}
                  sessionInfo={sessionInfo}
                  onError={handleSetError}
                />
              </div>
            </div>

            <div className="flex-1 min-w-0 flex justify-center">
              <div className="w-full max-w-2xl flex flex-col min-h-[500px] lg:min-h-0">
                <Chat
                  question={question}
                  setQuestion={setQuestion}
                  onSubmit={handleAskQuestion}
                  isAsking={isAsking}
                  conversations={conversations}
                  isVisible={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
