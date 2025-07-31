import { createClient } from 'contentful'

const space = process.env.CONTENTFUL_SPACE_ID
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

if (!space || !accessToken) {
  console.warn('Contentful environment variables are not set')
}

const client = space && accessToken ? createClient({
  space: space,
  accessToken: accessToken,
}) : null

export async function getSiteConfiguration() {
  if (!client) return null
  
  try {
    const entries = await client.getEntries({
      content_type: 'siteConfiguration',
      limit: 1,
      include: 3,
    })
    
    return entries.items[0]
  } catch (error) {
    console.error('Error fetching site configuration:', error)
    return null
  }
}

export async function getAllPages() {
  if (!client) return []
  
  try {
    const entries = await client.getEntries({
      content_type: 'page',
      include: 3,
    })
    
    return entries.items.filter(item => item.fields.slug)
  } catch (error) {
    console.error('Error fetching pages:', error)
    return []
  }
}

export async function getPageBySlug(slug: string) {
  if (!client) return null
  
  try {
    const entries = await client.getEntries({
      content_type: 'page',
      'fields.slug': slug,
      include: 3,
    })
    
    return entries.items[0]
  } catch (error) {
    console.error('Error fetching page by slug:', error)
    return null
  }
}

export async function getNavigationItems() {
  if (!client) return []
  
  try {
    const entries = await client.getEntries({
      content_type: 'navigationItem',
      order: ['fields.order'],
      include: 2,
    })
    
    return entries.items
  } catch (error) {
    console.error('Error fetching navigation items:', error)
    return []
  }
}