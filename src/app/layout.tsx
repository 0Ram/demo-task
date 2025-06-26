import { ClerkProvider } from '@clerk/nextjs';
import { Toast } from '@/components/ui/toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
          <Toast />
        </body>
      </html>
    </ClerkProvider>
  );
}