"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { MdAdminPanelSettings, MdExitToApp } from "react-icons/md"
import { useRouter } from "next/navigation"

import AdminPanel from "./AdminPanel"
import { useNotif } from "./NotifProvider"
import { User } from "@/lib/types"
import { staff_role } from "@/lib/config"

export default function Navbar() {
    const router = useRouter()
    const { showNotif } = useNotif()

    const [menuOpen, setMenuOpen] = useState(false)
    const [userSession, setUserSession] = useState<User | null>(null)
    const [showAdminPanel, setShowAdminPanel] = useState(false)

    useEffect(() => {        
        async function getSession() {
            console.log("Get Session NavBar !");
            
            const res = await fetch("/api/auth/session")
            if (!res.ok) {
                showNotif(await res.text())
                return
            }
            setUserSession(await res.json())
        }
        getSession()
    }, [])

    const handleLogout = async () => {
        const res = await fetch("/api/auth/account/logout", {
            method: "POST",
        })

        if (!res.ok) {
            const err = await res.json()
            showNotif(err.error)
            return
        }
        router.refresh()
        router.push("/accounts/login")
    }

    return (
        <div>
            <nav className="flex items-center justify-between p-4 sm:mx-5">
                <div className="flex items-center gap-3 text-white/40">
                    <h1 className="text-xl h-fit sm:text-2xl text-white/60 font-mono">FlagCore</h1>
                    {userSession?.role && staff_role.includes(userSession.role) && (
                        <MdAdminPanelSettings onClick={() => setShowAdminPanel(true)} className="text-red-500 font-bold text-[22px] hover:text-red-800 transition duration-500 cursor-pointer" />
                    )}
                </div>

                <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden text-white text-2xl">☰</button>

                <div className="hidden sm:flex items-center gap-5 text-white/40">
                    <Link href="/" className="hover:text-white/70 transition duration-500">Accueil</Link>
                    <Link href="/tools" className="hover:text-white/70 transition duration-500">Tools</Link>
                    <Link href="/challenges" className="hover:text-white/70 transition duration-500">Nos challenges</Link>
                    <Link href="/accounts" className="hover:text-white/70 transition duration-500">Mon compte</Link>
                    <MdExitToApp onClick={handleLogout} className="hover:text-red-400 cursor-pointer text-xl transition duration-500" />
                </div>
            </nav>

            {menuOpen && (
                <div className="sm:hidden px-4 pb-4 animate-fadeIn">
                    <div className="flex flex-col gap-3">
                        <Link href="/"><button className="w-full text-left px-4 py-3 rounded-lg text-white/70 hover:bg-[#3a3a4d] transition duration-500">Accueil</button></Link>
                        <Link href="/tools"><button className="w-full text-left px-4 py-3 rounded-lg text-white/70 hover:bg-[#3a3a4d] transition duration-500">Tools</button></Link>
                        <Link href="/challenges"><button className="w-full text-left px-4 py-3 rounded-lg text-white/70 hover:bg-[#3a3a4d] transition duration-500">Nos challenges</button></Link>
                        <Link href="/accounts"><button className="w-full text-left px-4 py-3 rounded-lg bg-[#2a2a3d] text-white/70 hover:bg-[#3a3a4d] transition duration-500">Mon compte</button></Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition duration-500"><MdExitToApp />Déconnexion</button>
                    </div>
                </div>
            )}
            {showAdminPanel && <AdminPanel closePanel={() => setShowAdminPanel(false)} />}
            <div className="border-b border-gray-700/50"></div>
        </div>
    )
}