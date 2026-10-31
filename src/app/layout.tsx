import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Criico Cricket",
  description: "Cricket team management application",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className="min-h-screen bg-slate-950 text-slate-100 antialiased"
      >
        {children}
      </body>
    </html>
  );
}
