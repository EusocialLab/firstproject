interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-CN">
      <body style={{ margin: 0, padding: 0, minHeight: '100vh' }}>{children}</body>
    </html>
  );
}
