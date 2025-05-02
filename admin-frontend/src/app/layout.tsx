import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/fonts.css"; // Import fonts.css
import Sidebar from "@/components/molecules/side-bar/side-bar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Frontend",
  description: "Admin dashboard for VPass",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex">
          <Sidebar role="super-admin" />{" "}
          {/* Replace "super-admin" with dynamic role if needed */}
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}