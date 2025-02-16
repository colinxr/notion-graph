import { Client } from '@notionhq/client'
import type { PageObjectResponse, BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { SettingsService } from './settingsService'

interface NotionLink {
  type: string
  content: string
}

export interface NotionPage {
  id: string
  title: string
  url: string
  lastEdited: string
  links: NotionLink[]
}

export class NotionService {
  private static async getClient() {
    const settings = await SettingsService.getSettings()
    if (!settings?.notionApiKey) {
      throw new Error('Notion API key not found')
    }
    return new Client({ auth: settings.notionApiKey })
  }

  private static async validateDatabaseAccess() {
    const settings = await SettingsService.getSettings()
    if (!settings?.notionDatabaseId) {
      throw new Error('Notion database ID not found')
    }
    return settings.notionDatabaseId
  }

  private static extractPageData(page: PageObjectResponse): Omit<NotionPage, 'links'> {
    return {
      id: page.id,
      title: (page.properties.Name as any)?.title?.[0]?.plain_text || 'Untitled',
      url: page.url,
      lastEdited: page.last_edited_time,
    }
  }

  private static async extractLinksFromPage(pageId: string): Promise<NotionLink[]> {
    const notion = await this.getClient()
    const { results } = await notion.blocks.children.list({ block_id: pageId })
    
    return results.reduce<NotionLink[]>((links, block) => {
      const blockObject = block as BlockObjectResponse
      if (blockObject.type === 'paragraph') {
        const richText = blockObject.paragraph.rich_text[0]
        if (richText?.type === 'mention') {
          links.push({
            type: 'mention',
            content: richText.href || ''
          })
        }
      }
      return links
    }, [])
  }

  static async getRecentPages(limit = 5): Promise<NotionPage[]> {
    const databaseId = await this.validateDatabaseAccess()
    const notion = await this.getClient()

    const { results } = await notion.databases.query({
      database_id: databaseId,
      page_size: limit,
      sorts: [{ timestamp: 'last_edited_time', direction: 'descending' }]
    })

    return Promise.all(
      results.map(async (page) => {
        const pageObject = page as PageObjectResponse
        const pageData = this.extractPageData(pageObject)
        const links = await this.extractLinksFromPage(page.id)
        
        return { ...pageData, links }
      })
    )
  }

  static async syncDatabase() {
    const databaseId = await this.validateDatabaseAccess()
    const notion = await this.getClient()
    
    const { results } = await notion.databases.query({
      database_id: databaseId,
    })

    // TODO: Implement syncing logic
    return results
  }
} 