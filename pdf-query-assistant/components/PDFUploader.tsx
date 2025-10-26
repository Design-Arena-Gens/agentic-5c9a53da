'use client'

import { useState, useRef } from 'react'

interface PDFUploaderProps {
  onUploadComplete: (filename: string, content: any) => void
  currentFile: string | null
}

export default function PDFUploader({ onUploadComplete, currentFile }: PDFUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file.type.includes('pdf')) {
      alert('Please upload a PDF file')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      onUploadComplete(file.name, data)
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload PDF. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.5)',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid rgba(148, 163, 184, 0.2)',
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '1.5rem',
        color: '#f1f5f9'
      }}>
        Upload PDF Document
      </h2>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: dragActive ? '2px dashed #60a5fa' : '2px dashed rgba(148, 163, 184, 0.3)',
          borderRadius: '0.75rem',
          padding: '3rem 2rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragActive ? 'rgba(96, 165, 250, 0.1)' : 'rgba(15, 23, 42, 0.5)',
          transition: 'all 0.3s ease'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleChange}
          style={{ display: 'none' }}
        />

        {uploading ? (
          <div>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid rgba(148, 163, 184, 0.2)',
              borderTop: '4px solid #60a5fa',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            <p style={{ color: '#94a3b8' }}>Processing PDF...</p>
          </div>
        ) : currentFile ? (
          <div>
            <div style={{
              width: '48px',
              height: '48px',
              background: '#10b981',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              ✓
            </div>
            <p style={{ color: '#10b981', fontWeight: '600', marginBottom: '0.5rem' }}>
              {currentFile}
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              Click or drag to upload a different PDF
            </p>
          </div>
        ) : (
          <div>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem'
            }}>
              📄
            </div>
            <p style={{
              color: '#e2e8f0',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              Drop your PDF here or click to browse
            </p>
            <p style={{
              color: '#94a3b8',
              fontSize: '0.875rem'
            }}>
              Supports multi-page PDFs (20+ pages)
            </p>
          </div>
        )}
      </div>

      {currentFile && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'rgba(16, 185, 129, 0.1)',
          borderRadius: '0.5rem',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          <p style={{
            color: '#10b981',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>
            ✓ PDF processed and ready for queries
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
