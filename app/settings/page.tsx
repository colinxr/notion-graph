'use client'

import { useState, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { SettingsService } from '@/lib/services/settingsService'

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState({
    notionApiKey: '',
    notionDatabaseId: '',
    notionDatabaseUrl: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await SettingsService.updateSettings(settings)
    router.refresh()
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Notion Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Notion API Key</label>
              <Input
                type="password"
                value={settings.notionApiKey}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, notionApiKey: e.target.value })}
                placeholder="Enter your Notion API key"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notion Database URL</label>
              <Input
                type="text"
                value={settings.notionDatabaseUrl}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, notionDatabaseUrl: e.target.value })}
                placeholder="Enter your Notion database URL"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notion Database ID</label>
              <Input
                type="text"
                value={settings.notionDatabaseId}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, notionDatabaseId: e.target.value })}
                placeholder="Enter your Notion database ID"
              />
            </div>
            <Button type="submit">Save Settings</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 