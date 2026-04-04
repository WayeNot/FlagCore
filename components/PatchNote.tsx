"use client"

import { useEffect, useState } from "react"
import { FaPlusSquare } from "react-icons/fa"
import { MdAdminPanelSettings } from "react-icons/md"

type User = {
    user_id: number
    username: string
    email: string
    password: string
    role: string
    created_at: string
}

export default function PatchNote({ show, setShow }: { show: boolean, setShow: (v: boolean) => void }) {
    const [paperState, setPaperState] = useState(0)
    const [userSession, setUserSession] = useState<{ userData: User[] }>({ userData: [] })

    const patchnote = [
        { title: "05/04/2026", patch: [{ text: "Déconnexion fonctionnel" }, { text: "Création de compte terminé" }] },
        { title: "04/04/2026", patch: [{ text: "Ajout de page Coming soon" }, { text: "Résolution de beug sur le fichier ressource" }, { text: "Ajout de la page d'accueil + nos challenges" }] },
    ]

    const features = [
        { title: "Création des comptes" },
        { title: "Login fonctionnel" },
        { title: "Création du panel admin" },
    ]

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

    useEffect(() => {
        const handleClick = (e: any) => {
            if (e.target.id === "overlay") setShow(false)
        }
        document.addEventListener("click", handleClick)
        return () => document.removeEventListener("click", handleClick)
    }, [setShow])

    if (!show) return null

    return (
        <div id="overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6 animate-fadeIn">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-5">
                        <button onClick={() => setPaperState(0)} className={`${paperState === 0 ? "bg-[#2a2a3d]" : ""} rounded-md px-3 py-1 text-white hover:text-white/60 transition cursor-pointer`}>PatchNotes</button>
                        <button onClick={() => setPaperState(1)} className={`${paperState === 1 ? "bg-[#2a2a3d]" : ""} rounded-md px-3 py-1 text-white hover:text-white/60 transition cursor-pointer`}>Features</button>
                    </div>
                    <div>
                        {userSession.userData?.[0]?.role === "owner" ? (
                            <div className="flex items-center gap-3">
                                <FaPlusSquare className="text-[22px] text-white/40 hover:text-white/70 transition duration-500 cursor-pointer"/>
                                <button onClick={() => setShow(false)} className="text-gray-400 hover:text-white transition cursor-pointer">✕</button>
                            </div>
                        ) : (
                            <button onClick={() => setShow(false)} className="text-gray-400 hover:text-white transition cursor-pointer">✕</button>
                        )}
                    </div>
                </div>

                <hr className="my-5 border-gray-600" />

                <div className="flex flex-col gap-5 max-h-[50vh] overflow-y-auto pr-2">
                    {paperState === 0 && (
                        <div className="w-full">
                            {patchnote.map((el) => (
                                <div key={el.title} className="mb-4 w-full">
                                    <h2 className="text-lg font-bold text-white">PatchNote du <span className="text-white/40 italic">{el.title}</span></h2>
                                    <div className="mt-3 px-4 py-3 rounded-lg bg-[#2a2a3d] border border-gray-600">
                                        {el.patch?.map((patch, i) => (
                                            <p key={i} className="text-white/80">✔️ - {patch.text}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {paperState === 1 && (
                        <div className="w-full">
                            <h2 className="text-lg font-bold text-white mb-2">En cours de développement :</h2>
                            <div className="px-4 py-3 rounded-lg bg-[#2a2a3d] border border-gray-600">
                                {features.map((el, i) => (
                                    <p key={i} className="text-white/80">⏳ {el.title}</p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}