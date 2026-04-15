"use client";

import Navbar from "@/components/Navbar";
import { useNotif } from "@/components/NotifProvider";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { challenges, flag_list, guessTheP, User } from "@/lib/types"
import { BiPlusCircle, BiPlusMedical } from "react-icons/bi";
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from "react-icons/io";
import { BsArrowRightCircle } from "react-icons/bs";

const difficultyBtn = [
    { name: "Facile", color: "text-green-400" },
    { name: "Intermédiaire", color: "text-yellow-400" },
    { name: "Avancé", color: "text-yellow-600" },
    { name: "Expert", color: "text-red-400" },
]

const categoryBtn = [
    { name: "Web", color: "text-green-400" },
    { name: "Crypto", color: "text-yellow-400" },
    { name: "Pwn", color: "text-yellow-600" },
    { name: "Reverse", color: "text-red-400" },
    { name: "Forensic", color: "text-grey-400" },
    { name: "OSINT", color: "text-blue-400" },
    { name: "Misc", color: "text-indigo-400" },
]

export default function Home() {
    const router = useRouter();
    const { showNotif } = useNotif()

    const [userSession, setUserSession] = useState<{ userData: User | null }>({ userData: null })
    const [sessionLoaded, setSessionLoaded] = useState(false)

    const [addChallenge, setAddChallenge] = useState(false)
    const [allChallenges, setAllChallenges] = useState<challenges[]>([])
    const [settingsBuilder, setSettingsBuilder] = useState({ displayDifficulty: false, displayCategory: false, displayMaxAttempt: false, displayCreateFlags: false })
    const [builderValues, setBuilderValues] = useState({ name: "", desc: "", difficulty: "", category: "", flag_format: "", max_attempt: 0, complet_ennounce: "", file_to_download: "" })
    const [listFlag, setListFlag] = useState<flag_list[]>([])
    const [newFlag, setNewFlag] = useState({ title: "", description: "", flag: "", format: "", indice: "" })

    const [addGuessThePlace, setAddGuessThePlace] = useState(false)
    const [guessThePlace, setGuessThePlace] = useState<guessTheP[]>([])
    const [guessThePlaceBuilder, setGuessThePlaceBuilder] = useState({ title: "", description: "", difficulty: "", image: "", flag: "", hint: "", points: 0 })
    const [settingsGuessThePlaceBuilder, setSettingsGuessThePlaceBuilder] = useState({ displayDifficulty: false })

    const [panelTab, setPanelTab] = useState(0)

    useEffect(() => {
        if (sessionLoaded) return
        async function getSession() {
            const res = await fetch("/api/session")
            const data = await res.json()
            setUserSession(data)
            setSessionLoaded(true)
        }

        getSession()
    }, [])

    const toggleDifficulty = () => {
        setSettingsBuilder(prev => ({
            ...prev,
            displayDifficulty: !prev.displayDifficulty
        }));
    };

    const toggleCategory = () => {
        setSettingsBuilder(prev => ({
            ...prev,
            displayCategory: !prev.displayCategory
        }));
    };

    useEffect(() => {
        const getChallenges = async () => {
            const res = await fetch("/api/ctf", {
                method: "GET"
            })
            if (!res.ok) {
                showNotif(await res.text(), "error")
                return
            }
            setAllChallenges(await res.json())
        }
        getChallenges()
    }, [])

    const getGuessThePlace = async () => {
        setPanelTab(1)
        const res = await fetch("/api/guessThePlace", {
            method: "GET",
        })
        if (!res.ok) {
            showNotif(await res.text(), "error")
            return
        }
        setGuessThePlace(await res.json())
    }

    const guessThePlaceToggleDifficulty = () => {
        setSettingsGuessThePlaceBuilder(prev => ({
            ...prev,
            displayDifficulty: !prev.displayDifficulty
        }));
    };

    const createGuessThePlace = async () => {
        const req = await fetch("/api/guessThePlace", {
            method: "POST",
            body: JSON.stringify(guessThePlaceBuilder)
        })
        if (!req.ok) {
            const err = await req.json()
            showNotif(err.err, "error")
            return
        }
        showNotif("GuessThePlace bien ajouté !", "success")
        setAddGuessThePlace(false)
        setGuessThePlaceBuilder({ title: "", description: "", difficulty: "", image: "", flag: "", hint: "", points: 0 })
    }

    const easyGuessThePlace = guessThePlace?.filter(el => el.difficulty === "Facile")
    const intermediaireGuessThePlace = guessThePlace?.filter(el => el.difficulty === "Intermédiaire")
    const advancedGuessThePlace = guessThePlace?.filter(el => el.difficulty === "Avancé")
    const expertGuessThePlace = guessThePlace?.filter(el => el.difficulty === "Expert")

    return (
        <div>
            <Navbar />
            <div className="flex items-center gap-5 m-8">
                <button onClick={() => setPanelTab(0)} className={`${panelTab === 0 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 transition cursor-pointer transition duration-500 bg-[#2a2a3d]`}>🚩 Nos CTF</button>
                <button onClick={() => getGuessThePlace()} className={`${panelTab === 1 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 transition cursor-pointer transition duration-500 bg-[#2a2a3d]`}>📍 GEOINT</button>
            </div>
            {panelTab === 0 && (
                <div>
                    {userSession.userData?.role === "owner" && (
                        <button onClick={() => setAddChallenge(true)} className="p-4 m-8 border border-gray-600 text-white/40 rounded-[7px] w-1/10 hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center flex items-center justify-center gap-2 font-bold"><BiPlusCircle />Créer un CTF</button>
                    )}
                    <div className="flex items-center gap-3 m-8">
                        {[{ title: "Phishout", link: "/phishout" }].map((v, k) => (
                            <button key={k} onClick={() => router.push(`/ctf${v.link}`)} className="p-4 border border-gray-600 text-white/40 rounded-[7px] w-1/10 hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center">{v.title}</button>
                        ))}
                    </div>
                    {addChallenge && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                            <div className="flex gap-5 w-full max-w-5xl">
                                <div className="w-1/2 bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6">
                                    <div className="flex flex-col gap-3 text-white/40 text-center">
                                        <h2 className="text-xl font-bold text-white">Création d'un CTF</h2>
                                        <p className="text-gray-300 text-[17px] leading-relaxed">Créer un CTF dynamiquement juste ici !</p>
                                    </div>
                                    <hr className="text-white/40 my-5 m-auto" />
                                    <div className="flex items-center flex-col gap-3">
                                        <div className="w-full flex items-center gap-2 justify-between">
                                            <input value={builderValues.name} onChange={(e) => setBuilderValues({ ...builderValues, name: e.target.value })} className={`border-2 ${builderValues.name ? "border-green-700/40" : "border-red-500/40"} rounded-[8px] w-1/2 text-white/80 p-[6px]`} type="text" placeholder="Nom du CTF" />
                                            <input value={builderValues.desc} onChange={(e) => setBuilderValues({ ...builderValues, desc: e.target.value })} className={`border-2 ${builderValues.desc ? "border-green-700/40" : "border-red-500/40"} rounded-[8px] w-1/2 text-white/80 p-[6px]`} type="text" placeholder="Description du CTF" />
                                        </div>
                                        <hr className="text-white/40 my-5 w-1/2 m-auto" />
                                        <div className="w-full flex items-center gap-2 justify-between">
                                            <div className="flex items-center gap-2 w-full">
                                                <div className="w-1/2">
                                                    <button onClick={toggleDifficulty} className={`${builderValues.difficulty ? "border-green-700/40" : "border-red-500/40"} flex items-center justify-center gap-2 border-2 rounded-lg w-full text-white/80 p-1.5 transition duration-500 cursor-pointer hover:text-white/60 hover:border-white/20 text-[13px]`}>{builderValues.difficulty ? `Difficulté : ( ${builderValues.difficulty} )` : "Difficulté"} {settingsBuilder.displayDifficulty ? <IoIosArrowDropupCircle /> : <IoIosArrowDropdownCircle />}</button>
                                                    {settingsBuilder.displayDifficulty && (
                                                        <div className="flex items-center justify-center gap-2 flex-wrap w-full mt-2">
                                                            {difficultyBtn.map((el) => (
                                                                <button key={el.name} onClick={() => { setBuilderValues({ ...builderValues, difficulty: el.name }); setSettingsBuilder({ ...settingsBuilder, displayDifficulty: false }) }} className="text-white/40 bg-[#2a2a3d] rounded-[12px] w-fit p-2 cursor-pointer hover:bg-[#2a2a3d]/60 transition duration-500"><span className={el.color}>{el.name}</span></button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="w-1/2">
                                                    <button onClick={toggleCategory} className={`${builderValues.category ? "border-green-700/40" : "border-red-500/40"} flex items-center justify-center gap-2 border-2 rounded-lg w-full text-white/80 p-1.5 transition duration-500 cursor-pointer hover:text-white/60 hover:border-white/20 text-[13px]`}>{builderValues.category ? `Catégorie : ( ${builderValues.category} )` : "Catégorie"} {settingsBuilder.displayCategory ? <IoIosArrowDropupCircle /> : <IoIosArrowDropdownCircle />}</button>
                                                    {settingsBuilder.displayCategory && (
                                                        <div className="flex items-center justify-center gap-2 flex-wrap w-full mt-2">
                                                            {categoryBtn.map((el) => (
                                                                <button key={el.name} onClick={() => { setBuilderValues({ ...builderValues, category: el.name }); setSettingsBuilder({ ...settingsBuilder, displayCategory: false }) }} className="text-white/40 bg-[#2a2a3d] rounded-[12px] w-fit p-2 cursor-pointer hover:bg-[#2a2a3d]/60 transition duration-500"><span className={el.color}>{el.name}</span></button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="text-white/40 my-5 w-1/2 m-auto" />
                                        <div className="w-full flex items-center gap-2 justify-between">
                                            <input value={builderValues.flag_format} onChange={(e) => setBuilderValues({ ...builderValues, flag_format: e.target.value })} className={`border-2 ${builderValues.flag_format ? "border-green-700/40" : "border-red-500/40"} rounded-[8px] w-1/2 text-white/80 p-[6px]`} type="text" placeholder="Format du flag" />
                                            <button onClick={() => setSettingsBuilder({ ...settingsBuilder, displayMaxAttempt: true })} className={`border-2 ${builderValues.flag_format ? "border-green-700/40" : "border-red-500/40"} flex items-center justify-center gap-2 rounded-lg w-1/2 text-white/80 p-1.5 transition duration-500 cursor-pointer hover:text-white/60 hover:border-white/20 text-[13px]`}>{builderValues.max_attempt === 0 ? `Essais max par flags : Illimité` : `Essais max par flags : ${builderValues.max_attempt}`}</button>
                                        </div>
                                        <hr className="text-white/40 my-5 w-1/2 m-auto" />
                                        <h2 className="text-xl font-bold text-white">Contenu du challenge</h2>
                                        <div className="w-full flex items-center gap-2 justify-between">
                                            <input value={builderValues.complet_ennounce} onChange={(e) => setBuilderValues({ ...builderValues, complet_ennounce: e.target.value })} className={`border-2 ${builderValues.complet_ennounce ? "border-green-700/40" : "border-red-500/40"} rounded-[8px] w-1/2 text-white/80 p-[6px]`} type="text" placeholder="Énoncé complet du CTF" />
                                            <input value={builderValues.file_to_download} onChange={(e) => setBuilderValues({ ...builderValues, file_to_download: e.target.value })} className={`border-2 border-white/40 rounded-[8px] w-1/2 text-white/80 p-[6px]`} type="text" placeholder="Dossier à télécharger (.zip )" />
                                        </div>
                                        <button onClick={() => setSettingsBuilder({ ...settingsBuilder, displayCreateFlags: true })} className="flex items-center justify-center gap-2 border-2 border-white/40 rounded-lg w-full text-white/80 p-1.5 transition duration-500 cursor-pointer hover:text-white/60 hover:border-white/20 text-[13px]">Création des flags<BsArrowRightCircle /></button>
                                        <hr className="text-white/40 my-5 w-1/2 m-auto" />
                                        <div className="w-2/3 flex items-center gap-2">
                                            <button onClick={() => setSettingsBuilder({ ...settingsBuilder, displayMaxAttempt: false })} className="border-2 border-white/40 rounded-[8px] w-1/2 text-white/80 p-[6px] hover:bg-red-700 cursor-pointer transition duration-500">Annuler</button>
                                            {(!builderValues.name || !builderValues.desc || !builderValues.max_attempt || !builderValues.flag_format || !builderValues.difficulty || !builderValues.complet_ennounce || !builderValues.category) ? (
                                                <button className="border-2 border-white/40 rounded-[8px] w-1/2 text-white/80 p-[6px] bg-red-800 hover:bg-red-600 transition duration-500 cursor-not-allowed">Créer</button>
                                            ) : (
                                                <button onClick={() => { setSettingsBuilder({ ...settingsBuilder, displayMaxAttempt: false }); setBuilderValues({ name: "", desc: "", difficulty: "", category: "", flag_format: "", max_attempt: 0, complet_ennounce: "", file_to_download: "" }) }} className="border-2 border-white/40 rounded-[8px] w-1/2 text-white/80 p-[6px] hover:bg-green-700 cursor-pointer transition duration-500">Créer</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-1/2 bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6 max-h-[600px] overflow-y-auto">
                                    <h2 className="text-xl font-bold text-white text-center">Aperçu du CTF</h2>
                                    <hr className="text-white/40 my-5 w-1/2 m-auto" />
                                    <div className="text-white/70 flex flex-col gap-3">
                                        <p><span className="text-white font-bold">Nom :</span> {builderValues.name || "N/A"}</p>
                                        <p><span className="text-white font-bold">Description :</span> {builderValues.desc || "N/A"}</p>
                                        <p><span className="text-white font-bold">Difficulté :</span> {builderValues.difficulty || "N/A"}</p>
                                        <p><span className="text-white font-bold">Catégorie :</span> {builderValues.category || "N/A"}</p>
                                        <p><span className="text-white font-bold">Format :</span>{builderValues.flag_format || "N/A"}</p>
                                        <p><span className="text-white font-bold">Essais max :</span> {builderValues.max_attempt === 0 ? "Illimité" : builderValues.max_attempt}</p>
                                        <p><span className="text-white font-bold">Énoncé :</span></p>
                                        <p className="text-sm text-white/50">
                                            {builderValues.complet_ennounce || "Aucun énoncé"}
                                        </p>
                                        <p><span className="text-white font-bold">Fichier :</span> {builderValues.file_to_download || "Aucun"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {settingsBuilder.displayMaxAttempt && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-3 w-full max-w-md bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6 animate-fadeIn">
                                <h2 className="text-xl font-bold text-white">Essais maximum par flags ( 0 = illimité )</h2>
                                <hr className="text-white/40 my-3 w-1/2 m-auto" />
                                <input className="border-2 border-white/40 rounded-[8px] w-2/3 text-white/80 p-[6px] text-center" value={builderValues.max_attempt} onChange={(e) => setBuilderValues({ ...builderValues, max_attempt: Number(e.target.value) })} type="number" />
                                <div className="w-2/3 flex items-center gap-2">
                                    <button onClick={() => setSettingsBuilder({ ...settingsBuilder, displayMaxAttempt: false })} className="border-2 border-white/40 rounded-[8px] w-1/2 text-white/80 p-[6px] hover:bg-red-700 cursor-pointer transition duration-500">Annuler</button>
                                    <button onClick={() => setSettingsBuilder({ ...settingsBuilder, displayMaxAttempt: false })} className="border-2 border-white/40 rounded-[8px] w-1/2 text-white/80 p-[6px] hover:bg-green-700 cursor-pointer transition duration-500">Valider</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {settingsBuilder.displayCreateFlags && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                            <div className="flex gap-5 w-full max-w-4xl max-h-[350px]">
                                <div className="flex flex-col items-center gap-3 w-1/2 bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6">
                                    <h2 className="text-xl font-bold text-white">Création des flags</h2>
                                    <hr className="text-white/40 my-3 w-1/2 m-auto" />

                                    <div className="w-full flex items-center gap-2">
                                        <input value={newFlag.title} onChange={(e) => setNewFlag({ ...newFlag, title: e.target.value })} type="text" placeholder="Titre du flag" className="border-2 border-white/40 rounded-[8px] w-1/2 text-white/80 p-[6px]" />
                                        <input value={newFlag.description} onChange={(e) => setNewFlag({ ...newFlag, description: e.target.value })} type="text" placeholder="Description du flag" className="border-2 border-white/40 rounded-[8px] w-1/2 text-white/80 p-[6px]" />
                                    </div>
                                    <div className="w-full flex items-center gap-2">
                                        <input value={newFlag.format} onChange={(e) => setNewFlag({ ...newFlag, format: e.target.value })} type="text" placeholder="Format du flag" className="border-2 border-white/40 rounded-[8px] w-1/2 text-white/80 p-[6px]" />
                                        <input value={newFlag.flag} onChange={(e) => setNewFlag({ ...newFlag, flag: e.target.value })} type="text" placeholder="Flag a trouver" className="border-2 border-white/40 rounded-[8px] w-1/2 text-white/80 p-[6px]" />
                                    </div>
                                    <input value={newFlag.indice} onChange={(e) => setNewFlag({ ...newFlag, indice: e.target.value })} type="text" placeholder="Indice du flag ( rien si pas d'indice ! )" className="border-2 border-white/40 rounded-[8px] w-full text-white/80 p-[6px]" />
                                    <div className="w-2/3 flex items-center gap-2">
                                        <button onClick={() => { setNewFlag({ title: "", description: "", flag: "", format: "", indice: "" }); setSettingsBuilder({ ...settingsBuilder, displayCreateFlags: false }) }} className="border-2 border-white/40 rounded-[8px] w-1/2 text-white/80 p-[6px] hover:bg-red-700 transition duration-500 cursor-pointer">Retour</button>
                                        {(!newFlag.title || !newFlag.description || !newFlag.flag) ? (
                                            <button className="border-2 border-white/40 rounded-[8px] w-1/2 text-white/80 p-[6px] bg-red-800 hover:bg-red-600 transition duration-500 cursor-not-allowed">Ajouter</button>
                                        ) : (
                                            <button onClick={() => { setListFlag(prev => [...prev, newFlag]); setNewFlag({ title: "", description: "", flag: "", format: "", indice: "" }) }} className="border-2 border-white/40 rounded-[8px] w-1/2 text-white/80 p-[6px] bg-green-800 hover:bg-green-600 transition duration-500 cursor-pointer">Ajouter</button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 w-1/2 bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6 overflow-y-auto">
                                    <h2 className="text-xl font-bold text-white text-center">Liste des flags</h2>
                                    <hr className="text-white/40 my-3 w-1/2 m-auto" />
                                    {listFlag.length === 0 ? (
                                        <h2 className="bg-[#2a2a3d] w-full p-2 rounded-[8px] text-white/40">Aucun flag pour le moment !</h2>
                                    ) : (
                                        <div className="w-full flex flex-col items-center gap-2">
                                            {listFlag.map((el) => (
                                                <p key={el.title} className="bg-[#2a2a3d] w-full p-2 rounded-lg text-white/40 flex items-center gap-2"><BiPlusMedical />Titre : {el.title} | Flag : {el.flag}</p>
                                            ))}
                                        </div>
                                    )}
                                    { }
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            )}
            {panelTab === 1 && (
                <div>
                    {userSession.userData?.role === "owner" && (
                        <button onClick={() => setAddGuessThePlace(true)} className="p-4 m-8 border border-gray-600 text-white/40 rounded-[7px] max-w-2/10 hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center flex items-center justify-center gap-2 font-bold"><BiPlusCircle />Ajouter un GuessThePlace</button>
                    )}
                    {!guessThePlace && (
                        <h2 className="text-white/70 text-xl sm:text-7xl mt-30 font-mono text-center">Aucun GuessThePlace pour le moment !</h2>
                    )}
                    <div className="flex flex-col gap-6 m-8">
                        <div className="w-full flex flex-col gap-3">
                            <h2 className="text-white/50">Difficulté : <span className="font-bold text-white/40">Facile</span></h2>
                            {!easyGuessThePlace || easyGuessThePlace.length === 0 ? (
                                <h2 className="p-4 border border-gray-600 text-center text-red-500/40 rounded-[7px] w-fit transition duration-500">Aucun challenge GEOINT difficulté Facile pour le moment !</h2>
                            ) : (
                                <div className="flex items-center gap-5">
                                    {easyGuessThePlace.map((v, k) => (
                                        <button key={k} onClick={() => router.push(`/guesstheplace/${v.id}`)} className="p-4 border border-gray-600 text-white/40 rounded-[7px] w-1/10 hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center">{v.title}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="w-full flex flex-col gap-3">
                            <h2 className="text-white/50">Difficulté : <span className="font-bold text-white/40">Intermédiaire</span></h2>
                            {!intermediaireGuessThePlace || intermediaireGuessThePlace.length === 0 ? (
                                <h2 className="p-4 border border-gray-600 text-center text-red-500/40 rounded-[7px] w-fit transition duration-500">Aucun challenge GEOINT difficulté Intermédiaire pour le moment !</h2>
                            ) : (
                                <div className="flex items-center gap-5">
                                    {intermediaireGuessThePlace.map((v, k) => (
                                        <button key={k} onClick={() => router.push(`/guesstheplace/${v.id}`)} className="p-4 border border-gray-600 text-white/40 rounded-[7px] w-1/10 hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center">{v.title}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="w-full flex flex-col gap-3">
                            <h2 className="text-white/50">Difficulté : <span className="font-bold text-white/40">Avancé</span></h2>
                            {!advancedGuessThePlace || advancedGuessThePlace.length === 0 ? (
                                <h2 className="p-4 border border-gray-600 text-center text-red-500/40 rounded-[7px] w-fit transition duration-500">Aucun challenge GEOINT difficulté Avancé pour le moment !</h2>
                            ) : (
                                <div className="flex items-center gap-5">
                                    {advancedGuessThePlace.map((v, k) => (
                                        <button key={k} onClick={() => router.push(`/guesstheplace/${v.id}`)} className="p-4 border border-gray-600 text-white/40 rounded-[7px] w-1/10 hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center">{v.title}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="w-full flex flex-col gap-3">
                            <h2 className="text-white/50">Difficulté : <span className="font-bold text-white/40">Expert</span></h2>
                            {!expertGuessThePlace || expertGuessThePlace.length === 0 ? (
                                <h2 className="p-4 border border-gray-600 text-center text-red-500/40 rounded-[7px] w-fit transition duration-500">Aucun challenge GEOINT difficulté Expert pour le moment !</h2>
                            ) : (
                                <div className="flex items-center gap-5">
                                    {expertGuessThePlace.map((v, k) => (
                                        <button key={k} onClick={() => router.push(`/guesstheplace/${v.id}`)} className="p-4 border border-gray-600 text-white/40 rounded-[7px] w-1/10 hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center">{v.title}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {addGuessThePlace && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                            <div className="flex gap-5 w-full max-w-5xl">
                                <div className="w-1/2 bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6">
                                    <div className="flex flex-col gap-3 text-white/40 text-center">
                                        <h2 className="text-xl font-bold text-white">Création d'un GuessThePlace</h2>
                                        <p className="text-gray-300 text-[17px] leading-relaxed">Créer un GuessThePlace dynamiquement juste ici !</p>
                                    </div>
                                    <hr className="text-white/40 my-5 m-auto" />
                                    <div className="flex items-center flex-col gap-3">
                                        <div className="w-full flex items-center gap-2 justify-between">
                                            <input value={guessThePlaceBuilder.title} onChange={(e) => setGuessThePlaceBuilder({ ...guessThePlaceBuilder, title: e.target.value })} className={`border-2 ${guessThePlaceBuilder.title ? "border-green-700/40" : "border-red-500/40"} rounded-[8px] w-1/2 text-white/80 p-[6px]`} type="text" placeholder="Nom du challenge" />
                                            <input value={guessThePlaceBuilder.flag} onChange={(e) => setGuessThePlaceBuilder({ ...guessThePlaceBuilder, flag: e.target.value })} className={`border-2 ${guessThePlaceBuilder.flag ? "border-green-700/40" : "border-red-500/40"} rounded-[8px] w-1/2 text-white/80 p-[6px]`} type="text" placeholder="Le flag" />
                                        </div>
                                        <textarea value={guessThePlaceBuilder.description} onChange={(e) => setGuessThePlaceBuilder({ ...guessThePlaceBuilder, description: e.target.value })} className={`border-2 ${guessThePlaceBuilder.description ? "border-green-700/40" : "border-red-500/40"} rounded-[8px] w-full text-white/80 p-[6px]`} placeholder="Description du challenge" />
                                        <div className="w-full flex items-center gap-2 justify-between">
                                            <input value={guessThePlaceBuilder.hint} onChange={(e) => setGuessThePlaceBuilder({ ...guessThePlaceBuilder, hint: e.target.value })} className={`border-2 ${guessThePlaceBuilder.hint ? "border-green-700/40" : "border-red-500/40"} rounded-[8px] w-1/2 text-white/80 p-[6px]`} type="text" placeholder="Text de l'indice" />
                                            <input value={guessThePlaceBuilder.points} onChange={(e) => setGuessThePlaceBuilder({ ...guessThePlaceBuilder, points: Number(e.target.value) })} className={`border-2 ${guessThePlaceBuilder.points ? "border-green-700/40" : "border-red-500/40"} rounded-[8px] w-1/2 text-white/80 p-[6px]`} type="number" placeholder="Point a remporter" />
                                        </div>
                                        <hr className="text-white/40 my-5 w-1/2 m-auto" />
                                        <div className="w-full flex items-center gap-2 justify-between">
                                            <div className="flex items-start gap-2 justify-between w-full">
                                                <div className="w-1/2 relative min-h-[40px]">
                                                    <button onClick={guessThePlaceToggleDifficulty} className={`${guessThePlaceBuilder.difficulty ? "border-green-700/40" : "border-red-500/40"} flex items-center justify-center gap-2 border-2 rounded-lg w-full text-white/80 p-1.5 transition duration-500 cursor-pointer hover:text-white/60 hover:border-white/20 text-[13px]`}>{guessThePlaceBuilder.difficulty ? `Difficulté : ( ${guessThePlaceBuilder.difficulty} )` : "Difficulté"} {settingsGuessThePlaceBuilder.displayDifficulty ? <IoIosArrowDropupCircle /> : <IoIosArrowDropdownCircle />}</button>
                                                    {settingsGuessThePlaceBuilder.displayDifficulty && (
                                                        <div className="absolute left-0 top-full mt-2 w-full bg-[#1e1e2f] rounded-lg p-2 flex flex-wrap gap-2 z-50 shadow-lg">
                                                            {difficultyBtn.map((el) => (
                                                                <button key={el.name} onClick={() => { setGuessThePlaceBuilder({ ...guessThePlaceBuilder, difficulty: el.name }); setSettingsGuessThePlaceBuilder({ ...settingsGuessThePlaceBuilder, displayDifficulty: false }) }} className="text-white/40 bg-[#2a2a3d] rounded-[12px] w-fit p-2 cursor-pointer hover:bg-[#2a2a3d]/60 transition duration-500"><span className={el.color}>{el.name}</span></button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-center gap-2">
                                                    <input value={guessThePlaceBuilder.image} onChange={(e) => setGuessThePlaceBuilder({ ...guessThePlaceBuilder, image: e.target.value })} className={`border-2 ${guessThePlaceBuilder.image ? "border-green-700/40" : "border-red-500/40"} rounded-[8px] w-full text-white/80 p-[6px]`} type="text" placeholder="Image de départ" />
                                                    <img className="w-[75px] rounded-[8px]" src={guessThePlaceBuilder.image || "https://img.freepik.com/vecteurs-libre/bientot-arriere-plan-conception-effet-lumiere-mise-au-point_1017-27277.jpg?semt=ais_hybrid&w=740&q=80"} alt="Image de départ" />
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="text-white/40 my-5 w-1/2 m-auto" />
                                        <div className="w-2/3 flex items-center gap-2">
                                            <button onClick={() => { setGuessThePlaceBuilder({ title: "", description: "", difficulty: "", image: "", flag: "", hint: "", points: 0 }); setAddGuessThePlace(false) }} className="border-2 border-white/40 rounded-[8px] w-1/2 text-white/80 p-[6px] hover:bg-red-700 cursor-pointer transition duration-500">Annuler</button>
                                            {(!guessThePlaceBuilder.title || !guessThePlaceBuilder.description || !guessThePlaceBuilder.flag || !guessThePlaceBuilder.difficulty) ? (
                                                <button className="border-2 border-white/40 rounded-[8px] w-1/2 text-white/80 p-[6px] bg-red-800 hover:bg-red-600 transition duration-500 cursor-not-allowed">Ajouter</button>
                                            ) : (
                                                <button onClick={() => createGuessThePlace()} className="border-2 border-white/40 rounded-[8px] w-1/2 text-white/80 p-[6px] hover:bg-green-700 cursor-pointer transition duration-500">Ajouter</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-1/2 bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6 max-h-[600px] overflow-y-auto">
                                    <h2 className="text-xl font-bold text-white text-center">Aperçu du CTF</h2>
                                    <hr className="text-white/40 my-5 w-1/2 m-auto" />
                                    <div className="text-white/70 flex flex-col gap-3">
                                        <p><span className="text-white font-bold">Nom :</span> {guessThePlaceBuilder.title || "N/A"}</p>
                                        <p><span className="text-white font-bold">Flag :</span> {guessThePlaceBuilder.flag || "N/A"}</p>
                                        <p><span className="text-white font-bold">Description :</span><br /> <span className="text-white/50 text-sm">{guessThePlaceBuilder.description || "Aucune description"}</span></p>
                                        <p><span className="text-white font-bold">Difficulté :</span> {guessThePlaceBuilder.difficulty || "N/A"}</p>
                                        <p className="text-white font-bold">Image de départ :</p>
                                        <img className="w-[75px] rounded-[8px]" src={guessThePlaceBuilder.image || "https://img.freepik.com/vecteurs-libre/bientot-arriere-plan-conception-effet-lumiere-mise-au-point_1017-27277.jpg?semt=ais_hybrid&w=740&q=80"} alt="Image de départ" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}