import { createClient } from 'contentful'

const space = process.env.CONTENTFUL_SPACE_ID
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

const client = space && accessToken ? createClient({
  space: space,
  accessToken: accessToken,
}) : null

export async function getConstraints() {
  if (!client) return []
  
  try {
    const entries = await client.getEntries({
      content_type: 'constraint',
      include: 2,
    })
    
    return entries.items
  } catch (error) {
    console.error('Error fetching constraints:', error)
    return []
  }
}