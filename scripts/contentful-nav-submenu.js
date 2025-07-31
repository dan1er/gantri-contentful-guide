const contentful = require('contentful-management')

async function setupNavigationSubmenus() {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
  const environment = await space.getEnvironment('master')

  console.log('🔄 Setting up navigation with submenus...')

  try {
    // Create sub-navigation items for "How We Manufacture"
    const subNavItems = [
      { label: 'Printing Parts', order: 1 },
      { label: 'Painting Parts', order: 2 },
      { label: 'Assembling the Product', order: 3 },
      { label: 'Quality Control', order: 4 },
      { label: 'Packing and Shipping', order: 5 }
    ]

    const createdSubItems = []
    for (const item of subNavItems) {
      // Check if sub-item already exists
      const existing = await environment.getEntries({
        content_type: 'navigationItem',
        'fields.label': item.label
      })

      if (existing.items.length === 0) {
        const subNavItem = await environment.createEntry('navigationItem', {
          fields: {
            label: { 'en-US': item.label },
            order: { 'en-US': item.order }
          }
        })
        await subNavItem.publish()
        createdSubItems.push(subNavItem)
        console.log(`✅ Created sub-navigation: ${item.label}`)
      } else {
        createdSubItems.push(existing.items[0])
        console.log(`ℹ️  Sub-navigation already exists: ${item.label}`)
      }
    }

    // Create core component types
    const componentTypes = [
      {
        id: 'button',
        name: 'Button',
        displayField: 'label',
        fields: [
          {
            id: 'label',
            name: 'Label',
            type: 'Symbol',
            required: true
          },
          {
            id: 'variant',
            name: 'Variant',
            type: 'Symbol',
            required: false,
            validations: [
              {
                in: ['primary', 'secondary', 'ghost']
              }
            ]
          },
          {
            id: 'icon',
            name: 'Icon',
            type: 'Symbol',
            required: false
          },
          {
            id: 'targetPage',
            name: 'Target Page',
            type: 'Link',
            linkType: 'Entry',
            required: false,
            validations: [
              {
                linkContentType: ['page']
              }
            ]
          }
        ]
      },
      {
        id: 'card',
        name: 'Card',
        displayField: 'title',
        fields: [
          {
            id: 'title',
            name: 'Title',
            type: 'Symbol',
            required: true
          },
          {
            id: 'content',
            name: 'Content',
            type: 'Text',
            required: false
          },
          {
            id: 'image',
            name: 'Image',
            type: 'Link',
            linkType: 'Asset',
            required: false
          },
          {
            id: 'variant',
            name: 'Variant',
            type: 'Symbol',
            required: false,
            validations: [
              {
                in: ['default', 'bordered', 'elevated', 'milestone']
              }
            ]
          },
          {
            id: 'step',
            name: 'Step Number',
            type: 'Symbol',
            required: false
          }
        ]
      },
      {
        id: 'grid',
        name: 'Grid',
        displayField: 'title',
        fields: [
          {
            id: 'title',
            name: 'Title',
            type: 'Symbol',
            required: false
          },
          {
            id: 'columns',
            name: 'Columns',
            type: 'Integer',
            required: false,
            validations: [
              {
                range: {
                  min: 1,
                  max: 6
                }
              }
            ]
          },
          {
            id: 'items',
            name: 'Grid Items',
            type: 'Array',
            items: {
              type: 'Link',
              linkType: 'Entry',
              validations: []
            },
            required: false
          },
          {
            id: 'variant',
            name: 'Variant',
            type: 'Symbol',
            required: false,
            validations: [
              {
                in: ['default', 'cards', 'constraints', 'products']
              }
            ]
          }
        ]
      }
    ]

    // Create component types
    for (const componentType of componentTypes) {
      try {
        const type = await environment.createContentTypeWithId(componentType.id, {
          name: componentType.name,
          displayField: componentType.displayField,
          fields: componentType.fields
        })
        await type.publish()
        console.log(`✅ Created ${componentType.name} component type`)
      } catch (error) {
        if (error.name === 'VersionMismatch') {
          console.log(`ℹ️  ${componentType.name} type already exists`)
        } else {
          console.error(`Error creating ${componentType.name}:`, error.message)
        }
      }
    }

    // Create navigation buttons for pages
    const navigationButtons = {
      'getting-started': {
        next: { label: 'Product Categories', icon: '→' }
      },
      'product-categories': {
        prev: { label: 'Back to Introduction', icon: '←' },
        next: { label: 'How We Manufacture', icon: '→' }
      },
      'how-we-manufacture': {
        prev: { label: 'Back to Product Categories', icon: '←' },
        next: { label: 'Pricing Considerations', icon: '→' }
      },
      'pricing-considerations': {
        prev: { label: 'Back to Manufacturing', icon: '←' },
        next: { label: 'Concept Submission', icon: '→' }
      },
      'concept-submission': {
        prev: { label: 'Back to Pricing', icon: '←' }
      }
    }

    // Update pages with navigation buttons
    for (const [slug, buttons] of Object.entries(navigationButtons)) {
      const pages = await environment.getEntries({
        content_type: 'page',
        'fields.slug': slug
      })

      if (pages.items.length > 0) {
        const page = pages.items[0]
        page.fields.navigationButtons = { 'en-US': buttons }
        
        await page.update()
        await page.publish()
        console.log(`✅ Updated ${slug} with navigation buttons`)
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    throw error
  }
}

// Run the script
if (require.main === module) {
  setupNavigationSubmenus()
    .then(() => {
      console.log('✅ Navigation submenu setup complete')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Error:', error)
      process.exit(1)
    })
}