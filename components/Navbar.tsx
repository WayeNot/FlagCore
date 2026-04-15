"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { FaNewspaper, FaPlusSquare } from "react-icons/fa"
import { MdAdminPanelSettings, MdExitToApp } from "react-icons/md"
import { useRouter } from "next/navigation"

import AdminPanel from "./AdminPanel"
import { useNotif } from "./NotifProvider"
import { Features, PatchNote, Suggest, User } from "@/lib/types"
import { FcAcceptDatabase } from "react-icons/fc"
import { CiCircleRemove } from "react-icons/ci"

export default function Navbar() {
    const { showNotif } = useNotif()

    const [menuOpen, setMenuOpen] = useState(false)
    const [showPaper, setShowPaper] = useState(false)

    const [userSession, setUserSession] = useState<{ userData: User | null }>({ userData: null })
    const [sessionLoaded, setSessionLoaded] = useState(false)

    const [showAdminPanel, setShowAdminPanel] = useState(false)

    const [paperState, setPaperState] = useState(0)

    const [addFeatures, setAddFeatures] = useState(false)
    const [featuresText, setFeaturesText] = useState("")
    const [allFeatures, setAllFeatures] = useState<Features[]>([])

    const [addSuggest, setAddSuggest] = useState(false)
    const [suggestText, setSuggestText] = useState("")
    const [allSuggest, setAllSuggest] = useState<Suggest[]>([])

    const [patchNote, setPatchNote] = useState<PatchNote[]>([])

    const router = useRouter()

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

    useEffect(() => {
        async function init() {
            const res = await fetch("/api/corehub/init")
            const data = await res.json()

            setAllFeatures(data.features)
            setAllSuggest(data.suggest)
            setPatchNote(data.patchnote)
        }

        init()
    }, [])

    const handleLogout = async () => {
        const res = await fetch("/api/session", {
            method: "DELETE",
        })

        if (res.ok) {
            router.refresh()
        }
    }

    const addFeatureToState = async () => {
        const res = await fetch("/api/corehub/features", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })

        if (!res.ok) {
            showNotif("Impossible de get les features !", "error")
            return
        }
        setAllFeatures(await res.json())
    }

    const addSuggestToState = async () => {
        const res = await fetch("/api/corehub/suggest", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })

        if (!res.ok) {
            showNotif("Impossible de get les suggestions !", "error")
            return
        }

        setAllSuggest(await res.json())
    }

    const handleFeature = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!featuresText) {
            showNotif("Veuillez rentrer du text !")
            return
        }

        const res = await fetch("/api/corehub/features", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: featuresText })
        })

        if (!res.ok) {
            const err = await res.text()
            showNotif(err, "error");
            return
        }

        setAddFeatures(false)
        setFeaturesText("")

        showNotif("Feature ajouté avec succès !", "success")
    }

    const handleFinishFeature = async (id: number, feature: string) => {
        try {
            const today = new Date().toISOString().split("T")[0];

            const resPatch = await fetch("/api/corehub/patchnote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ feature, created_at: today })
            });
            if (!resPatch.ok) {
                const err = await resPatch.text();
                showNotif(err, "error");
                return;
            }

            const resDelete = await fetch("/api/corehub/features", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ feature_id: id })
            });
            if (!resDelete.ok) {
                const err = await resDelete.text();
                showNotif(err, "error");
                return;
            }

            setAllFeatures(prev => prev.filter(el => el.id !== id));
            setPatchNote(prev => [...prev, { id: Date.now(), feature, created_at: today }]);

            showNotif("Feature terminé et ajoutée au patchnote !", "success");
        } catch (error) {
            console.error(error);
            showNotif("Une erreur est survenue.", "error");
        }
    };

    const handleRemoveFeature = async (feature_id: any) => {
        const res = await fetch("/api/corehub/features", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ feature_id: feature_id })
        })

        if (!res.ok) {
            const err = await res.text()
            showNotif(err, "error")
            return
        }

        showNotif("Feature supprimé avec succès !", "success")
        setAllFeatures(allFeatures.filter(el => el.id !== feature_id))
    }

    const handleSuggest = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!suggestText) {
            showNotif("Veuillez rentrer du text !")
            return
        }
        const res = await fetch("/api/corehub/suggest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userSession.userData?.user_id, text: suggestText })
        })

        if (!res.ok) {
            const err = await res.text()
            showNotif(err, "error");
            return
        }

        const newSuggest = await res.json()

        setAllSuggest(prev => [...prev, { created_at: newSuggest.created_at, id: newSuggest.id, suggest: newSuggest.suggest, user_id: newSuggest.user_id, username: userSession.userData?.username || "Unknown" }])

        setAddSuggest(false)
        setSuggestText("")

        showNotif("Suggestion envoyé avec succès !", "success")
    }

    const handleAcceptSuggest = async (id: any, suggest: any) => {
        const res = await fetch("/api/corehub/features", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: suggest })
        });

        if (!res.ok) {
            const err = await res.text();
            showNotif(err, "error");
            return;
        }

        const newFeature = await res.json();

        const resDelete = await fetch("/api/corehub/suggest", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ suggest_id: id })
        });
        if (!resDelete.ok) {
            const err = await resDelete.text();
            showNotif(err, "error");
            return;
        }

        setAllFeatures(prev => [...prev, newFeature]);
        setAllSuggest(prev => prev.filter(el => el.id !== id));
        showNotif("Suggestion ajoutée aux features !", "success");
    }

    const handleDeleteSuggest = async (suggest_id: any) => {
        const res = await fetch("/api/corehub/suggest", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ suggest_id: suggest_id })
        })

        if (!res.ok) {
            const err = await res.text()
            showNotif(err, "error")
            return
        }

        showNotif("Suggestion supprimé avec succès !", "success")
        setAllSuggest(allSuggest.filter(el => el.id !== suggest_id))
    }

    const addPatchNoteToState = async () => {
        const res = await fetch("/api/corehub/patchnote", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })

        if (!res.ok) {
            const err = await res.text()
            showNotif(err, "error")
            return
        }

        setPatchNote(await res.json())
    }

    const groupedPatchNotes = useMemo(() => {
        const grouped = patchNote.reduce((acc, el) => {
            const date = el.created_at.split("T")[0];
            if (!acc[date]) acc[date] = [];
            acc[date].push(el.feature);
            return acc;
        }, {} as Record<string, string[]>);

        return Object.entries(grouped)
            .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
            .map(([date, features]) => ({ date, features }));
    }, [patchNote])

    return (
        <div>
            <nav className="flex items-center justify-between p-4 sm:mx-5">
                <div className="flex items-center gap-3 text-white/40">
                    <h1 className="text-xl h-fit sm:text-2xl text-white/60 font-mono">FlagCore</h1>
                    <FaNewspaper onClick={() => setShowPaper(true)} className="hover:text-white/70 cursor-pointer text-xl transition duration-500" />
                    {userSession.userData?.role === "owner" && (
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
                        <Link href="/challenges"><button className="w-full text-left px-4 py-3 rounded-lg text-white/70 hover:bg-[#3a3a4d] transition duration-500">Nos challenges</button></Link>
                        <Link href="/accounts"><button className="w-full text-left px-4 py-3 rounded-lg bg-[#2a2a3d] text-white/70 hover:bg-[#3a3a4d] transition duration-500">Mon compte</button></Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition duration-500"><MdExitToApp />Déconnexion</button>
                    </div>
                </div>
            )}
            {showAdminPanel && <AdminPanel closePanel={() => setShowAdminPanel(false)} />}
            {showPaper && (
                <div id="overlay" className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6 animate-fadeIn">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-5">
                                <button onClick={() => setPaperState(0)} className={`${paperState === 0 ? "bg-[#2a2a3d]" : ""} rounded-md px-3 py-1 text-white hover:text-white/60 transition cursor-pointer`}>PatchNotes</button>
                                <button onClick={() => setPaperState(1)} className={`${paperState === 1 ? "bg-[#2a2a3d]" : ""} rounded-md px-3 py-1 text-white hover:text-white/60 transition cursor-pointer`}>Features</button>
                                <button onClick={() => setPaperState(2)} className={`${paperState === 2 ? "bg-[#2a2a3d]" : ""} rounded-md px-3 py-1 text-white hover:text-white/60 transition cursor-pointer`}>Suggestions</button>
                            </div>
                            <button onClick={() => setShowPaper(false)} className="text-gray-400 hover:text-white transition cursor-pointer">✕</button>
                        </div>

                        <hr className="my-5 border-gray-600" />

                        <div className="flex flex-col gap-5 max-h-[50vh] overflow-y-auto pr-2">
                            {paperState === 0 && (
                                <div className="w-full">
                                    <h2 className="text-lg font-bold text-white mb-2">Patchnote journalier</h2>
                                    <div className="flex flex-col items-center gap-3 w-full">
                                        {groupedPatchNotes.length === 0 && (
                                            <h2 className="flex flex-col gap-2 w-full text-white/80 p-2 rounded-lg bg-[#2a2a3d] border border-gray-600">Aucun patchnote pour le moment !</h2>
                                        )}
                                        {groupedPatchNotes.map(({ date, features }) => (
                                            <div key={date} className="w-full flex flex-col gap-2">
                                                <div className="flex flex-col gap-2 w-full text-white/80 p-2 rounded-lg bg-[#2a2a3d] border border-gray-600">
                                                    <h2 className="text-[20px] text-white/40 underline italic font-bold">Patchnote du {date}</h2>
                                                    {features.map((v: any, k: any) => (
                                                        <p key={k}>✔️ {v}</p>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {paperState === 1 && (
                                <div className="w-full">
                                    <div className="flex items-center justify-between mb-2">
                                        <h2 className="text-lg font-bold text-white mb-2">Features en cours de développement</h2>
                                        {userSession.userData?.role === "owner" && (
                                            <FaPlusSquare onClick={() => setAddFeatures(true)} className="text-[22px] text-white/40 hover:text-white/70 transition duration-500 cursor-pointer" />
                                        )}
                                    </div>
                                    <div className="flex flex-col items-center gap-3 w-full">
                                        {allFeatures.length === 0 && (
                                            <h2 className="flex flex-col gap-2 w-full text-white/80 p-2 rounded-lg bg-[#2a2a3d] border border-gray-600">Aucune feature pour le moment !</h2>
                                        )}
                                        {allFeatures.map((el) => (
                                            <div key={el.id} className="w-full text-white/80 px-4 py-3 rounded-lg bg-[#2a2a3d] border border-gray-600 flex items-center justify-between"><p>⏳ {el.feature}</p>
                                                {userSession.userData?.role === "owner" && (
                                                    <div className="flex items-center gap-1">
                                                        <div onClick={() => handleFinishFeature(el.id, el.feature)} className="hover:bg-green-500 transition duration-500 cursor-pointer rounded-[5px] p-2"><FcAcceptDatabase className="text-[25px]" /></div>
                                                        <div onClick={() => handleRemoveFeature(el.id)} className="hover:bg-red-500 hover:text-white text-red-500 transition duration-500 cursor-pointer rounded-[5px] p-2"><CiCircleRemove className="text-[25px]" /></div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {paperState === 2 && (
                                <div className="w-full">
                                    <div className="flex items-center justify-between mb-2">
                                        <h2 className="text-lg font-bold text-white mb-2">Suggestions</h2>
                                        <FaPlusSquare onClick={() => setAddSuggest(true)} className="text-[22px] text-white/40 hover:text-white/70 transition duration-500 cursor-pointer" />
                                    </div>
                                    <div className="flex flex-col items-center gap-3 w-full">
                                        {allSuggest.length === 0 && (
                                            <h2 className="flex flex-col gap-2 w-full text-white/80 p-2 rounded-lg bg-[#2a2a3d] border border-gray-600">Aucune suggestion pour le moment !</h2>
                                        )}
                                        {allSuggest.map((el) => (
                                            <div key={el.id} className="w-full text-white/80 px-4 py-3 rounded-lg bg-[#2a2a3d] border border-gray-600 flex items-center justify-between">
                                                <div className="flex flex-col gap-1">
                                                    <p>⏳ {el.suggest}</p>
                                                    <p className="text-[12px]">@{el.username}</p>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    {userSession.userData?.role === "owner" && (
                                                        <div onClick={() => handleAcceptSuggest(el.id, el.suggest)} className="hover:bg-green-500 transition duration-500 cursor-pointer rounded-[5px] p-2"><FcAcceptDatabase className="text-[25px]" /></div>
                                                    )}
                                                    {(userSession.userData?.role === "owner" || userSession.userData?.user_id === el.user_id) && (
                                                        <div onClick={() => handleDeleteSuggest(el.id)} className="hover:bg-red-500 hover:text-white text-red-500 transition duration-500 cursor-pointer rounded-[5px] p-2"><CiCircleRemove className="text-[25px]" /></div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {addFeatures && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                                    <div className="w-full max-w-md bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6 animate-fadeIn">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-xl font-bold text-white">Ajout d'une feature</h2>
                                            <button onClick={() => { setAddFeatures(false); setFeaturesText("") }} className="text-gray-400 hover:text-white transition duration-500 cursor-pointer">✕</button>
                                        </div>
                                        <div className="my-5 flex flex-col gap-3 text-white/40">
                                            <p className="text-gray-300 text-[17px] leading-relaxed">Injectez une nouvelle feature dans le Core. Chaque ajout renforce le système. Déployez intelligemment.</p>
                                        </div>
                                        <div className="flex items-center gap-3 mb-5">
                                            <input value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} type="text" placeholder={`Balance ton idée !`} className="flex-1 h-10 px-4 rounded-lg bg-[#2a2a3d] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 text-sm sm:text-base" />
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={(e) => handleFeature(e)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium cursor-pointer transition duration-500">Envoyer</button>
                                            <button onClick={() => { setAddFeatures(false); setFeaturesText("") }} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium cursor-pointer duration-500">Fermer</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {addSuggest && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                                    <div className="w-full max-w-md bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6 animate-fadeIn">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-xl font-bold text-white">Ajout d'une suggestion</h2>
                                            <button onClick={() => { setAddSuggest(false); setSuggestText("") }} className="text-gray-400 hover:text-white transition duration-500 cursor-pointer">✕</button>
                                        </div>
                                        <div className="my-5 flex flex-col gap-3 text-white/40">
                                            <p className="text-gray-300 text-[17px] leading-relaxed">Tu veux voir une nouvelle feature ? Dis-nous ce que tu imagines, on pourrait bien la rendre réelle.</p>
                                        </div>
                                        <div className="flex items-center gap-3 mb-5">
                                            <input value={suggestText} onChange={(e) => setSuggestText(e.target.value)} type="text" placeholder={`Balance ton idée !`} className="flex-1 h-10 px-4 rounded-lg bg-[#2a2a3d] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 text-sm sm:text-base" />
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={(e) => handleSuggest(e)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium cursor-pointer transition duration-500">Envoyer</button>
                                            <button onClick={() => { setAddSuggest(false); setSuggestText("") }} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium cursor-pointer duration-500">Fermer</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className="border-b-1 border-gray-700/50"></div>
        </div>
    )
}