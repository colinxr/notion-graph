import { NextResponse } from 'next/server'
import { SettingsService } from '@/lib/services/settingsService'

export async function GET() {
  try {
    const settings = await SettingsService.getSettings()
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const settings = await SettingsService.updateSettings(body)
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
} 