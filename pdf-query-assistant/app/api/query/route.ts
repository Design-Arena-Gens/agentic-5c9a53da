import { NextRequest, NextResponse } from 'next/server'
import { findAnswer } from '@/lib/queryEngine'

export async function POST(request: NextRequest) {
  try {
    const { query, pdfContent, filename } = await request.json()

    if (!query || !pdfContent) {
      return NextResponse.json(
        { error: 'Missing query or PDF content' },
        { status: 400 }
      )
    }

    const answer = await findAnswer(query, pdfContent)

    return NextResponse.json({
      success: true,
      answer,
      filename
    })
  } catch (error) {
    console.error('Error processing query:', error)
    return NextResponse.json(
      { error: 'Failed to process query' },
      { status: 500 }
    )
  }
}
