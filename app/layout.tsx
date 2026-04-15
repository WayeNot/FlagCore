import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NotifProvider } from "@/components/NotifProvider";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "CTF Platform",
    description: "Plateforme de CTF créée par des B1 en cybersécurité | Nantes Ynov Campus",
    keywords: ["CTF", "cybersecurity", "hacking", "Ynov"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
            <body className="min-h-full flex flex-col">
                <NotifProvider>
                    {children}
                    <Footer/>
                </NotifProvider>
            </body>
        </html>
    );
}