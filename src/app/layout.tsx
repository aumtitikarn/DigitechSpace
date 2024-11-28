import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import {AuthProvider} from "./Provider"
import NotificationProvider from "./components/NotificationProvider"


const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['400', '700'], // Specify the weights you want to use
});
export const metadata: Metadata = {
  title: "Digitech Space",
  description: "Suranaree of Technology university",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body className={notoSansThai.className}>
        <AuthProvider>
        <NotificationProvider>
        {children}
        </NotificationProvider>
        </AuthProvider>
        </body>
    </html>
  );
}