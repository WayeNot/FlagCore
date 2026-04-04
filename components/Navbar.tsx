"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaNewspaper } from "react-icons/fa";
import { MdExitToApp } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showPaper, setShowPaper] = useState(false)

    const news = [
        { title: "Déploiement", text: "..." },
        { title: "Update", text: "..." }
    ]

    useEffect(() => {
        const handleClick = (e) => {
            if (e.target.id === "overlay") setShowPaper(false)
        }
        document.addEventListener("click", handleClick)
        return () => document.removeEventListener("click", handleClick)
    }, [])

    const handleLogout = async (e: any) => {
        const res = await fetch("/api/session", {
            method: "DELETE",
        })

        if (res.ok) {
            const router = useRouter();
            router.refresh()
        }
    }

    return (
        <div>
            <nav className="flex items-center justify-between p-4 mx-3 sm:mx-5">
                <div className="flex items-center justify-center gap-3 text-white/40">
                    <h1 className="text-xl sm:text-2xl text-white/60 font-bold">CTF CyberLab</h1>
                    <FaNewspaper onClick={() => setShowPaper(!showPaper)} className="hover:text-white/70 cursor-pointer text-xl transition duration-500" />
                </div>

                <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden text-white text-2xl">☰</button>

                <div className="hidden sm:flex items-center gap-5 text-white/40">
                    <Link href="/Pages/home" className="hover:text-white/70 cursor-pointer transition duration-500">Accueil</Link>
                    <Link href="/Pages/challenges" className="hover:text-white/70 cursor-pointer transition duration-500">Nos challenges</Link>
                    <Link href="/Pages/accounts" className="hover:text-white/70 cursor-pointer transition duration-500">Mon compte</Link>
                    <MdExitToApp onClick={handleLogout} className="hover:text-white/70 cursor-pointer text-xl transition duration-500" />
                </div>
            </nav>
            {menuOpen && (
                <div className="sm:hidden px-4 pb-4 animate-fadeIn">
                    <div className="flex flex-col gap-3">
                        <button className="w-full text-left px-4 py-3 rounded-lg bg-[#2a2a3d] text-white/70 hover:bg-[#3a3a4d] transition">Nos challenges</button>
                        <button className="w-full text-left px-4 py-3 rounded-lg bg-[#2a2a3d] text-white/70 hover:bg-[#3a3a4d] transition">Mon compte</button>
                        <button className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"><MdExitToApp />Déconnexion</button>
                    </div>
                </div>
            )}
            {showPaper && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6 animate-fadeIn">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">PatchNotes</h2>
                            <button onClick={() => setShowPaper(!showPaper)} className="text-gray-400 hover:text-white transition cursor-pointer">✕</button>
                        </div>
                        <hr className="my-5 text-white" />
                        <div className="flex items-center flex-col gap-5">
                            {news.map((el) => (
                                <div key={el.title} className="flex flex-col justify-between items-center mb-4 w-full">
                                    <h2 className="text-xl font-bold text-white">{el.title}</h2>
                                    <p className="w-full mt-4 px-4 py-2 rounded-lg bg-[#2a2a3d] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">{el.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}