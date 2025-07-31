const contentful = require('contentful-management')

async function createEnhancedNavigation() {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
  const environment = await space.getEnvironment('master')

  console.log('🔄 Creating enhanced navigation structure...')

  try {
    // Update navigationItem to support submenus
    const navType = await environment.getContentType('navigationItem')
    
    // Check if subItems field exists
    const hasSubItems = navType.fields.some(f => f.id === 'subItems')
    
    if (!hasSubItems) {
      navType.fields.push({
        id: 'subItems',
        name: 'Sub Items',
        type: 'Array',
        items: {
          type: 'Link',
          linkType: 'Entry',
          validations: [
            {
              linkContentType: ['navigationItem']
            }
          ]
        },
        required: false,
        validations: []
      })
      
      // Add isExpanded field for collapsible state
      navType.fields.push({
        id: 'isExpandedByDefault',
        name: 'Is Expanded By Default',
        type: 'Boolean',
        required: false,
        validations: []
      })
      
      await navType.update()
      await navType.publish()
      console.log('✅ Updated navigationItem with submenu support')
    }

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
            order: { 'en-US': item.order },
            // Sub-items don't have their own page, they're sections
            isExpandedByDefault: { 'en-US': false }
          }
        })
        await subNavItem.publish()
        createdSubItems.push(subNavItem)
        console.log(`✅ Created sub-navigation: ${item.label}`)
      } else {
        createdSubItems.push(existing.items[0])
      }
    }

    // Update "How We Manufacture" navigation item with sub-items
    const manufacturingNav = await environment.getEntries({
      content_type: 'navigationItem',
      'fields.label': 'How We Manufacture'
    })

    if (manufacturingNav.items.length > 0) {
      const navItem = manufacturingNav.items[0]
      navItem.fields.subItems = {
        'en-US': createdSubItems.map(item => ({
          sys: { type: 'Link', linkType: 'Entry', id: item.sys.id }
        }))
      }
      navItem.fields.isExpandedByDefault = { 'en-US': true }
      
      await navItem.update()
      await navItem.publish()
      console.log('✅ Updated How We Manufacture with sub-navigation')
    }

    // Create Button component type
    try {
      const buttonType = await environment.createContentTypeWithId('button', {
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
            id: 'action',
            name: 'Action',
            type: 'Symbol',
            required: false,
            validations: [
              {
                in: ['next-page', 'previous-page', 'custom-link']
              }
            ]
          },
          {
            id: 'customLink',
            name: 'Custom Link',
            type: 'Symbol',
            required: false
          }
        ]
      })
      await buttonType.publish()
      console.log('✅ Created Button component type')
    } catch (error) {
      console.log('ℹ️  Button type might already exist')
    }

    // Create Card component type
    try {
      const cardType = await environment.createContentTypeWithId('card', {
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
            id: 'icon',
            name: 'Icon',
            type: 'Symbol',
            required: false
          }
        ]
      })
      await cardType.publish()
      console.log('✅ Created Card component type')
    } catch (error) {
      console.log('ℹ️  Card type might already exist')
    }

    // Create Grid component type
    try {
      const gridType = await environment.createContentTypeWithId('grid', {
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
      })
      await gridType.publish()
      console.log('✅ Created Grid component type')
    } catch (error) {
      console.log('ℹ️  Grid type might already exist')
    }

    // Update Page type to support navigation buttons
    try {
      const pageType = await environment.getContentType('page')
      const hasNavButtons = pageType.fields.some(f => f.id === 'navigationButtons')
      
      if (!hasNavButtons) {
        pageType.fields.push({
          id: 'navigationButtons',
          name: 'Navigation Buttons',
          type: 'Object',
          required: false
        })
        
        await pageType.update()
        await pageType.publish()
        console.log('✅ Added navigationButtons to page type')
      }
    } catch (error) {
      console.log('ℹ️  Navigation buttons might already exist on page type')
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    throw error
  }
}

// Run the script
if (require.main === module) {
  createEnhancedNavigation()
    .then(() => {
      console.log('✅ Enhanced navigation setup complete')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Error:', error)
      process.exit(1)
    })
}