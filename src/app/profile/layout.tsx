import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestion Utilisateurs",
  description: "Traçabilité pharmaceutique",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <main>{children}</main>    
    </>
   
  );
}