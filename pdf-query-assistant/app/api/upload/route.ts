import { NextRequest, NextResponse } from 'next/server'
import { extractTextFromPDF } from '@/lib/pdfProcessor'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const pdfContent = await extractTextFromPDF(buffer)

    return NextResponse.json({
      success: true,
      ...pdfContent
    })
  } catch (error) {
    console.error('Error processing PDF:', error)
    return NextResponse.json(
      { error: 'Failed to process PDF' },
      { status: 500 }
    )
  }
}
