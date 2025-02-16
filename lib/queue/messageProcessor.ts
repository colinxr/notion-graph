import { supabase } from '../supabaseClient'
import { NotionService } from '../services/notionService'

async function processMessages() {
    const { data: subscription } = await supabase
        .from('message_queue')
        .on('INSERT', async (payload) => {
            const { page_id } = payload.new
            console.log(`Processing page: ${page_id}`)
            try {
                await NotionService.extractFullPageData(page_id)
                // Optionally update the status in the queue
                await supabase
                    .from('message_queue')
                    .update({ status: 'processed' })
                    .eq('page_id', page_id)
            } catch (error) {
                console.error(`Failed to process page ${page_id}:`, error)
                // Optionally update the status to 'failed'
            }
        })
        .subscribe()

    return subscription
}

// Call this function to start processing messages
processMessages() 