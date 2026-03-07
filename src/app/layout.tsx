import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ØΞ AI - AI Assistant for Creators",
  description: "Generate viral content ideas, scripts, captions, and hooks with AI-powered assistance for content creators.",
  keywords: ["AI", "content creator", "viral content", "TikTok", "YouTube", "Instagram", "scripts", "captions"],
  authors: [{ name: "ØΞ AI" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "ØΞ AI - AI Assistant for Creators",
    description: "Generate viral content ideas, scripts, captions, and hooks with AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
