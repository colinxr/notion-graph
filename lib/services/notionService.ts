import { Client } from '@notionhq/client'
import type { PageObjectResponse, BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { SettingsService } from './settingsService'

export interface NotionPage {
  id: string
  title: string
  url: string
  lastEdited: string
  links: {
    type: string
    content: string
  }[]
}

export class NotionService {
  private static async getClient() {
    const settings = await SettingsService.getSettings()
    if (!settings?.notionApiKey) {
      throw new Error('Notion API key not found')
    }
    return new Client({ auth: settings.notionApiKey })
  }

  private static async getLinks(pageId: string) {
    const notion = await this.getClient()
    const blocks = await notion.blocks.children.list({ block_id: pageId })
    
    return blocks.results.reduce<Array<{ type: string; content: string }>>((acc, block) => {
      const blockObject = block as BlockObjectResponse
      if (blockObject.type === 'paragraph') {
        const richText = blockObject.paragraph.rich_text[0]
        if (richText?.type === 'mention') {
          acc.push({
            type: 'mention',
            content: richText.href || ''
          })
        }
      }
      return acc
    }, [])
  }

  static async getRecentPages(limit = 5): Promise<NotionPage[]> {
    const settings = await SettingsService.getSettings()
    if (!settings?.notionDatabaseId) {
      throw new Error('Notion database ID not found')
    }

    const notion = await this.getClient()
    const response = await notion.databases.query({
      database_id: settings.notionDatabaseId,
      page_size: limit,
      sorts: [
        {
          timestamp: 'last_edited_time',
          direction: 'descending'
        }
      ]
    })

    return Promise.all(response.results.map(async page => {
      const pageObject = page as PageObjectResponse
      const links = await this.getLinks(page.id)
      
      return {
        id: page.id,
        title: (pageObject.properties.Name as any)?.title?.[0]?.plain_text || 'Untitled',
        url: pageObject.url,
        lastEdited: pageObject.last_edited_time,
        links
      }
    }))
  }

  static async getDatabasePages() {
    const settings = await SettingsService.getSettings()
    if (!settings?.notionDatabaseId) {
      throw new Error('Notion database ID not found')
    }

    const notion = await this.getClient()
    const response = await notion.databases.query({
      database_id: settings.notionDatabaseId,
    })

    return response.results
  }

  static async syncNotionToLocal() {
    const pages = await this.getDatabasePages()
    // TODO: Implement syncing logic to convert Notion pages to local notes
    return pages
  }
} 