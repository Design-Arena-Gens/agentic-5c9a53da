'use client'

import { useState } from 'react'
import PDFUploader from '@/components/PDFUploader'
import QueryInterface from '@/components/QueryInterface'

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [pdfContent, setPdfContent] = useState<any>(null)

  return (
    <main style={{
      minHeight: '100vh',
      padding: '2rem',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          AI-Powered PDF Query Assistant
        </h1>
        <p style={{
          color: '#94a3b8',
          fontSize: '1.1rem'
        }}>
          Upload your PDF and get exact answers from your documents
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: uploadedFile ? '1fr 1fr' : '1fr',
        gap: '2rem'
      }}>
        <PDFUploader
          onUploadComplete={(filename, content) => {
            setUploadedFile(filename)
            setPdfContent(content)
          }}
          currentFile={uploadedFile}
        />

        {uploadedFile && pdfContent && (
          <QueryInterface
            filename={uploadedFile}
            pdfContent={pdfContent}
          />
        )}
      </div>
    </main>
  )
}
