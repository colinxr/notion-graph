import { prisma } from '../db'
import { Note, Tag } from '@prisma/client'

export interface CreateNoteInput {
  title: string
  content: string
  tags: string[]
  references: string[]
}

export class NoteService {
  static async createNote(input: CreateNoteInput) {
    const { title, content, tags, references } = input

    return await prisma.note.create({
      data: {
        title,
        content,
        tags: {
          connectOrCreate: tags.map(tag => ({
            where: { name: tag },
            create: { name: tag }
          }))
        },
        references: {
          connect: references.map(id => ({ id }))
        }
      },
      include: {
        tags: true,
        references: true,
        referencedBy: true
      }
    })
  }

  static async getNotes() {
    return await prisma.note.findMany({
      include: {
        tags: true,
        references: true,
        referencedBy: true
      }
    })
  }

  static async getNoteById(id: string) {
    return await prisma.note.findUnique({
      where: { id },
      include: {
        tags: true,
        references: true,
        referencedBy: true
      }
    })
  }
} 