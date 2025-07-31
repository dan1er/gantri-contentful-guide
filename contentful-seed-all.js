require('dotenv').config({ path: '.env.local' })
const contentfulManagement = require('contentful-management')

async function seedAllContent() {
  console.log('Seeding all content to Contentful...')
  
  const client = contentfulManagement.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
  const environment = await space.getEnvironment('master')

  // Helper function to create rich text
  const createRichText = (text) => ({
    nodeType: 'document',
    data: {},
    content: [
      {
        nodeType: 'paragraph',
        content: [
          {
            nodeType: 'text',
            value: text,
            marks: [],
            data: {}
          }
        ],
        data: {}
      }
    ]
  })

  try {
    // 1. Create Modal for Print Size
    const printSizeModal = await environment.createEntry('modalComponent', {
      fields: {
        title: { 'en-US': 'PRINT SIZE' },
        content: {
          'en-US': createRichText('The maximum size of any printed part must fit between a 250×250×250mm cube (9.8 × 9.8 × 9.8 inches)')
        },
        data: {
          'en-US': {
            dimensions: { width: 250, height: 250, depth: 250, unit: 'mm' }
          }
        }
      }
    })
    await printSizeModal.publish()
    console.log('Created Print Size Modal')

    // 2. Create Product Categories (if they don't exist)
    const categories = [
      { name: 'Table', type: 'Plug-in', order: 1 },
      { name: 'Wall Sconce', type: 'Plug-in and Hardwired', order: 2 },
      { name: 'Floor', type: 'Plug-in', order: 3 },
      { name: 'Clamp', type: 'Plug-in', order: 4 },
      { name: 'Pendant', type: 'Hardwired', order: 5 },
      { name: 'Flush Mount', type: 'Hardwired', order: 6 }
    ]

    const createdCategories = []
    for (const category of categories) {
      try {
        const entry = await environment.createEntry('productCategory', {
          fields: {
            name: { 'en-US': category.name },
            type: { 'en-US': category.type },
            order: { 'en-US': category.order }
          }
        })
        await entry.publish()
        createdCategories.push(entry)
        console.log(`Created product category: ${category.name}`)
      } catch (e) {
        console.log(`Product category ${category.name} might already exist`)
      }
    }

    // 3. Create Manufacturing Process Panel
    const printingPanel = await environment.createEntry('panelComponent', {
      fields: {
        title: { 'en-US': 'Manufacturing Process' },
        items: {
          'en-US': [
            'Printing Parts',
            'Painting Parts',
            'Assembling the Product',
            'Quality Control',
            'Packing and Shipping'
          ]
        },
        hasModal: { 'en-US': true },
        modalContent: {
          'en-US': {
            sys: { type: 'Link', linkType: 'Entry', id: printSizeModal.sys.id }
          }
        }
      }
    })
    await printingPanel.publish()
    console.log('Created Manufacturing Process Panel')

    // 4. Create Constraints Panel
    const constraintsPanel = await environment.createEntry('panelComponent', {
      fields: {
        title: { 'en-US': 'CONSTRAINTS' },
        content: {
          'en-US': createRichText('Design constraints ensure manufacturability')
        }
      }
    })
    await constraintsPanel.publish()
    console.log('Created Constraints Panel')

    // 5. Create Painting Parts Panel
    const paintingPanel = await environment.createEntry('panelComponent', {
      fields: {
        title: { 'en-US': '🔲 Painting Parts' },
        content: {
          'en-US': createRichText('Any unpainted parts are directly sent to the assembly team and stored. Painted parts are sent to the finishing team. Our finishing team sands all incoming parts, primes the parts, and then paints the parts with their final color.')
        }
      }
    })
    await paintingPanel.publish()
    console.log('Created Painting Parts Panel')

    // 6. Create Pages
    // Getting Started Page (already exists, but let's update it)
    const gettingStartedPage = await environment.createEntry('page', {
      fields: {
        title: { 'en-US': 'Getting Started' },
        slug: { 'en-US': 'getting-started' },
        sectionNumber: { 'en-US': 1 },
        content: {
          'en-US': {
            nodeType: 'document',
            data: {},
            content: [
              {
                nodeType: 'paragraph',
                content: [
                  {
                    nodeType: 'text',
                    value: 'This guide will walk you through key education regarding our product offering and manufacturing constraints.',
                    marks: [],
                    data: {}
                  }
                ],
                data: {}
              },
              {
                nodeType: 'paragraph',
                content: [
                  {
                    nodeType: 'text',
                    value: 'Please read it carefully before getting started on your concept ideation',
                    marks: [{ type: 'italic' }],
                    data: {}
                  },
                  {
                    nodeType: 'text',
                    value: ' so that you submit a feasible design that accounts for our constraints.',
                    marks: [],
                    data: {}
                  }
                ],
                data: {}
              }
            ]
          }
        },
        navigationButtons: {
          'en-US': {
            next: { label: 'Product Categories', icon: '→' }
          }
        }
      }
    })
    await gettingStartedPage.publish()
    console.log('Created Getting Started Page')

    // Product Categories Page
    const productCategoriesPage = await environment.createEntry('page', {
      fields: {
        title: { 'en-US': 'Product Categories' },
        slug: { 'en-US': 'product-categories' },
        sectionNumber: { 'en-US': 2 },
        content: {
          'en-US': createRichText('Gantri manufactures the following lighting categories:')
        },
        components: {
          'en-US': createdCategories.map(cat => ({
            sys: { type: 'Link', linkType: 'Entry', id: cat.sys.id }
          }))
        },
        navigationButtons: {
          'en-US': {
            prev: { label: 'Back to Introduction', icon: '←' },
            next: { label: 'How We Manufacture', icon: '→' }
          }
        }
      }
    })
    await productCategoriesPage.publish()
    console.log('Created Product Categories Page')

    // Manufacturing Page
    const manufacturingPage = await environment.createEntry('page', {
      fields: {
        title: { 'en-US': 'How We Manufacture' },
        slug: { 'en-US': 'how-we-manufacture' },
        sectionNumber: { 'en-US': 3 },
        components: {
          'en-US': [
            { sys: { type: 'Link', linkType: 'Entry', id: constraintsPanel.sys.id } },
            { sys: { type: 'Link', linkType: 'Entry', id: printingPanel.sys.id } },
            { sys: { type: 'Link', linkType: 'Entry', id: paintingPanel.sys.id } }
          ]
        },
        navigationButtons: {
          'en-US': {
            prev: { label: 'Back to Product Categories', icon: '←' },
            next: { label: 'Pricing Considerations', icon: '→' }
          }
        }
      }
    })
    await manufacturingPage.publish()
    console.log('Created Manufacturing Page')

    // Pricing Page
    const pricingPage = await environment.createEntry('page', {
      fields: {
        title: { 'en-US': 'Pricing Considerations' },
        slug: { 'en-US': 'pricing-considerations' },
        sectionNumber: { 'en-US': 4 },
        content: {
          'en-US': createRichText('When designing for Gantri, consider these pricing factors that impact the final product cost:')
        },
        navigationButtons: {
          'en-US': {
            prev: { label: 'Back to Manufacturing', icon: '←' },
            next: { label: 'Concept Submission', icon: '→' }
          }
        }
      }
    })
    await pricingPage.publish()
    console.log('Created Pricing Page')

    // Concept Submission Page
    const submissionPage = await environment.createEntry('page', {
      fields: {
        title: { 'en-US': 'Concept Submission' },
        slug: { 'en-US': 'concept-submission' },
        sectionNumber: { 'en-US': 5 },
        content: {
          'en-US': createRichText('Ready to submit your concept? Follow these guidelines to ensure a smooth submission process:')
        },
        navigationButtons: {
          'en-US': {
            prev: { label: 'Back to Pricing', icon: '←' }
          }
        }
      }
    })
    await submissionPage.publish()
    console.log('Created Concept Submission Page')

    // 7. Create Navigation Items
    const navItems = [
      { label: 'Getting Started', order: 1, page: gettingStartedPage },
      { label: 'Product Categories', order: 2, page: productCategoriesPage },
      { label: 'How We Manufacture', order: 3, page: manufacturingPage },
      { label: 'Pricing Considerations', order: 4, page: pricingPage },
      { label: 'Concept Submission', order: 5, page: submissionPage }
    ]

    const createdNavItems = []
    for (const item of navItems) {
      const navEntry = await environment.createEntry('navigationItem', {
        fields: {
          label: { 'en-US': item.label },
          order: { 'en-US': item.order },
          page: {
            'en-US': {
              sys: { type: 'Link', linkType: 'Entry', id: item.page.sys.id }
            }
          },
          isActive: { 'en-US': true }
        }
      })
      await navEntry.publish()
      createdNavItems.push(navEntry)
      console.log(`Created navigation item: ${item.label}`)
    }

    // 8. Create Site Configuration
    const siteConfig = await environment.createEntry('siteConfiguration', {
      fields: {
        siteName: { 'en-US': 'GANTRI' },
        logoSvg: { 'en-US': "data:image/svg+xml,%3csvg%20width='146'%20height='20'%20viewBox='0%200%20146%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_2328_1440)'%3e%3cpath%20d='M0.0703966%207.82182C0.251363%205.74741%200.827776%203.71991%202.27886%202.17164C3.22726%201.16627%204.47727%200.502721%205.82447%200.221217C10.61%20-0.784154%2014.9197%201.66225%2015.0203%206.78629H10.5732C10.8078%203.5691%206.29029%202.69778%205.10731%205.55304C4.38344%207.30238%204.32647%2013.4854%205.46924%2015.0303C6.42434%2016.3239%209.08858%2016.4781%2010.1308%2015.2649C10.5028%2014.8293%2011.2769%2012.3896%2010.6469%2012.3896H7.75813V9.29302H15.1677C15.2783%2013.1469%2014.9097%2017.9962%2010.6536%2019.4674C10.2515%2019.6048%209.33322%2019.8595%208.94447%2019.903H6.87006C6.13614%2019.702%205.41562%2019.6148%204.6951%2019.34C3.40153%2018.8474%202.29562%2017.9292%201.51478%2016.7931C1.12269%2016.2234%200.814371%2015.6%200.596541%2014.9432C0.18769%2013.7099%200.10726%2012.3627%200.0402355%2011.0692C-0.0133843%2010.0135%20-0.0267893%208.90762%200.0670454%207.81847L0.0703966%207.82182Z'%20fill='white'/%3e%3cpath%20d='M43.1842%2011.5048V0.449097H47.333V19.464H43.2579L37.1084%208.26083V19.464H32.9562V0.449097H37.0346L43.1842%2011.5048Z'%20fill='white'/%3e%3cpath%20d='M69.9371%200.449103C72.3969%200.697094%2074.1328%202.13142%2074.3171%204.64485C74.5216%207.45654%2074.3171%2010.3319%2071.2005%2011.2837L75.4968%2019.4674H70.7548L66.8841%2011.5987C66.7869%2011.2267%2066.1602%2011.3574%2066.1602%2011.5786V19.464H61.8606C61.8606%2019.464%2061.8606%200.452454%2061.8606%200.449103C61.8606%200.552991%2069.116%200.365322%2069.9371%200.449103ZM66.1569%208.40829H68.4558C68.5865%208.40829%2069.2836%208.0363%2069.4243%207.89555C70.2487%207.04434%2070.0577%203.8372%2068.6066%203.8372H66.1602V8.40494L66.1569%208.40829Z'%20fill='white'/%3e%3cpath%20d='M15.7644%2019.464L20.302%200.442383L27.0246%200.459139L31.4784%2019.4674H27.0313L26.2002%2016.0692L20.9454%2016.1429L20.2148%2019.4707H15.7678L15.7644%2019.464ZM25.3992%2012.6845L23.546%203.84054L21.6927%2012.6845H25.3992Z'%20fill='white'/%3e%3cpath%20d='M59.9336%200.449097V4.13546H56.8203V19.464H52.3732V4.13546H49.1125V0.449097H59.9336Z'%20fill='white'/%3e%3cpath%20d='M81.5727%200.449097H77.1256V19.464H81.5727V0.449097Z'%20fill='white'/%3e%3cpath%20d='M146%200.438965H83.7474V19.474H146V0.438965Z'%20fill='%2300855B'/%3e%3cpath%20d='M108.087%205.47253L106.623%209.84925L105.155%205.47253H103.55H101.71V14.4438H103.63V6.5885L105.748%2012.7146H107.498L109.616%206.5885V14.4438H111.532V5.47253H109.693H108.087Z'%20fill='white'/%3e%3cpath%20d='M131.281%206.36391C131.281%206.36391%20130.256%205.43896%20128.631%205.47918H123.905V7.19501H124.951V12.7212H123.905V14.437H124.951H126.878H128.631C128.631%2014.437%20130.132%2014.5577%20131.275%2013.5624C131.275%2013.5624%20132.779%2012.4933%20132.779%209.95643C132.779%209.95643%20132.873%207.58376%20131.281%206.36391ZM130.444%2011.6153C129.991%2012.4095%20129.13%2012.7279%20128.272%2012.7179C127.806%2012.7111%20127.34%2012.7179%20126.875%2012.7179V7.19166C127.364%207.19166%20127.853%207.19166%20128.342%207.19166C128.976%207.19166%20129.596%207.37933%20130.072%207.8284C130.333%208.07639%20130.524%208.39476%20130.631%208.74328C130.631%208.74328%20130.826%209.22586%20130.799%209.95643C130.799%209.95643%20130.869%2010.8747%20130.444%2011.6153Z'%20fill='white'/%3e%3cpath%20d='M141.664%207.19508V5.47925H136.392H134.784H134.465V14.4371H134.784H136.392H141.664V12.7213H136.392V10.8144H140.628V9.09858H136.392V7.19508H141.664Z'%20fill='white'/%3e%3cpath%20d='M116.342%205.47925L113.218%2014.4371H115.236L115.829%2012.7213H119.609L120.202%2014.4371H122.22L119.096%205.47925H116.342ZM116.342%2011.0054L117.719%206.61532L119.096%2011.0054H116.342Z'%20fill='white'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_2328_1440'%3e%3crect%20width='146'%20height='19.9063'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e" },
        headerTitle: { 'en-US': 'GANTRI DESIGN SYSTEM/' },
        guideTitle: { 'en-US': 'Quick Start Guide' },
        navigation: {
          'en-US': createdNavItems.map(item => ({
            sys: { type: 'Link', linkType: 'Entry', id: item.sys.id }
          }))
        }
      }
    })
    await siteConfig.publish()
    console.log('Created Site Configuration')

    console.log('All content seeded successfully!')

  } catch (error) {
    console.error('Error seeding content:', error)
  }
}

seedAllContent()