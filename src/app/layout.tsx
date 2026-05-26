import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/**
 * Space Grotesk — a geometric sans with a technical, aerospace feel.
 * Perfect for a hackathon project called "SpaceHack".
 */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

/**
 * JetBrains Mono — a monospace font designed for reading data.
 * Used for ticker numbers, stat values, and code-like labels.
 */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SpaceHack 2026 — Net-Zero Supply Chain Corridor",
  description:
    "A solar-powered electric rail corridor replacing high-emission shipping reroutes around the Cape of Good Hope. Built for SpaceHack for Sustainability 2026.",
  keywords: [
    "net zero",
    "sustainability",
    "electric rail",
    "solar energy",
    "supply chain",
    "Strait of Hormuz",
    "carbon emissions",
    "SpaceHack 2026",
  ],
  openGraph: {
    title: "SpaceHack 2026 — Net-Zero Supply Chain Corridor",
    description:
      "A solar-powered electric rail corridor replacing high-emission shipping reroutes around the Cape of Good Hope. Built for SpaceHack for Sustainability 2026.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚄</text></svg>"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
