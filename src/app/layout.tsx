import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Customer Support Portal - Justice League Demo',
  description: 'A production-ready customer support portal built with the Justice League multi-agent system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
