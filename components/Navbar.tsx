"use client"

import Link from "next/link"
import { useState } from "react"
import { FaNewspaper } from "react-icons/fa"
import { MdExitToApp } from "react-icons/md"
import { useRouter } from "next/navigation"

import PatchNote from "@/components/PatchNote"

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [showPaper, setShowPaper] = useState(false)

    const router = useRouter()

    const handleLogout = async () => {
        const res = await fetch("/api/session", {
            method: "DELETE",
        })

        if (res.ok) {
            router.refresh()
        }
    }

    return (
        <div>
            <nav className="flex items-center justify-between p-4 mx-3 sm:mx-5">

                <div className="flex items-center gap-3 text-white/40">
                    <h1 className="text-xl sm:text-2xl text-white/60 font-bold">CTF Platform</h1>
                    <FaNewspaper onClick={() => setShowPaper(true)} className="hover:text-white/70 cursor-pointer text-xl transition duration-300"/>
                </div>

                <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden text-white text-2xl">☰</button>

                <div className="hidden sm:flex items-center gap-5 text-white/40">
                    <Link href="/home" className="hover:text-white/70 transition">Accueil</Link>
                    <Link href="/challenges" className="hover:text-white/70 transition">Nos challenges</Link>
                    <Link href="/accounts" className="hover:text-white/70 transition">Mon compte</Link>
                    <MdExitToApp onClick={handleLogout} className="hover:text-red-400 cursor-pointer text-xl transition"/>
                </div>
            </nav>

            {menuOpen && (
                <div className="sm:hidden px-4 pb-4 animate-fadeIn">
                    <div className="flex flex-col gap-3">
                        <Link href="/challenges"><button className="w-full text-left px-4 py-3 rounded-lg text-white/70 hover:bg-[#3a3a4d] transition">Nos challenges</button></Link>
                        <Link href="/accounts"><button className="w-full text-left px-4 py-3 rounded-lg bg-[#2a2a3d] text-white/70 hover:bg-[#3a3a4d] transition">Mon compte</button></Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"><MdExitToApp />Déconnexion</button>
                    </div>
                </div>
            )}
            <PatchNote show={showPaper} setShow={setShowPaper} />
        </div>
    )
}