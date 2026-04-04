"use client";

import { useEffect, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { MdAccountBox } from "react-icons/md";

export default function Home() {
    const [modal, setModal] = useState({ display: false, login: false })
    const [credentials, setCredentials] = useState({ username: "", mail: "", password: "" })
    const [userSession, setUserSession] = useState({ userData: [] })

    useEffect(() => {
        async function getSession() {
            const res = await fetch("/api/session", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })

            if (!res.ok) {
                console.error('Impossible de GET la session')
                return
            }
            setUserSession(await res.json())
        }
        getSession()
    }, [])

    const handleRegister = async (e: any) => {
        e.preventDefault();
        await fetch("/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: credentials.username, mail: credentials.mail, password: credentials.password })
        })
        setModal({ ...modal, display: false })
    }

    return (
        <div>
            {userSession && userSession.userData && userSession.userData.length > 0 && (
                <div>
                    <h2>Bienvenue {userSession.userData[0].username}</h2>
                </div>
            )}
            <div>
                <a href="/Pages/ctf/phishout">Phishout</a>
                <button onClick={() => setModal({ display: true, login: true })}>Connexion</button>
            </div>
            {modal.display || !userSession && (
                <div>
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                        <div className="w-full max-w-md bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6 animate-fadeIn">
                            {modal.login && (
                                <div>
                                    <h2 className="text-xl font-bold text-white text-center w-full mb-4">Connexion</h2>
                                    <hr className="text-white w-4/5 my-5 m-auto" />
                                    <div className="flex flex-col items-center w-full gap-4">
                                        <div className="flex flex-col items-center justify-center gap-1 w-full">
                                            <input value={credentials.mail} onChange={(e) => setCredentials({ ...credentials, mail: e.target.value })} className="border-2 border-white/40 rounded-[8px] w-4/5 text-white/80 p-[6px]" placeholder="Adresse mail" type="email" />
                                            <input value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} className="border-2 border-white/40 rounded-[8px] w-4/5 text-white/80 p-[6px]" placeholder="Mot de passe" type="password" />
                                        </div>
                                        <button className="cursor-pointer flex items-center justify-center gap-3 border-2 border-white/40 text-white/40 rounded-[8px] w-4/5 p-[8px] hover:bg-white/40 hover:border-white/40 hover:text-white transition duration-500">Suivant<BsArrowRight /></button>
                                        <p onClick={() => setModal({ display: true, login: false })} className="flex items-center gap-3 text-white/30 hover:underline transition duration-500 cursor-pointer hover:text-white"><MdAccountBox />Créer un compte</p>
                                    </div>
                                </div>
                            )}
                            {!modal.login && (
                                <div>
                                    <h2 className="text-xl font-bold text-white text-center w-full mb-4">Création de compte</h2>
                                    <hr className="text-white w-4/5 my-5 m-auto" />
                                    <div className="flex flex-col items-center w-full gap-4">
                                        <div className="flex flex-col items-center justify-center gap-1 w-full">
                                            <input value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} className="border-2 border-white/40 rounded-[8px] w-4/5 text-white/80 p-[6px]" placeholder="Nom d'utilisateur" type="text" />
                                            <input value={credentials.mail} onChange={(e) => setCredentials({ ...credentials, mail: e.target.value })} className="border-2 border-white/40 rounded-[8px] w-4/5 text-white/80 p-[6px]" placeholder="Adresse mail" type="email" />
                                            <input value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} className="border-2 border-white/40 rounded-[8px] w-4/5 text-white/80 p-[6px]" placeholder="Mot de passe" type="password" />
                                        </div>
                                        <button onClick={(e) => handleRegister(e)} className="cursor-pointer flex items-center justify-center gap-3 border-2 border-white/40 text-white/40 rounded-[8px] w-4/5 p-[8px] hover:bg-white/40 hover:border-white/40 hover:text-white transition duration-500">Suivant<BsArrowRight /></button>
                                        <p onClick={() => setModal({ display: true, login: true })} className="flex items-center gap-3 text-white/30 hover:underline transition duration-500 cursor-pointer hover:text-white"><MdAccountBox />Se connecter</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}