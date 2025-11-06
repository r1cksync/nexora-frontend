import './globals.css';
import LayoutClient from '@/components/LayoutClient';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata = {
  title: 'Nexora - AI-Powered E-Commerce',
  description: 'Shop smart with AI-powered recommendations and intelligent search',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LayoutClient>{children}</LayoutClient>
        </AuthProvider>
      </body>
    </html>
  );
}
