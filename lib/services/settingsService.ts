import { prisma } from '../db'

export interface SettingsInput {
  notionApiKey: string
  notionDatabaseId: string
  notionDatabaseUrl: string
}

export class SettingsService {
  static async getSettings() {
    return await prisma.settings.findFirst()
  }

  static async updateSettings(input: SettingsInput) {
    const settings = await this.getSettings()
    
    if (settings) {
      return await prisma.settings.update({
        where: { id: settings.id },
        data: input
      })
    }

    return await prisma.settings.create({
      data: input
    })
  }
} 