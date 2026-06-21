export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        width: '100%',
        margin: 0,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: "url('/legacy-sky.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        color: '#f8fafc'
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(5, 8, 22, 0.55)',
          zIndex: 0
        }}
      />
      <section
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '980px',
          width: '100%',
          padding: '2rem',
          textAlign: 'center'
        }}
      >
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Legacy Sky</h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#cbd5e1' }}>
          这是 Legacy Sky 的展示页面。图像被设置为覆盖整个视口背景，并且文本保持在图层之上。
        </p>
      </section>
    </main>
  )
}
