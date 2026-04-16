"use client"

import { useEffect, useState } from "react"
import { useNotif } from "./NotifProvider"
import { User } from "@/lib/types"
import { IoMdCheckboxOutline } from "react-icons/io"
import { MdCheckBoxOutlineBlank } from "react-icons/md"

export default function AdminPanel({ closePanel }: { closePanel: () => void }) {
    const { showNotif } = useNotif()

    const [panelTab, setPanelTab] = useState(0)

    const [users, setUsers] = useState<User[]>([])
    const [editUser, setEditUser] = useState<number | null>(null)
    const [inMaintenance, setInMaintenance] = useState(false)

    const getAllUser = async () => {
        const res = await fetch("/api/auth/users", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
        if (!res.ok) {
            const err = await res.text()
            showNotif(err, "error");
            return
        }
        const data = await res.json()
        setUsers(data)
    }

    const getMaintenance = async () => {
        const req = await fetch("/api/admin/logsSec/maintenance", {
            method: "GET"
        })
        if (!req.ok) {
            showNotif(await req.text())
            return
        }
        const data = await req.json()        
        setInMaintenance(data)
    }

    useEffect(() => {
        if (panelTab === 1) {
            getAllUser()
        } else if (panelTab === 2) {
            getMaintenance()
        }
    }, [panelTab])

    const setMaintenance = async () => {
        const req = await fetch("/api/admin/logsSec/maintenance", {
            method: "POST",
            body: JSON.stringify({ inMaintenance: !inMaintenance})
        })
        if (!req.ok) {
            showNotif(await req.text())
            return
        }
        setInMaintenance(!inMaintenance)
    }

    return (
        <div id="overlay" className="fixed inset-0 z-50 flex items-center justify-center gap-15 bg-black/70 backdrop-blur-sm">
            <div className="w-9/10 h-3/4 bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6 animate-fadeIn">
                <div className="flex flex-col gap-5 max-h-[50vh] overflow-y-auto pr-2 text-center text-white/70">
                    <h2 className="text-orange-500 italic font-bold">Panel admin - CTF Platform</h2>
                </div>
                <hr className="my-5 border-gray-600" />
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center justify-center gap-5">
                        <button onClick={() => { getAllUser(); setPanelTab(0) }} className={`${panelTab === 0 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#2a2a3d]`}>Dashboard</button>
                        <button onClick={() => { getAllUser(); setPanelTab(1) }} className={`${panelTab === 1 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#2a2a3d]`}>Gestion des utilisateurs</button>
                        <button onClick={() => setPanelTab(2)} className={`${panelTab === 2 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#2a2a3d]`}>Gestion des CTF</button>
                        <button onClick={() => setPanelTab(3)} className={`${panelTab === 3 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#2a2a3d]`}>Gestion des challenges</button>
                        <button onClick={() => setPanelTab(4)} className={`${panelTab === 4 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#2a2a3d]`}>Soumission des flags</button>
                        <button onClick={() => setPanelTab(5)} className={`${panelTab === 5 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#2a2a3d]`}>ScoreBoard</button>
                        <button onClick={() => setPanelTab(6)} className={`${panelTab === 6 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#2a2a3d]`}>Gestion des annonces</button>
                        <button onClick={() => setPanelTab(7)} className={`${panelTab === 7 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#2a2a3d]`}>Paramètres</button>
                        <button onClick={() => { getMaintenance(); setPanelTab(8) }} className={`${panelTab === 8 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#2a2a3d]`}>Logs & Sécurité</button>
                    </div>
                    <button onClick={closePanel} className="text-gray-400 hover:text-white cursor-pointer transition duration-500">✕</button>
                </div>
                {panelTab === 1 && (
                    <div className="w-full">
                        {/* <input value={searchUser} onChange={(e) => setSearchUser(e.target.va lue)} type="text" placeholder="Rechercher un utilisateur" className="mb-5 w-5/20 rounded-lg bg-[#2a2a3d] border border-gray-600 text-white placeholder-gray-500 focus:outline-none text-sm sm:text-base p-2" /> */}
                        <div className="flex items-center gap-3 w-full">
                            {Array.isArray(users) && users.map((el) => (
                                <div onClick={() => setEditUser(el.user_id)} key={el.user_id} className="border border-gray-600 text-white/40 rounded-[7px] w-1/10 py-3 hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer">
                                    <p className="text-center">{el.user_id} | {el.username}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {panelTab === 8 && (
                    <div>
                        {inMaintenance ? (
                            <button onClick={() => setMaintenance()} className="flex items-center gap-3 text-white/40 p-4 border border-gray-600 rounded-[7px] hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center"><IoMdCheckboxOutline />Terminer la maintenance</button>
                        ) : (
                            <button onClick={() => setMaintenance()} className="flex items-center gap-3 text-red-500 p-4 border border-gray-600 rounded-[7px] hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center"><MdCheckBoxOutlineBlank />Mettre le site en maintenance</button>
                        )}
                    </div>
                )}
                {editUser !== null && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                        <div className="bg-[#1e1e2f] rounded-2xl shadow-2xl p-6 w-1/3 animate-fadeIn relative">
                            <button onClick={() => setEditUser(null)} className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg cursor-pointer transition duration-500">✕</button>
                            {users.filter(el => el.user_id === editUser).map(el => (
                                <div key={el.user_id} className="flex flex-col gap-2 text-white">
                                    <h2 className="text-orange-400 font-bold text-xl">{el.username}</h2>
                                    <p>ID : {el.user_id}</p>
                                    <p>Email : {el.email}</p>
                                    <p>Rôle : {el.role}</p>
                                    <p>Créé le : {new Date(el.created_at).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}