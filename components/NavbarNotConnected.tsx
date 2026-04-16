"use client"

import { useRouter } from "next/navigation"

import { useNotif } from "./NotifProvider"
import { useState } from "react"
import { CiCircleRemove } from "react-icons/ci"
import { BsArrowRight } from "react-icons/bs"

export default function NavbarNotConnected() {

    const { showNotif } = useNotif()
    const router = useRouter();

    const [menuOpen, setMenuOpen] = useState(false)

    const [displayLogin, setDisplayLogin] = useState(false)
    const [login, setLogin] = useState({ code: "", username: "", password: "" })

    const handleLogin = async () => {
        const res = await fetch("/api/admin/dev/loginSession", {
            method: "POST",
            body: JSON.stringify({ username: login.username, password: login.password })
        })
        if (!res.ok) {
            const err = await res.json()
            showNotif(err.error)
            return
        }
        setDisplayLogin(false)
        router.refresh()
        router.push("/")
    }

    return (
        <div>
            <nav className="flex items-center justify-between p-4 sm:mx-5">
                <div className="flex items-center gap-3 text-white/40">
                    <h1 className="text-xl h-fit sm:text-2xl text-white/60 font-mono">FlagCore</h1>
                </div>

                <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden text-white text-2xl">☰</button>

                <div className="hidden sm:flex items-center gap-5 text-white/40">
                    <button onClick={() => setDisplayLogin(true)} className="hover:text-white/70 transition duration-500 cursor-pointer">Connexion</button>
                </div>
            </nav>

            {menuOpen && (
                <div className="sm:hidden px-4 pb-4 animate-fadeIn">
                    <div className="flex flex-col gap-3">
                        <button onClick={() => setDisplayLogin(true)} className="w-full text-left px-4 py-3 rounded-lg text-white/70 hover:bg-[#3a3a4d] transition duration-500">Connexion</button>
                    </div>
                </div>
            )}
            {displayLogin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3 w-full max-w-md bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6 animate-fadeIn">
                        <div className="relative w-full flex justify-center">
                            <h2 className="text-xl font-bold text-white">Connexion administrateur</h2>
                            <button onClick={() => setDisplayLogin(false)} className="absolute right-0 top-0 text-white/60 hover:text-red-500 transition duration-500 cursor-pointer"><CiCircleRemove size={30} /></button>
                        </div>
                        <hr className="text-white/40 my-3 w-1/2 m-auto" />
                        <div className="flex flex-col items-center w-full gap-4">
                            <div className="flex flex-col items-center justify-center gap-1 w-full">
                                <input value={login.username} onChange={(e) => setLogin({ ...login, username: e.target.value })} className="border-2 border-white/40 rounded-[8px] w-4/5 text-white/80 p-[6px]" placeholder="Nom d'utilisateur" type="text" />
                                <input value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} className="border-2 border-white/40 rounded-[8px] w-4/5 text-white/80 p-[6px]" placeholder="Mot de passe" type="password" />
                            </div>
                            <button onClick={() => handleLogin()} className="cursor-pointer flex items-center justify-center gap-3 border-2 border-white/40 text-white/40 rounded-[8px] w-4/5 p-[8px] hover:bg-white/40 hover:border-white/40 hover:text-white transition duration-500">Suivant<BsArrowRight /></button>
                        </div>
                    </div>
                </div>
            )}
            <div className="border-b border-gray-700/50"></div>
        </div>
    )
}