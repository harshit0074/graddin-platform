import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'GRADDIN — Solely Focused on High-Impact Internships',
  description: 'Connect verified tech companies with exceptional student talent. Seamless application tracking and automated AI candidate evaluation ranking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.className}`}>
      <body className="bg-zinc-950 text-zinc-100 min-h-screen antialiased selection:bg-indigo-500 selection:text-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
