import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import React from "react";
import {ThemeProvider} from "@/components/theme-provider";
import {Toaster} from "sonner";
import {UserContext} from "@/context/user-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Einsteins Dashboard",
  description: "Dashboard del equipo Einsteins",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
      <link rel="icon" type="image/x-icon" href="/icon.svg"/>
      <title></title>
    </head>

    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    <UserContext.Provider value={null} >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </UserContext.Provider>
    </body>
    </html>
  );
}
