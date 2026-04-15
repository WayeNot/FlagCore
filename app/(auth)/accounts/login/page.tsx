"use client";

import { useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { MdAccountBox } from "react-icons/md";
import { useRouter } from 'next/navigation'
import { useNotif } from "@/components/NotifProvider"

export default function Home() {
    const { showNotif } = useNotif()
    const [credentials, setCredentials] = useState({ username: "", password: "" })
    const router = useRouter();

    const handleLogin = async (e: any) => {
        e.preventDefault();
        const res = await fetch("/api/account/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: credentials.username, password: credentials.password })
        })

        if (!res.ok) {
            const err = await res.json()
            showNotif(err.error, "error")           
            return
        }

        router.push("/")
    }

    const handleRedirect = () => {
        router.push("/accounts/register")
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6 animate-fadeIn">
                <div>
                    <h2 className="text-xl font-bold text-white text-center w-full mb-4">Connexion</h2>
                    <hr className="text-white w-4/5 my-5 m-auto" />
                    <div className="flex flex-col items-center w-full gap-4">
                        <div className="flex flex-col items-center justify-center gap-1 w-full">
                            <input value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} className="border-2 border-white/40 rounded-[8px] w-4/5 text-white/80 p-[6px]" placeholder="Nom d'utilisateur" type="text" />
                            <input value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} className="border-2 border-white/40 rounded-[8px] w-4/5 text-white/80 p-[6px]" placeholder="Mot de passe" type="password" />
                        </div>
                        <button onClick={(e) => handleLogin(e)} className="cursor-pointer flex items-center justify-center gap-3 border-2 border-white/40 text-white/40 rounded-[8px] w-4/5 p-[8px] hover:bg-white/40 hover:border-white/40 hover:text-white transition duration-500">Suivant<BsArrowRight /></button>
                        <p onClick={() => handleRedirect()} className="flex items-center gap-3 text-white/30 hover:underline transition duration-500 cursor-pointer hover:text-white"><MdAccountBox />Créer un compte</p>
                    </div>
                </div>
            </div>
        </div>
    );
}