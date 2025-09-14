import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import AuthProvider from "@/context/authProviders";
import { Toaster } from "@/components/ui/sonner"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Session Message",
  description: "Share the secrete with secrete agent",
  icons: {
    icon: "/logo.jpg", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   
      <AuthProvider>

     
        {children}
          <Toaster  position="top-center"  />
    
    
        </AuthProvider>
  
  );
}
