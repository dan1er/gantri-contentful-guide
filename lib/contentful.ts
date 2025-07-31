import { createClient } from 'contentful'

const space = process.env.CONTENTFUL_SPACE_ID
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

const client = createClient({
  space: space!,
  accessToken: accessToken!,
})

export async function getQuickStartGuideSections() {
  const entries = await client.getEntries({
    content_type: 'quickStartGuideSection',
    order: 'fields.sectionNumber',
    include: 2,
  })
  
  return entries.items
}

export async function getProductCategories() {
  const entries = await client.getEntries({
    content_type: 'productCategory',
    order: 'fields.order',
  })
  
  return entries.items
}

export async function getManufacturingProcesses() {
  const entries = await client.getEntries({
    content_type: 'manufacturingProcess',
    include: 2,
  })
  
  return entries.items
}

export async function getConstraintById(id: string) {
  const entry = await client.getEntry(id)
  return entry
}