import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";
import { FunnelTracker } from "@/components/FunnelTracker";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "An Mệnh - Thấu Hiểu Vận Mệnh, Kiến Tạo Bình An",
  description: "Ứng dụng xem tử vi, phong thủy, lịch vạn niên hiện đại theo phong cách Zen.",
  icons: {
    icon: "/favicon.svg",
    apple: "/logo.svg",
  },
};

import { UserProvider } from "@/context/UserContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
         <UserProvider>
           <Suspense fallback={null}>
             <FunnelTracker />
           </Suspense>
           <Layout>{children}</Layout>
         </UserProvider>

      </body>
    </html>
  );
}
