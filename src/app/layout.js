import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata = {
  title: 'Wishify – Create Beautiful Personalized Greeting Cards',
  description: 'Design stunning personalized greeting cards with your photo and name. Share on WhatsApp, Instagram, and more.',
  keywords: 'greeting cards, birthday cards, personalized wishes, share greetings',
};

export const viewport = { themeColor: '#08090f' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
