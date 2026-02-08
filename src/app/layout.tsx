import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

import '../styles/globals.scss';

import ValidationHeader from '../components/Header/components/ValidationHeader/ValidationHeader';

const inter = Inter({
  weight: ['200', '400', '500', '600', '700', '900'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Slack Bot Web',
  description: 'Web interface for your Slack Bot',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${inter.variable} `}>
      <body>
        <ValidationHeader />
        {children}
      </body>
    </html>
  );
}
