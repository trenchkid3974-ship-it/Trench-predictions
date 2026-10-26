
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trench Predictions",
  description:
    "Football match probabilities for goals, BTTS and 1X2.",
  manifest: "/manifest.json",
  applicationName: "Trench Predictions"
};

export const viewport: Viewport = {
  themeColor: "#0b1512",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
