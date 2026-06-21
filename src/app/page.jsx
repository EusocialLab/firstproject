const twinkleStars = [
  { top: '14.56%', left: '26.67%', size: 3, delay: '0s', duration: '3.2s' },
  { top: '15.52%', left: '37.56%', size: 3, delay: '0.5s', duration: '3.6s' },
  { top: '13.82%', left: '44.68%', size: 3, delay: '1s', duration: '3.1s' },
  { top: '34.01%', left: '54.31%', size: 4, delay: '1.4s', duration: '3.8s' },
  { top: '58.24%', left: '33.79%', size: 4, delay: '0.8s', duration: '3.4s' },
  { top: '60.26%', left: '62.92%', size: 4, delay: '1.8s', duration: '3.7s' }
];

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        width: '100%',
        margin: 0,
        padding: 0,
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: "url('/legacy-sky.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.75); }
        }
      `}</style>

      {twinkleStars.map((star, index) => (
        <span
          key={index}
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
            animation: `twinkle ${star.duration} ease-in-out infinite`,
            animationDelay: star.delay,
            pointerEvents: 'none'
          }}
        />
      ))}
    </main>
  );
}
