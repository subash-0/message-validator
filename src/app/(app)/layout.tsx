import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/footer";


export const metadata: Metadata = {
  title: "Home | Session Message",
  description: "One of the best mystry message",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   
     
      <div
      
        >
          <Navbar />
        {children}
        <Footer />
      </div>
    
  
  );
}
