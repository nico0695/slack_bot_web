import { Inter } from 'next/font/google';

import '../styles/globals.scss';

import ValidationHeader from '../components/Header/components/ValidationHeader/ValidationHeader';

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
        <ValidationHeader />
        {children}
      </body>
    </html>
  );
}
