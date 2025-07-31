import Link from 'next/link'

export default function Custom404() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>404</h1>
      <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#374151' }}>Page Not Found</h2>
      <p style={{ marginBottom: '30px', color: '#6b7280' }}>
        The page you're looking for doesn't exist or hasn't been created yet.
      </p>
      <Link href="/" style={{
        backgroundColor: '#000',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '6px',
        textDecoration: 'none',
        display: 'inline-block'
      }}>
        Go to Home
      </Link>
    </div>
  )
}