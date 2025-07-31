import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { getSiteConfiguration } from '../lib/contentful-dynamic'

interface Props {
  siteConfig: any
}

export default function Home({ siteConfig }: Props) {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the first page in the guide
    if (siteConfig?.fields?.navigation?.[0]?.fields?.page?.fields?.slug) {
      router.push(`/guide/${siteConfig.fields.navigation[0].fields.page.fields.slug}`)
    } else {
      // If no config, redirect to a default page
      router.push('/guide/getting-started')
    }
  }, [siteConfig, router])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '20px' }}>
      <h1>Gantri Quick Start Guide</h1>
      <p>Redirecting to guide...</p>
      <p style={{ marginTop: '20px', fontSize: '14px', color: '#6b7280' }}>
        If you're not redirected, <a href="/guide/getting-started">click here</a>
      </p>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const siteConfig = await getSiteConfiguration()

    return {
      props: {
        siteConfig,
      },
      revalidate: 60,
    }
  } catch (error) {
    return {
      props: {
        siteConfig: null,
      },
    }
  }
}