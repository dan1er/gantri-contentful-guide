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
    }
  }, [siteConfig, router])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <p>Redirecting to guide...</p>
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