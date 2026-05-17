import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/layout/client-layout";
import { cn } from "@/lib/utils";

const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-sans" 
});

const mono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-mono" 
});

export const metadata: Metadata = {
  title: "FIREWATCH AI | Advanced Surveillance",
  description: "High-precision real-time fire detection and tactical safety analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", outfit.variable, mono.variable)}>
      <body className="bg-ui-bg text-foreground min-h-screen antialiased font-sans">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
