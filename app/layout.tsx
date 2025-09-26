import './globals.css';
import { Providers } from './providers';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

export const metadata = {
  title: 'Will You Marry Me, Khushi?',
  description: 'A romantic marriage proposal from Krishn to Khushi',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <I18nextProvider i18n={i18n}>
          <Providers>{children}</Providers>
        </I18nextProvider>
      </body>
    </html>
  );
}
