import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Synapse",
  description:
    "Local Project Synapse runtime for Dr. Ponz assessments, mediated analysis, and dashboard review.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
