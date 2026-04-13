import { useState, useRef, useEffect, type ChangeEvent, type DragEvent } from 'react'
import { useOutletContext } from 'react-router'
import { CheckCircle2, ImageIcon, UploadIcon, AlertCircle } from 'lucide-react'
import { PROGRESS_INCREMENT, PROGRESS_INTERVAL_MS, REDIRECT_DELAY_MS } from '../lib/constants'

type UploadProps = {
  onComplete?: (base64: string) => void
  onError?: (error: string) => void
}

const Upload = ({ onComplete, onError }: UploadProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fileReaderRef = useRef<FileReader | null>(null)

  const { isSignedIn } = useOutletContext<AuthContext>()

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      if (fileReaderRef.current) {
        fileReaderRef.current.abort()
      }
    }
  }, [])

  const processFile = (file: File) => {
    if (!isSignedIn) return

    setFile(file)
    setProgress(0)
    setError(null)

    const reader = new FileReader()
    fileReaderRef.current = reader

    reader.onerror = () => {
      setError('Failed to read file. Please try again.')
      if (onError) onError('Failed to read file.')
    }

    reader.onloadend = () => {
      if (reader.error) return

      const base64 = reader.result as string
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current)
            }
            setTimeout(() => {
              if (onComplete) {
                onComplete(base64)
              }
            }, REDIRECT_DELAY_MS)
            return 100
          }
          return Math.min(prev + PROGRESS_INCREMENT, 100)
        })
      }, PROGRESS_INTERVAL_MS)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!isSignedIn) return
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (!isSignedIn) return

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      if (droppedFile.type.startsWith('image/')) {
        processFile(droppedFile)
      } else {
        setError('Only image files are allowed.')
        if (onError) onError('Only image files are allowed.')
      }
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isSignedIn) return

    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) {
        processFile(selectedFile)
      } else {
        setError('Only image files are allowed.')
        if (onError) onError('Only image files are allowed.')
      }
    }
  }

  return (
    <div className="upload">
      {!file ? (
        <div
          className={`dropzone ${isDragging ? 'is-dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            className="drop-input"
            type="file"
            accept=".jpg, .jpeg, .png"
            disabled={!isSignedIn}
            onChange={handleChange}
          />

          <div className="drop-content">
            <div className="drop-icon">
              <UploadIcon size={20} />
            </div>
            {error && (
              <div className="mb-2 flex items-center gap-2 text-sm text-red-500">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            <p>
              {isSignedIn ? (
                'Click to upload or just drag and drop'
              ) : (
                'Sign in or sign up with Puter to upload'
              )}
            </p>
            <p className="help">Maximum file size 50MB.</p>
          </div>
        </div>
      ) : (
        <div className="upload-status">
          <div className="status-content">
            <div className="status-icon">
              {error ? (
                <AlertCircle className="error text-red-500" />
              ) : progress === 100 ? (
                <CheckCircle2 className="check" />
              ) : (
                <ImageIcon className="image" />
              )}
            </div>

            <h3>{file.name}</h3>

            <div className="progress">
              {error ? (
                <p className="status-text text-red-500">{error}</p>
              ) : (
                <>
                  <div className="bar" style={{ width: `${progress}%` }} />

                  <p className="status-text">
                    {progress < 100 ? 'Analyzing Floor Plan...' : 'Redirecting...'}
                  </p>
                </>
              )}
            </div>

            {error && (
              <button
                className="mt-4 text-xs font-bold uppercase tracking-wider text-primary hover:text-orange-600 transition-colors"
                onClick={() => {
                  setFile(null)
                  setError(null)
                  setProgress(0)
                }}
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Upload
