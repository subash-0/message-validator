import type { Metadata } from "next";
import "../globals.css";
import AuthProvider from "@/context/authProviders";
import { Toaster } from "@/components/ui/sonner"

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
