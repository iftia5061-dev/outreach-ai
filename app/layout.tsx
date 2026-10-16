import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OutreachAI - AI-Powered Sales Outreach Platform",
  description: "Scale your sales outreach with AI-powered email, WhatsApp, LinkedIn, and telephone automation. Manage prospects, campaigns, and meetings in one platform.",
  keywords: ["sales outreach", "AI automation", "email marketing", "WhatsApp marketing", "LinkedIn automation", "CRM"],
  authors: [{ name: "OutreachAI" }],
  creator: "OutreachAI",
  publisher: "OutreachAI",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://outreach-ai.vercel.app",
    title: "OutreachAI - AI-Powered Sales Outreach Platform",
    description: "Scale your sales outreach with AI-powered automation",
    siteName: "OutreachAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "OutreachAI - AI-Powered Sales Outreach Platform",
    description: "Scale your sales outreach with AI-powered automation",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
