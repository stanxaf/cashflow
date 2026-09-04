import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cashflow Planner",
  description: "Know where your money is today, and where it is going.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

