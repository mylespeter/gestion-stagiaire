import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AuthGuard } from '@/components/AuthGuard';
import { ToastContainer } from '@/components/ui/Toast'


export const metadata: Metadata = {
  title: "StageFlow",
  description: "System de gestion des stagiaires",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={` antialiased`}>
        <AuthProvider>
                <AuthGuard>
          <main>{children}</main>
                </AuthGuard>
            <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}