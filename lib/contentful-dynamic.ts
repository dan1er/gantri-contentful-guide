import { createClient } from 'contentful'

const space = process.env.CONTENTFUL_SPACE_ID
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

const client = createClient({
  space: space!,
  accessToken: accessToken!,
})

export async function getSiteConfiguration() {
  const entries = await client.getEntries({
    content_type: 'siteConfiguration',
    limit: 1,
    include: 3,
  })
  
  return entries.items[0]
}

export async function getAllPages() {
  const entries = await client.getEntries({
    content_type: 'page',
    include: 3,
  })
  
  return entries.items
}

export async function getPageBySlug(slug: string) {
  const entries = await client.getEntries({
    content_type: 'page',
    'fields.slug': slug,
    include: 3,
  })
  
  return entries.items[0]
}

export async function getNavigationItems() {
  const entries = await client.getEntries({
    content_type: 'navigationItem',
    order: 'fields.order',
    include: 2,
  })
  
  return entries.items
}