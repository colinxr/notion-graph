import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { SettingsService } from '@/lib/services/settingsService'
import { NotionService } from '@/lib/services/notionService'
import { SyncButton } from '@/components/SyncButton'

export default async function HomePage() {
  const settings = await SettingsService.getSettings()
  console.log(settings)
  const isConfigured = !!settings?.notionApiKey
  const recentPages = isConfigured ? await NotionService.getRecentPages() : []

  return (
    <main className="container mx-auto py-10">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Notion Graph</h1>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Connection Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {isConfigured 
                  ? "✅ Connected to Notion"
                  : "❌ Not connected to Notion"
                }
              </p>
              <Link href="/settings">
                <Button variant={isConfigured ? "secondary" : "default"}>
                  {isConfigured ? "Update Settings" : "Connect Notion"}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {isConfigured && (
            <Card>
              <CardHeader>
                <CardTitle>Database Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Database: {settings.notionDatabaseUrl}
                  </p>
                  <SyncButton />
                </div>
              </CardContent>
            </Card>
          )}

          {isConfigured && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  { recentPages?.map(page => (
                    ''
                    
                    // <div key={page.id} className="flex justify-between items-center border-b pb-2">
                    //   <div>
                    //     <a 
                    //       href={page.url} 
                    //       target="_blank" 
                    //       rel="noopener noreferrer"
                    //       className="text-sm font-medium hover:underline"
                    //     >
                    //       {page.title}
                    //     </a>
                    //     <p className="text-xs text-muted-foreground">
                    //       Last edited: {new Date(page.lastEdited).toLocaleDateString()}
                    //     </p>
                    //   </div>
                    // </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
} 