export const dynamic = "force-dynamic"

import "./globals.css"

import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import NavbarNotConnected from "@/components/NavbarNotConnected"
import { NotifProvider } from "@/components/NotifProvider"
import { cookies } from "next/headers"

export default async function RootLayout({ children }) {
    const cookieStore = await cookies()
    const session = cookieStore.get("session_id")?.value

    console.log("Render now !");

    return (
        <html>
            <body className="min-h-screen flex flex-col">
                <NotifProvider>
                    {session ? <Navbar /> : <NavbarNotConnected />}
                    <main className="flex-1">{children}</main>
                    <Footer />
                </NotifProvider>
            </body>
        </html>
    )
}