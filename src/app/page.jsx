export default function HomePage() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: '#050816',
      color: '#f8fafc'
    }}>
      <section style={{
        maxWidth: '980px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Legacy Sky</h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#cbd5e1' }}>
          这是 Legacy Sky 的展示页面。下面显示了项目中的 Legacy Sky 图像。
        </p>
        <div style={{
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 80px rgba(15, 23, 42, 0.45)',
          background: '#0b1124'
        }}>
          <img
            src="/legacy-sky.png"
            alt="Legacy Sky"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </section>
    </main>
  )
}
