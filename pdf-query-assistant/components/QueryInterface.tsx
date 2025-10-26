'use client'

import { useState } from 'react'

interface QueryInterfaceProps {
  filename: string
  pdfContent: any
}

interface Answer {
  text: string
  page: number
  confidence: number
}

export default function QueryInterface({ filename, pdfContent }: QueryInterfaceProps) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState<Answer | null>(null)
  const [history, setHistory] = useState<Array<{ query: string; answer: Answer }>>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    setLoading(true)
    setAnswer(null)

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          pdfContent,
          filename
        }),
      })

      if (!response.ok) {
        throw new Error('Query failed')
      }

      const data = await response.json()
      setAnswer(data.answer)
      setHistory(prev => [...prev, { query, answer: data.answer }])
    } catch (error) {
      console.error('Error querying PDF:', error)
      alert('Failed to query PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.5)',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '1.5rem',
        color: '#f1f5f9'
      }}>
        Query Your Document
      </h2>

      <form onSubmit={handleSubmit} style={{
        marginBottom: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          gap: '0.75rem'
        }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about your PDF..."
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '0.5rem',
              color: '#e2e8f0',
              fontSize: '1rem',
              outline: 'none'
            }}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            style={{
              padding: '0.75rem 1.5rem',
              background: loading || !query.trim() ? 'rgba(148, 163, 184, 0.3)' : 'linear-gradient(to right, #60a5fa, #a78bfa)',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {loading && (
          <div style={{
            padding: '2rem',
            textAlign: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(148, 163, 184, 0.2)',
              borderTop: '4px solid #60a5fa',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            <p style={{ color: '#94a3b8' }}>Searching document...</p>
          </div>
        )}

        {answer && (
          <div style={{
            padding: '1.5rem',
            background: 'rgba(96, 165, 250, 0.1)',
            border: '1px solid rgba(96, 165, 250, 0.3)',
            borderRadius: '0.75rem',
            animation: 'fadeIn 0.5s ease'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem'
            }}>
              <h3 style={{
                color: '#60a5fa',
                fontWeight: '600',
                fontSize: '1.1rem'
              }}>
                Current Query
              </h3>
              <span style={{
                background: 'rgba(167, 139, 250, 0.2)',
                color: '#a78bfa',
                padding: '0.25rem 0.75rem',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                Page {answer.page}
              </span>
            </div>
            <p style={{
              color: '#cbd5e1',
              fontWeight: '600',
              marginBottom: '0.75rem',
              fontSize: '0.95rem'
            }}>
              Q: {query}
            </p>
            <div style={{
              background: 'rgba(15, 23, 42, 0.5)',
              padding: '1rem',
              borderRadius: '0.5rem',
              borderLeft: '3px solid #60a5fa'
            }}>
              <p style={{
                color: '#e2e8f0',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}>
                {answer.text}
              </p>
            </div>
            <div style={{
              marginTop: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: '100%',
                height: '4px',
                background: 'rgba(148, 163, 184, 0.2)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${answer.confidence * 100}%`,
                  height: '100%',
                  background: answer.confidence > 0.7 ? '#10b981' : answer.confidence > 0.4 ? '#f59e0b' : '#ef4444',
                  borderRadius: '2px'
                }} />
              </div>
              <span style={{
                color: '#94a3b8',
                fontSize: '0.75rem',
                whiteSpace: 'nowrap'
              }}>
                {Math.round(answer.confidence * 100)}%
              </span>
            </div>
          </div>
        )}

        {history.length > 1 && (
          <div>
            <h3 style={{
              color: '#94a3b8',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Previous Queries
            </h3>
            {history.slice(0, -1).reverse().map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1rem',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '0.5rem',
                  marginBottom: '0.75rem'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <p style={{
                    color: '#94a3b8',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    {item.query}
                  </p>
                  <span style={{
                    color: '#64748b',
                    fontSize: '0.75rem'
                  }}>
                    Page {item.answer.page}
                  </span>
                </div>
                <p style={{
                  color: '#cbd5e1',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {item.answer.text}
                </p>
              </div>
            ))}
          </div>
        )}

        {!loading && !answer && history.length === 0 && (
          <div style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            color: '#64748b'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem'
            }}>
              💬
            </div>
            <p style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              Ready to answer your questions
            </p>
            <p style={{
              fontSize: '0.875rem'
            }}>
              Ask anything about your PDF and get exact answers
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
