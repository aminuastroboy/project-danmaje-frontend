import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Dan Maje",
  description: "Digital vending frontend by Astrovia Systems"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
