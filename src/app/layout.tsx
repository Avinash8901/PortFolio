import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const interTight = localFont({
  src: "../fonts/inter-tight.woff2",
  variable: "--font-inter-tight",
  weight: "100 900",
  display: "swap",
  preload: true,
});

const instrumentSerif = localFont({
  src: [
    { path: "../fonts/instrument-serif-regular.woff2", style: "normal", weight: "400" },
    { path: "../fonts/instrument-serif-italic.woff2", style: "italic", weight: "400" },
  ],
  variable: "--font-instrument-serif",
  display: "swap",
  preload: true,
});

const jetBrainsMono = localFont({
  src: "../fonts/jetbrains-mono.woff2",
  variable: "--font-jetbrains-mono",
  weight: "100 800",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Avinash Batchu — Backend Software Engineer",
  description:
    "Backend Software Engineer with 3+ years of experience building enterprise platforms and backend services.",
  openGraph: {
    title: "Avinash Batchu — Backend Software Engineer",
    description:
      "Backend Software Engineer with 3+ years of experience building enterprise platforms and backend services.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Avinash Batchu" }],
    type: "website",
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#f4f2ee" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${interTight.variable} ${instrumentSerif.variable} ${jetBrainsMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
