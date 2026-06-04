import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { WalletProvider } from '@/contexts/WalletContext';
import { SkeletonThemeWrapper } from '@/components/ui/SkeletonThemeWrapper';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Web3 Student Lab',
  description:
    'An open-source educational platform for blockchain, smart contracts, open-source collaboration, and hackathon project development.',
};

import { KeyboardShortcutsProvider } from '@/components/keyboard/KeyboardShortcutsProvider';
import Navbar from '@/components/layout/Navbar';
import ResiliencyBanner from '@/components/layout/ResiliencyBanner';
import { CourseNotificationListener, ToastContainer } from '@/components/notifications';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { Web3OnboardingProvider } from '@/contexts/Web3OnboardingContext';
import { SkipLink } from '@/components/ui/SkipLink';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('web3-lab-theme');
                  var isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-background text-foreground min-h-screen antialiased">
        <ThemeProvider>
          <WalletProvider>
            <AuthProvider>
              <I18nProvider>
                <NotificationProvider>
                  <Web3OnboardingProvider>
                    <SkipLink
                      targets={[
                        { id: 'main-content', label: 'Skip to main content' },
                        { id: 'primary-navigation', label: 'Skip to navigation' },
                      ]}
                    />
                    <Navbar />
                    <ResiliencyBanner />
                    <main id="main-content" className="flex-grow outline-none" tabIndex={-1}>
                      {children}
                    </main>
                    <ToastContainer />
                  </Web3OnboardingProvider>
                </NotificationProvider>
              </I18nProvider>
            </AuthProvider>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
