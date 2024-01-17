import { Inter } from 'next/font/google';

import Header from '../components/Header/Header';

import '../styles/globals.scss';

const inter = Inter({
  weight: ['200', '400', '500', '600', '700', '900'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${inter.variable} `}>
      <head />

      <body>
        <Header />

        <div className="main-container">{children}</div>
      </body>
    </html>
  );
}
