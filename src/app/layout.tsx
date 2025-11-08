import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/providers/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gitify - Generate Realistic Git History from 2008-2025",
  description:
    "✨ Make your GitHub profile shine! Generate authentic-looking commit histories from 2008-2025. AI-generated commits • Realistic patterns • Professional timelines. Perfect for bootcamp grads, job seekers, and portfolios.",
  keywords:
    "git history, github commits, AI commits, backdate commits, portfolio projects, job seeker github, bootcamp projects",
  authors: [{ name: "Gitify" }],
  creator: "Gitify",
  publisher: "Gitify",
  robots: "index, follow",
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lunaa-beta.vercel.app/",
    title: "Gitify - Generate Realistic Git History from 2008-2025",
    description:
      "✨ Make your GitHub profile shine! Generate authentic-looking commit histories from 2008-2025. AI-generated commits • Realistic patterns • Professional timelines.",
    siteName: "Gitify",
    images: [
      {
        url: "/og-image.png", // Make sure this file exists in /public
        width: 1200,
        height: 630,
        alt: "Gitify - AI-Powered Git Commit History Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gitify - Generate Realistic Git History from 2008-2025",
    description:
      "✨ Make your GitHub profile shine! Generate authentic-looking commit histories from 2008-2025.",
    images: ["/og-image.png"], // Same image as Open Graph
    creator: "@gitify", // Optional: Add your Twitter handle
  },
  manifest: "/manifest.json", // Optional: for PWA
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
