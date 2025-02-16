'use client'

import { Button } from '@/components/ui/button'

export function SyncButton() {
  const handleSync = async () => {
    // TODO: Implement sync logic
    console.log('Syncing database...')
  }

  return (
    <Button onClick={handleSync}>Sync Database</Button>
  )
} 