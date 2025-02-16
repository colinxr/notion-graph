import { NextResponse } from 'next/server'
import { NoteService } from '@/lib/services/noteService'

export async function GET() {
  try {
    const notes = await NoteService.getNotes()
    return NextResponse.json(notes)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const note = await NoteService.createNote(body)
    return NextResponse.json(note)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  }
} 