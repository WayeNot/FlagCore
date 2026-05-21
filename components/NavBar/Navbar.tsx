"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { MdAdminPanelSettings, MdExitToApp } from "react-icons/md"
import { useRouter } from "next/navigation"

import { useNavData } from "@/stores/store"

import AdminPanel from "../AdminPanel"
import { default_pp, Permissions, statusColor, } from "@/lib/config"
import { useApi } from "@/hooks/useApi"
import { FaFire } from "react-icons/fa"
import { SiOpslevel } from "react-icons/si"
import { RiCoinsFill, RiGitRepositoryPrivateFill } from "react-icons/ri";
import { IoWarning } from "react-icons/io5";
import { useNotif } from "../NotifProvider";
import ModalWarn from "../ui/sanction/ModalWarn";
import { FaUserGear } from "react-icons/fa6";
import { GiTeamIdea } from "react-icons/gi";
import ModalText from "../ui/ModalText";


export default function Navbar() {
    const { showNotif } = useNotif()
    const { call } = useApi()
    const { updateIsGuest, updateBio, updateCoins, updateMail, updatePermissions, updatePoints, updatePp_url, updatePublicUsername, updateRole, updateSocialMedia, updateStatus, updateUserId, updateUsername, isGuest, user_id, username, public_username, status, role, pp_url, coins, points, inMaintenance, warn, updateWarn, permissions } = useNavData()

    const router = useRouter()

    const [menuOpen, setMenuOpen] = useState(false)
    const [showAdminPanel, setShowAdminPanel] = useState(false)

    const [ displayCoinInfo, SetDisplayCoinInfo] = useState(false)
    const [ displayXpInfo, SetDisplayXpInfo] = useState(false)

    const [showWarn, setShowWarn] = useState(false)

    const handleLogout = async () => {
        updateIsGuest(false)
        updateBio("")
        updateCoins(0)
        updateMail("")
        updatePermissions([])
        updatePoints(0)
        updatePp_url("")
        updatePublicUsername("")
        updateRole([])
        updateStatus("offline")
        updateUserId(-1)
        updateUsername("")

        await call("/api/auth/logout", { method: "POST" })

        router.refresh()
        router.push("/accounts/login")
    }

    const handleWarn = async () => {
        setShowWarn(false)
        await fetch(`/api/users/${user_id}/sanctions/warn`, { method: "PATCH", body: JSON.stringify({ warn_id: warn?.id }) })
        if (warn) updateWarn({ ...warn, show_notif: false })
        showNotif("You have been informed of the warning!", "success")
    }

    return (
        <div>
            {isGuest && (
                <div>
                    <Link href="/accounts/login" className="inset-0 select-none flex items-center justify-center gap-3 text-white/40 p-4 w-full border text-[20px] text-center cursor-pointer hover:text-white/20 transition duration-500">Log in to save your progress !</Link>
                    <nav className="flex items-center justify-between p-4 sm:mx-5">
                        <div className="flex items-center">
                            <Link href="/home" className="text-xl h-fit sm:text-2xl text-white/60 font-mono mr-12">FlagCore</Link>
                            <div className="hidden sm:flex items-center gap-5 text-white/40">
                                <Link href="/home" className="hover:text-white/70 hover:text-underline border-2 border-[#212529] hover:border-t-2 hover:border-b-2 hover:border-t-white hover:border-b-white pt-1 pb-1 transition duration-500 font-mono text-[20px]">Accueil</Link>
                                <Link href="/tools" className="hover:text-white/70 border-2 border-[#212529] hover:border-t-2 hover:border-b-2 hover:border-t-white hover:border-b-white pt-1 pb-1 transition duration-500 font-mono ml-5 text-[20px]">Tools</Link>
                                <Link href="/challenges" className="hover:text-white/70 border-2 border-[#212529] hover:border-t-2 hover:border-b-2 hover:border-t-white hover:border-b-white pt-1 pb-1 transition duration-500 font-mono ml-5 mr-5 text-[20px]">Nos challenges</Link>
                            </div>
                        </div>
                        <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden text-white text-2xl">☰</button>
                        <div className="hidden sm:flex items-center text-white/40">
                            <div className="flex items-center gap-5 font-bold text-white/40 mr-10">
                                <p className="flex items-center gap-3 text-[18px] transition font-mono duration-500"><img src={pp_url || default_pp} alt="Logo de l'utilisateur" className={`w-10 bg-center bg-cover bg-no-repeat ${statusColor[status ?? "offline"]}`} /><span className="mx-2">-</span>{username}</p>
                            </div>
                            <MdExitToApp onClick={handleLogout} className="hover:text-red-400 cursor-pointer text-2xl transition duration-500" />
                        </div>
                    </nav>
                </div>
            )}
            {!isGuest && (
                <div>
                    {warn && warn.show_notif && warn.reason && (
                        <p onClick={() => setShowWarn(true)} className="flex items-center justify-center gap-3 text-white/40 p-4 rounded-lg w-full border border-orange-600 text-[20px] text-center cursor-pointer hover:text-white/20 transition duration-500"><IoWarning className="text-orange-500" />Vous avez actuellement un avertissement : <span className="text-orange-500">{warn?.reason}</span><IoWarning className="text-orange-500" /></p>
                    )}
                    <nav className="flex items-center justify-between p-4 sm:mx-5">
                        <div className="flex items-center">
                            <Link href="/home" className="text-xl h-fit sm:text-2xl text-white/60 font-mono mr-12">FlagCore</Link>
                            <div className="hidden sm:flex items-center gap-5 text-white/40">
                                <Link href="/home" className="hover:text-white/70 hover:text-underline border-2 border-[#212529] hover:border-t-2 hover:border-b-2 hover:border-t-white hover:border-b-white pt-1 pb-1 transition duration-500 font-mono text-[20px]">Home</Link>
                                <Link href="/tools" className="hover:text-white/70 border-2 border-[#212529] hover:border-t-2 hover:border-b-2 hover:border-t-white hover:border-b-white pt-1 pb-1 transition duration-500 font-mono ml-5 text-[20px]">Tools</Link>
                                <Link href="/challenges" className="hover:text-white/70 border-2 border-[#212529] hover:border-t-2 hover:border-b-2 hover:border-t-white hover:border-b-white pt-1 pb-1 transition duration-500 font-mono ml-5 text-[20px]">Challenges</Link>
                                <Link href="/room" className="hover:text-white/70 border-2 border-[#212529] hover:border-t-2 hover:border-b-2 hover:border-t-white hover:border-b-white pt-1 pb-1 transition duration-500 font-mono ml-5 mr-5 text-[20px]">Rooms</Link>
                            </div>
                        </div>
                        <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden text-white text-2xl">☰</button>
                        {Array.isArray(permissions) && permissions.includes(Permissions.advanced.administrator) && (
                            <div className="flex items-center gap-3">
                                <Link href="/team"><GiTeamIdea className="hover:text-white/60 text-white/40 cursor-pointer text-2xl transition duration-500" /></Link>
                            </div>
                        )}
                        <div className="hidden sm:flex items-center text-white/40">
                            <div className="flex items-center gap-5 font-bold text-white/40 mr-6">
                                <Link href={`/user/@${username}`} className="flex items-center gap-3 text-[18px] hover:text-white/70 transition font-mono duration-500"><img src={pp_url || default_pp} alt="Logo de l'utilisateur" className={`w-10 bg-center bg-cover bg-no-repeat ${statusColor[status ?? "offline"]}`} /><span className="mx-2">-</span>{username}</Link>
                            </div>
                            <p onClick={() => SetDisplayCoinInfo(true)} className="flex items-center gap-3 text-white/70 text-[20px] transition duration-500 cursor-pointer hover:text-white/40 ml-5"><RiCoinsFill />{coins}</p>
                            <p className="text-white/70 text-[20px] mx-5"> | </p>
                            <p onClick={() => SetDisplayXpInfo(true)} className="flex items-center gap-3 text-white/70 text-[20px] transition duration-500 cursor-pointer hover:text-white/40 mr-15"><SiOpslevel />{points}</p>
                            <div className="flex items-center gap-4">
                                <Link href={`/settings`}><FaUserGear className="hover:text-white/60 cursor-pointer text-2xl transition duration-500" /></Link>
                                <MdExitToApp onClick={handleLogout} className="hover:text-red-400 cursor-pointer text-2xl transition duration-500" />
                            </div>
                            <div className="flex ml-3 items-center gap-5 text-white/40">
                                {Array.isArray(permissions) && (permissions.includes(Permissions.advanced.administrator) || permissions.includes(Permissions.panelAdmin.canOpen)) && <div className="flex items-center gap-3"><MdAdminPanelSettings onClick={() => setShowAdminPanel(true)} className="font-bold text-[30px] hover:text-red-800 transition duration-500 cursor-pointer ml-7" /></div>}
                            </div>
                        </div>
                    </nav>
                </div >
            )}
            <hr className="text-white/40 m-auto mb-10" />
            {menuOpen && (
                <div className="sm:hidden px-4 pb-4 animate-fadeIn">
                    <div className="flex flex-col gap-3">
                        <Link href="/home"><button className="w-full text-left px-4 py-3 rounded-lg text-white/70 hover:bg-[#3a3a4d] transition duration-500">Accueil</button></Link>
                        <Link href="/tools"><button className="w-full text-left px-4 py-3 rounded-lg text-white/70 hover:bg-[#3a3a4d] transition duration-500">Tools</button></Link>
                        <Link href="/challenges"><button className="w-full text-left px-4 py-3 rounded-lg text-white/70 hover:bg-[#3a3a4d] transition duration-500">Nos challenges</button></Link>
                        <Link href="/accounts"><button className="w-full text-left px-4 py-3 rounded-lg bg-[#2a2a3d] text-white/70 hover:bg-[#3a3a4d] transition duration-500">Mon compte</button></Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition duration-500"><MdExitToApp />Déconnexion</button>
                    </div>
                </div>
            )}
            {showWarn && warn && warn?.reason && <ModalWarn id={warn.id} staff_id={warn?.staff_id} reason={warn?.reason} onSelect={handleWarn} />}
            {showAdminPanel && <AdminPanel closePanel={() => setShowAdminPanel(false)} />}
            {displayCoinInfo && <ModalText title="Explanation of coins" label="Coins are a form of 'currency' currently only used to buy clues. You will be able to acquire them by solving challenges!" btn="I got it." onSelect={() => SetDisplayCoinInfo(false)} />}
            {displayXpInfo && <ModalText title="Explanation of xp" label="XP is a system for the future of FlagCore; it will be used to unlock features later." btn="I got it." onSelect={() => SetDisplayXpInfo(false)} />}
        </div >
    )
}