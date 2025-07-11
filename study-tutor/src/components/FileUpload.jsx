import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, CheckCircle, Loader2, Sparkles } from 'lucide-react'

const FileUpload = ({ 
  uploadedFiles, 
  onFilesSelected, 
  onUpload, 
  isUploading, 
  uploadSuccess, 
  sessionInfo,
  onError 
}) => {
  const onDrop = useCallback((acceptedFiles) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf')
    if (pdfFiles.length !== acceptedFiles.length) {
      onError('Please only upload PDF files')
      return
    }
    onFilesSelected(pdfFiles)
  }, [onFilesSelected, onError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  })

  const getDropzoneStyles = () => {
    const baseStyles = {
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--color-border-primary)',
      transition: 'all 0.3s ease',
    }

    if (uploadSuccess) {
      return {
        ...baseStyles,
        borderColor: 'var(--color-accent-green)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
      }
    } else if (isDragActive) {
      return {
        ...baseStyles,
        borderColor: 'var(--color-accent-green)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        transform: 'scale(1.02)',
      }
    }

    return baseStyles
  }

  return (
    <div 
      className="border rounded-lg shadow-sm w-full"
      style={{ 
        backgroundColor: 'var(--color-bg-secondary)',
        borderColor: 'var(--color-border-primary)',
        padding: '1.5rem'
      }}
    >
      <div 
        {...getRootProps()} 
        className="border-2 border-dashed rounded-lg text-center cursor-pointer mb-6 w-full dropzone-padding"
        style={getDropzoneStyles()}
      >
        <input {...getInputProps()} />
        <div className="pointer-events-none">
          {uploadSuccess ? (
            <>
              <CheckCircle className="mb-4" style={{ color: 'var(--color-accent-green)' }} size={48} />
              <p className="text-base font-semibold mb-2" style={{ color: 'var(--color-accent-green)' }}>
                ✨ {sessionInfo?.file_count} PDF(s) processed successfully!
              </p>
              <p className="text-sm m-0 break-words" style={{ color: 'var(--color-text-secondary)' }}>
                {sessionInfo?.file_names?.join(', ')}
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-3 mb-6">
                <Upload style={{ color: 'var(--color-accent-green)' }} size={32} />
                <h2 className="m-0 font-semibold text-2xl" style={{ color: 'var(--color-text-primary)' }}>
                  Upload Study Materials
                </h2>
              </div>
              
              {uploadedFiles.length > 0 ? (
                <div>
                  <p className="text-base font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    {uploadedFiles.length} file(s) selected
                  </p>
                  <p className="text-sm m-0 break-words" style={{ color: 'var(--color-text-secondary)' }}>
                    {uploadedFiles.map(f => f.name).join(', ')}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-base font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    {isDragActive 
                      ? 'Drop your PDFs here...' 
                      : 'Drag & drop PDF files here, or click to browse'
                    }
                  </p>
                  <p className="text-sm m-0" style={{ color: 'var(--color-text-secondary)' }}>
                    Supports multiple PDF files
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {uploadedFiles.length > 0 && !uploadSuccess && (
        <button 
          onClick={onUpload}
          disabled={isUploading}
          className="inline-flex items-center gap-2 border rounded-md font-medium text-sm cursor-pointer transition-all duration-200 text-center justify-center text-white disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ 
            backgroundColor: isUploading ? 'var(--color-accent-success)' : 'var(--color-accent-success)',
            borderColor: isUploading ? 'var(--color-accent-success)' : 'var(--color-accent-success)',
            padding: '0.75rem 1rem',
            minWidth: '140px'
          }}
          onMouseEnter={(e) => {
            if (!isUploading) {
              e.target.style.backgroundColor = 'var(--color-accent-success-hover)'
              e.target.style.borderColor = 'var(--color-accent-success-hover)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isUploading) {
              e.target.style.backgroundColor = 'var(--color-accent-success)'
              e.target.style.borderColor = 'var(--color-accent-success)'
            }
          }}
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Processing...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Create RAG System
            </>
          )}
        </button>
      )}
    </div>
  )
}

export default FileUpload 