require('dotenv').config({ path: '.env.local' })
const contentfulManagement = require('contentful-management')

async function createComplexPage() {
  console.log('Creating complex Design Guidelines page...')
  
  const client = contentfulManagement.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
  const environment = await space.getEnvironment('master')

  // Helper function to create rich text
  const createRichText = (content) => ({
    nodeType: 'document',
    data: {},
    content: Array.isArray(content) ? content : [{
      nodeType: 'paragraph',
      content: [{
        nodeType: 'text',
        value: content,
        marks: [],
        data: {}
      }],
      data: {}
    }]
  })

  const createHeading = (text, level = 2) => ({
    nodeType: `heading-${level}`,
    content: [{
      nodeType: 'text',
      value: text,
      marks: [],
      data: {}
    }],
    data: {}
  })

  const createList = (items, ordered = false) => ({
    nodeType: ordered ? 'ordered-list' : 'unordered-list',
    content: items.map(item => ({
      nodeType: 'list-item',
      content: [{
        nodeType: 'paragraph',
        content: [{
          nodeType: 'text',
          value: item,
          marks: [],
          data: {}
        }],
        data: {}
      }],
      data: {}
    })),
    data: {}
  })

  try {
    // 1. Create Modal for Material Guidelines
    const materialModal = await environment.createEntry('modalComponent', {
      fields: {
        title: { 'en-US': 'Material Properties' },
        content: {
          'en-US': createRichText([
            createHeading('Plant-based Materials', 3),
            {
              nodeType: 'paragraph',
              content: [{
                nodeType: 'text',
                value: 'Our proprietary plant-based materials offer:',
                marks: [],
                data: {}
              }],
              data: {}
            },
            createList([
              'Sustainable sourcing from corn starch',
              'Biodegradable properties',
              'UV resistance for indoor use',
              'Smooth surface finish',
              'Limited color options: Natural, White, Black'
            ])
          ])
        },
        data: {
          'en-US': {
            density: '1.24 g/cm³',
            tensileStrength: '50 MPa',
            flexuralStrength: '83 MPa',
            impactStrength: '2.5 kJ/m²'
          }
        }
      }
    })
    await materialModal.publish()
    console.log('Created Material Modal')

    // 2. Create Modal for Assembly Guidelines
    const assemblyModal = await environment.createEntry('modalComponent', {
      fields: {
        title: { 'en-US': 'Assembly Best Practices' },
        content: {
          'en-US': createRichText([
            createHeading('Snap-fit Connections', 3),
            {
              nodeType: 'paragraph',
              content: [{
                nodeType: 'text',
                value: 'Design snap-fit connections with:',
                marks: [],
                data: {}
              }],
              data: {}
            },
            createList([
              'Minimum 1.5mm wall thickness at connection points',
              'Draft angles of 0.5-1 degree',
              'Undercut depth of 0.5-1mm',
              'Lead-in chamfers for easy assembly'
            ]),
            createHeading('Tolerance Guidelines', 3),
            createList([
              'Press fit: 0.05-0.1mm interference',
              'Sliding fit: 0.1-0.2mm clearance',
              'Loose fit: 0.2-0.3mm clearance'
            ])
          ])
        }
      }
    })
    await assemblyModal.publish()
    console.log('Created Assembly Modal')

    // 3. Create Design Principles Panel
    const designPrinciplesPanel = await environment.createEntry('panelComponent', {
      fields: {
        title: { 'en-US': '🎨 Design Principles' },
        content: {
          'en-US': createRichText([
            createHeading('Core Design Philosophy', 3),
            {
              nodeType: 'paragraph',
              content: [{
                nodeType: 'text',
                value: 'Gantri products embody minimalist aesthetics with functional elegance. Every design should:',
                marks: [],
                data: {}
              }],
              data: {}
            },
            createList([
              'Balance form and function',
              'Minimize material usage',
              'Consider manufacturability',
              'Enhance living spaces'
            ])
          ])
        },
        items: {
          'en-US': [
            'Simplicity over complexity',
            'Sustainability in design',
            'User-centered approach',
            'Timeless aesthetics'
          ]
        }
      }
    })
    await designPrinciplesPanel.publish()
    console.log('Created Design Principles Panel')

    // 4. Create Technical Requirements Panel
    const technicalPanel = await environment.createEntry('panelComponent', {
      fields: {
        title: { 'en-US': '⚙️ Technical Requirements' },
        content: {
          'en-US': createRichText('All designs must meet strict technical requirements to ensure manufacturability and quality.')
        },
        items: {
          'en-US': [
            'Material Guidelines',
            'Structural Integrity',
            'Assembly Requirements',
            'Electrical Specifications',
            'Safety Standards'
          ]
        },
        hasModal: { 'en-US': true },
        modalContent: {
          'en-US': {
            sys: { type: 'Link', linkType: 'Entry', id: materialModal.sys.id }
          }
        }
      }
    })
    await technicalPanel.publish()
    console.log('Created Technical Requirements Panel')

    // 5. Create Color & Finish Panel
    const colorPanel = await environment.createEntry('panelComponent', {
      fields: {
        title: { 'en-US': '🎨 Color & Finish Options' },
        content: {
          'en-US': createRichText([
            createHeading('Standard Finishes', 3),
            {
              nodeType: 'paragraph',
              content: [{
                nodeType: 'text',
                value: 'Choose from our curated selection of finishes:',
                marks: [],
                data: {}
              }],
              data: {}
            },
            createList([
              'Matte White - Clean, modern aesthetic',
              'Matte Black - Bold, sophisticated look',
              'Natural - Raw material texture',
              'Custom colors available for large orders (MOQ applies)'
            ])
          ])
        }
      }
    })
    await colorPanel.publish()
    console.log('Created Color & Finish Panel')

    // 6. Create Lighting Guidelines Panel
    const lightingPanel = await environment.createEntry('panelComponent', {
      fields: {
        title: { 'en-US': '💡 Lighting Guidelines' },
        content: {
          'en-US': createRichText([
            createHeading('Light Distribution', 3),
            {
              nodeType: 'paragraph',
              content: [{
                nodeType: 'text',
                value: 'Consider these lighting patterns in your design:',
                marks: [],
                data: {}
              }],
              data: {}
            },
            createList([
              'Direct lighting: Task-oriented, focused beam',
              'Indirect lighting: Ambient, reflected light',
              'Diffused lighting: Soft, even distribution',
              'Accent lighting: Decorative, highlighting features'
            ]),
            createHeading('Bulb Compatibility', 3),
            createList([
              'E26/E27 standard socket',
              'Maximum 60W incandescent or 15W LED',
              'Recommended: Warm white (2700K-3000K)',
              'Dimmable bulbs supported'
            ])
          ])
        }
      }
    })
    await lightingPanel.publish()
    console.log('Created Lighting Guidelines Panel')

    // 7. Create Sustainability Panel
    const sustainabilityPanel = await environment.createEntry('panelComponent', {
      fields: {
        title: { 'en-US': '🌱 Sustainability Considerations' },
        content: {
          'en-US': createRichText([
            createHeading('Eco-Friendly Design', 3),
            {
              nodeType: 'paragraph',
              content: [{
                nodeType: 'text',
                value: 'Design with the environment in mind:',
                marks: [],
                data: {}
              }],
              data: {}
            },
            createList([
              'Minimize material usage through efficient design',
              'Design for disassembly and recycling',
              'Avoid support structures when possible',
              'Consider packaging efficiency',
              'Use hollow structures where strength permits'
            ])
          ])
        }
      }
    })
    await sustainabilityPanel.publish()
    console.log('Created Sustainability Panel')

    // 8. Create Testing & Validation Panel
    const testingPanel = await environment.createEntry('panelComponent', {
      fields: {
        title: { 'en-US': '🔬 Testing & Validation' },
        content: {
          'en-US': createRichText([
            createHeading('Quality Assurance Process', 3),
            {
              nodeType: 'paragraph',
              content: [{
                nodeType: 'text',
                value: 'All designs undergo rigorous testing:',
                marks: [],
                data: {}
              }],
              data: {}
            },
            createList([
              'Structural integrity testing',
              'Drop testing from 1 meter',
              'Assembly/disassembly cycles',
              'Thermal stability testing',
              'UV exposure testing',
              'Electrical safety certification'
            ])
          ])
        }
      }
    })
    await testingPanel.publish()
    console.log('Created Testing Panel')

    // 9. Create the Complex Page
    const designGuidelinesPage = await environment.createEntry('page', {
      fields: {
        title: { 'en-US': 'Design Guidelines' },
        slug: { 'en-US': 'design-guidelines' },
        sectionNumber: { 'en-US': 6 },
        content: {
          'en-US': createRichText([
            createHeading('Comprehensive Design Guidelines', 1),
            {
              nodeType: 'paragraph',
              content: [{
                nodeType: 'text',
                value: 'This comprehensive guide covers all aspects of designing for Gantri, from aesthetic principles to technical requirements. Use these guidelines to create products that are beautiful, functional, and manufacturable.',
                marks: [{ type: 'bold' }],
                data: {}
              }],
              data: {}
            },
            createHeading('Overview', 2),
            {
              nodeType: 'paragraph',
              content: [{
                nodeType: 'text',
                value: 'Successful Gantri designs balance multiple considerations:',
                marks: [],
                data: {}
              }],
              data: {}
            },
            createList([
              'Aesthetic appeal and market viability',
              'Technical feasibility and manufacturability',
              'Cost-effectiveness and material efficiency',
              'Sustainability and environmental impact',
              'User experience and assembly simplicity'
            ], true),
            createHeading('Design Process', 2),
            {
              nodeType: 'paragraph',
              content: [{
                nodeType: 'text',
                value: 'Follow this process for best results:',
                marks: [],
                data: {}
              }],
              data: {}
            },
            createList([
              'Research: Understand market needs and trends',
              'Ideation: Sketch multiple concepts',
              'Validation: Check against guidelines',
              'Prototyping: Test with 3D prints',
              'Refinement: Iterate based on feedback',
              'Submission: Prepare final documentation'
            ], true),
            {
              nodeType: 'blockquote',
              content: [{
                nodeType: 'paragraph',
                content: [{
                  nodeType: 'text',
                  value: '"Good design is as little design as possible" - Dieter Rams',
                  marks: [{ type: 'italic' }],
                  data: {}
                }],
                data: {}
              }],
              data: {}
            }
          ])
        },
        components: {
          'en-US': [
            { sys: { type: 'Link', linkType: 'Entry', id: designPrinciplesPanel.sys.id } },
            { sys: { type: 'Link', linkType: 'Entry', id: technicalPanel.sys.id } },
            { sys: { type: 'Link', linkType: 'Entry', id: lightingPanel.sys.id } },
            { sys: { type: 'Link', linkType: 'Entry', id: colorPanel.sys.id } },
            { sys: { type: 'Link', linkType: 'Entry', id: sustainabilityPanel.sys.id } },
            { sys: { type: 'Link', linkType: 'Entry', id: testingPanel.sys.id } }
          ]
        },
        navigationButtons: {
          'en-US': {
            prev: { label: 'Back to Concept Submission', icon: '←' }
          }
        }
      }
    })
    await designGuidelinesPage.publish()
    console.log('Created Design Guidelines Page')

    // 10. Create Navigation Item
    const navItem = await environment.createEntry('navigationItem', {
      fields: {
        label: { 'en-US': 'Design Guidelines' },
        order: { 'en-US': 6 },
        page: {
          'en-US': {
            sys: { type: 'Link', linkType: 'Entry', id: designGuidelinesPage.sys.id }
          }
        },
        isActive: { 'en-US': true }
      }
    })
    await navItem.publish()
    console.log('Created navigation item')

    // 11. Update Site Configuration to include new nav item
    const siteConfigs = await environment.getEntries({
      content_type: 'siteConfiguration',
      limit: 1
    })
    
    if (siteConfigs.items.length > 0) {
      const siteConfig = siteConfigs.items[0]
      const currentNav = siteConfig.fields.navigation['en-US'] || []
      
      // Add new nav item to the navigation
      siteConfig.fields.navigation['en-US'] = [
        ...currentNav,
        { sys: { type: 'Link', linkType: 'Entry', id: navItem.sys.id } }
      ]
      
      await siteConfig.update()
      await siteConfig.publish()
      console.log('Updated site configuration with new navigation item')
    }

    console.log('\n✅ Complex page created successfully!')
    console.log('Visit: http://localhost:3000/guide/design-guidelines')

  } catch (error) {
    console.error('Error creating complex page:', error)
  }
}

createComplexPage()