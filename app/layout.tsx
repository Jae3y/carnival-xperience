import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';

const inter = Inter({ subsets: ['latin'] });

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://carnivalxperience.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'CarnivalXperience - Africa\'s Biggest Street Party Companion',
    template: '%s | CarnivalXperience',
  },
  description: 'Discover events, book hotels, navigate parade routes, and stay safe with your AI concierge at the Calabar Carnival in Cross River State, Nigeria.',
  keywords: [
    'Calabar Carnival',
    'Calabar Carnival 2026',
    'Cross River State',
    'Africa Biggest Street Party',
    'Nigerian tourism',
    'Calabar hotels',
    'Calabar events',
    'Millennium Park Calabar',
    'U.J. Esuene Stadium',
    'Mary Slessor Avenue',
  ],
  authors: [{ name: 'CarnivalXperience Team' }],
  creator: 'CarnivalXperience',
  publisher: 'CarnivalXperience',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'CarnivalXperience - Your Ultimate Calabar Carnival Companion',
    description: 'Discover events, book hotels, navigate parade routes, and stay safe at Africa\'s Biggest Street Party.',
    url: baseUrl,
    siteName: 'CarnivalXperience',
    locale: 'en_NG',
    type: 'website',
    images: [
      {
        url: '/icons/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'CarnivalXperience Mask Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CarnivalXperience - Calabar Carnival Digital Companion',
    description: 'Explore Africa\'s Biggest Street Party with real-time maps, hotel booking, event countdowns, and safety hubs.',
    images: ['/icons/icon-512x512.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Festival',
      '@id': `${baseUrl}/#festival`,
      name: 'Calabar Carnival',
      alternateName: "Africa's Biggest Street Party",
      description: 'Annual month-long cultural street festival featuring colourful band pageants, international concerts, food, and masquerades in Calabar, Cross River State, Nigeria.',
      startDate: '2026-12-01T18:00:00+01:00',
      endDate: '2026-12-31T23:59:59+01:00',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: {
        '@type': 'Place',
        name: 'Calabar Metropolis & U.J. Esuene Stadium',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Calabar',
          addressRegion: 'Cross River State',
          addressCountry: 'NG',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 4.9757,
          longitude: 8.3417,
        },
      },
      organizer: {
        '@type': 'Organization',
        name: 'Cross River State Carnival Commission',
        url: baseUrl,
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: 'CarnivalXperience',
      inLanguage: 'en-NG',
      publisher: {
        '@type': 'Organization',
        name: 'CarnivalXperience',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/icons/icon-512x512.png`,
        },
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-amber-400 focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:uppercase focus:tracking-wider focus:text-black focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          Skip to main content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
