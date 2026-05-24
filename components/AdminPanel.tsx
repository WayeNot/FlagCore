"use client"

import { useEffect, useState } from "react"
import { useNotif } from "./NotifProvider"
import { Flags, Option, Roles, User, UserProgression, UserRoles, UserSanctions, UserSessions, UserTransactions } from "@/lib/types"
import { IoMdCheckboxOutline, IoMdPersonAdd } from "react-icons/io"
import { MdCheckBoxOutlineBlank } from "react-icons/md"
import InputNumber from "./ModalInput"
import { coinManagement, colorClasses, colorRole, default_pp, Permissions, statusColor } from "@/lib/config"
import Link from "next/link"
import { useApi } from "@/hooks/useApi"
import { useNavData } from "@/stores/store"
import { LiaCriticalRole } from "react-icons/lia"
import { CiDatabase } from "react-icons/ci";
import DisplayBan from "./ui/sanction/DisplayBan";
import DisplayWarn from "./ui/sanction/DisplayWarn";
import DropDown from "./ui/DropDown";
import ModalBool from "./ui/ModalBool";

export default function AdminPanel({ closePanel }: { closePanel: () => void }) {
    const { showNotif } = useNotif()
    const { call } = useApi()

    const { inMaintenance, updateInMaintenance, permissions } = useNavData()

    const [panelTab, setPanelTab] = useState("")
    const [userTab, setUserTab] = useState("")

    const [users, setUsers] = useState<User[]>([])
    const [editUser, setEditUser] = useState(-1)

    const [userSessions, setUserSessions] = useState<UserSessions[]>([])
    const [userSanctions, setUserSanctions] = useState<UserSanctions[]>([])
    const [userTransactions, setUserTransactions] = useState<UserTransactions[]>([])
    const [userRoles, setUserRoles] = useState<UserRoles[]>([])
    type RoleOption = Option<number>;
    const [tempUserRoles, setTempUserRoles] = useState<RoleOption[]>([]);
    const [displayUserRoles, setDisplayUserRoles] = useState(false)
    const [userProgression, setUserProgression] = useState<UserProgression[]>([])
    const [displayChallenge, setDisplayChallenge] = useState<UserProgression | null>(null)
    const [modalRewards, setModalRewards] = useState<{ challengeId: number, flagId: number, flags: Flags[], isFind: boolean | null, challengeType: string, }>({ challengeId: -1, flagId: -1, flags: [], isFind: false, challengeType: "" })

    const [sanction, setSanction] = useState<UserSanctions>()

    const [roles, setRoles] = useState<Roles[]>([])

    const [roleCreation, setRoleCreation] = useState(-1) // -2 : Création de rôle | -1 : État initial | >= 0 : Modification du rôle avec cet id.
    const [editRole, setEditRole] = useState<Roles | null>(null)

    const [newRole, setNewRole] = useState<{ label: string; description: string; color: string; allPerms: string[]; }>({ label: "", description: "", color: "", allPerms: [] })
    const [selectedPerms, setSelectedPerms] = useState<string[]>([])

    const [showModal, setShowModal] = useState<null | "set" | "reset" | "warnUser" | "banUser" | "deleteAccount" | "displayReasonBan" | "displayReasonWarn">(null)

    useEffect(() => {
        if (panelTab === "Gestion des utilisateurs") getAllUser()
        if (panelTab === "Gestion des rôles") getAllRoles()
        if (userTab === "Sessions") getUserSessions()
        if (userTab === "Sanctions") getUserSanctions()
        if (userTab === "Gestion des coins") getUserTransactions();
        if (userTab === "Gestion des rôles") { getAllRoles(); getUserRoles(); }
        if (userTab === "Gestion de la progression") { getUserProgression() }
    }, [panelTab, userTab])

    useEffect(() => {
        if (roleCreation < 0) return;
        getSpecificRole()
    }, [roleCreation])

    const getSpecificRole = async () => {
        const data = await call(`/api/role/${roleCreation}`)
        setEditRole({ id: data.data.id, label: data.data.label, color: data.data.color, description: data.data.description });
        setSelectedPerms(data.data.relations.filter((r: any) => r && r.alias).map((r: any) => r.alias))
    }

    const allPermissions = [
        { label: "General permissions", canBeSelected: false },
        { label: "Admin panel access", description: "Members with this role will have access to the admin panel", alias: Permissions.panelAdmin.canOpen, canBeSelected: true },

        { label: "Creation permissions", canBeSelected: false },
        { label: "CTF creation", description: "Can create CTFs freely", alias: Permissions.contributor.canCreate.ctf, canBeSelected: true },
        { label: "Geoint creation", description: "Can create Geoint freely", alias: Permissions.contributor.canCreate.geoint, canBeSelected: true },
        { label: "Room creation", description: "Can create room freely", alias: Permissions.contributor.canCreate.rooom, canBeSelected: true },

        { label: "Admin panel permissions", canBeSelected: false, onlyIf: Permissions.panelAdmin.canOpen },

        { label: "Dashboard", description: "Members with this role will have access to the dashboard", alias: Permissions.panelAdmin.dashboard, canBeSelected: true, onlyIf: Permissions.panelAdmin.canOpen },
        { label: "User management", description: "Members with this role will have access to user management", alias: Permissions.panelAdmin.manageUser, canBeSelected: true, onlyIf: Permissions.panelAdmin.canOpen },
        { label: "Role management", description: "Members with this role can view, create, and delete roles.", alias: Permissions.panelAdmin.role, canBeSelected: true, onlyIf: Permissions.panelAdmin.canOpen },
        { label: "Logs & Security", description: "Members with this role can manage logs and server security.", alias: Permissions.panelAdmin.logs, canBeSelected: true, onlyIf: Permissions.panelAdmin.canOpen },

        { label: "User management permissions", canBeSelected: false, onlyIf: Permissions.panelAdmin.manageUser },

        { label: "Information", description: "Members with this role will have access to user information.", alias: Permissions.panelAdmin.user.informations, canBeSelected: true, onlyIf: Permissions.panelAdmin.manageUser },
        { label: "User dashboard", description: "Members with this role will have access to the user's dashboard.", alias: Permissions.panelAdmin.user.dashboard, canBeSelected: true, onlyIf: Permissions.panelAdmin.manageUser },
        { label: "Session management", description: "Members with this role can view sessions, activate/deactivate them, and delete all sessions.", alias: Permissions.panelAdmin.user.session, canBeSelected: true, onlyIf: Permissions.panelAdmin.manageUser },
        { label: "Sanctions management", description: "Members with this role can view sanctions, warn and ban the user.", alias: Permissions.panelAdmin.user.sanctions, canBeSelected: true, onlyIf: Permissions.panelAdmin.manageUser },
        { label: "Coins management", description: "Members with this role can view transactions, add/remove coins and reset them.", alias: Permissions.panelAdmin.user.coins, canBeSelected: true, onlyIf: Permissions.panelAdmin.manageUser },
        { label: "User roles management", description: "Members with this role can view user roles and assign/remove them.", alias: Permissions.panelAdmin.user.role, canBeSelected: true, onlyIf: Permissions.panelAdmin.manageUser },
        { label: "Progression management", description: "Members with this role can control user progression.", alias: Permissions.panelAdmin.user.progression, canBeSelected: true, onlyIf: Permissions.panelAdmin.manageUser },
        { label: "Monitoring / debug", description: "Members with this role can debug / assist the user.", alias: Permissions.panelAdmin.user.monitoring, canBeSelected: true, onlyIf: Permissions.panelAdmin.manageUser },

        { label: "Room management permissions", canBeSelected: false, onlyIf: Permissions.room.canCreateChallenge },
        { label: "Can create room challenge", description: "Can create challenge freely", alias: Permissions.room.canCreateChallenge, canBeSelected: true },
        { label: "Create invite code", description: "Can create invide code for the room freely", alias: Permissions.room.canCreateChallenge, canBeSelected: true },

        { label: "Advanced permissions", canBeSelected: false },
        { label: "Administrator", description: "Members with this permission have all permissions and can bypass restrictions.", alias: "advanced.administrator", canBeSelected: true },
    ]

    const panelTabLabel = [
        { label: "Dashboard", perm: Permissions.panelAdmin.canOpen },
        { label: "Gestion des utilisateurs", perm: Permissions.panelAdmin.manageUser },
        { label: "Gestion des rôles", perm: Permissions.panelAdmin.role },
        { label: "Gestion des challenges", perm: Permissions.panelAdmin.challenges },
        { label: "Soumission des flags", perm: Permissions.panelAdmin.flags },
        { label: "ScoreBoard", perm: Permissions.panelAdmin.scoreboard },
        { label: "Gestion des annonces", perm: Permissions.panelAdmin.announcement },
        { label: "Paramètres", perm: Permissions.panelAdmin.settings },
        { label: "Logs & Sécurité", perm: Permissions.panelAdmin.logs },
    ]

    const panelUserLabel = [
        { label: "Informations", perm: Permissions.panelAdmin.user.informations },
        { label: "Dashboard", perm: Permissions.panelAdmin.user.dashboard },
        { label: "Sessions", perm: Permissions.panelAdmin.user.session },
        { label: "Sanctions", perm: Permissions.panelAdmin.user.sanctions },
        { label: "Gestion des coins", perm: Permissions.panelAdmin.user.coins },
        { label: "Gestion des rôles", perm: Permissions.panelAdmin.user.role },
        { label: "Gestion de la progression", perm: Permissions.panelAdmin.user.progression },
        { label: "Monitoring / débug", perm: Permissions.panelAdmin.user.monitoring },
    ]

    // PanelTab ↓

    // -- Gestion des utilisateurs -- ↓

    const getAllUser = async () => {
        const data = await call("/api/users")
        setUsers(await data.data)
    }

    // -- Gestion des rôles -- ↓

    const getAllRoles = async () => {
        const data = await call(`/api/roles`)
        setRoles(data.data)
    }

    // UserTab ↓

    // Dashboard utilisateur ↓

    const getUserProgression = async () => {
        const data = await call(`/api/admin/${editUser}/progression`)
        setUserProgression(data.data)
    }

    // Administration des sessions de l'utilisateur ↓

    const getUserSessions = async () => {
        const data = await call(`/api/admin/${editUser}/session`)
        setUserSessions(data.data)
    }

    const getUserSanctions = async () => {
        const data = await call(`/api/admin/${editUser}/sanctions`)
        setUserSanctions(data.data)
    }

    const getUserTransactions = async () => {
        const data = await call(`/api/admin/${editUser}/transactions`)
        setUserTransactions(data.data)
    }

    const getUserRoles = async () => {
        const data = await call(`/api/admin/${editUser}/roles`)
        setUserRoles(data.data)
        setTempUserRoles(data.data.map((r: any) => ({ label: r.label, value: r.role_id, color: r.color })))
    }

    const handleChangeSession = async (user_id: number, session_id: string, is_active: boolean) => {
        await call(`/api/admin/${editUser}/session`, { method: "PATCH", body: JSON.stringify({ session_id: session_id, is_active: is_active }) })
        setUserSessions(prev => prev.map(session => session.session_id === session_id && session.user_id === user_id ? { ...session, is_active: !is_active } : session))
        is_active ? showNotif(`Session n°${session_id} bien désactivée !`, "success") : showNotif(`Session n°${session_id} bien activée !`, "success")
    }

    const closeAllSession = async () => {
        await call(`/api/admin/${editUser}/session/closeAllSessions`, { method: "PATCH" })
        setUserSessions(prev => prev.map(session => session.is_active ? { ...session, is_active: false } : session))
        showNotif("All sessions have been successfully deactivated !", "success")
    }

    const resetPassword = async () => {
        await call(`/api/admin/${editUser}/session/resetPassword`, { method: "POST" }, ["Password reset successfully sent !"])
    }

    // Sanction sur l'utilisateur ↓

    const warnUser = async (reason: string) => {
        await call(`/api/admin/${editUser}/sanctions/warn`, { method: "POST", body: JSON.stringify({ reason: reason }) }, [`The user with the ID ${editUser} has been notified !`])
        setShowModal(null)
    }

    const banUser = async (reason: string, duration: number) => {
        await call(`/api/admin/${editUser}/sanctions/ban`, { method: "POST", body: JSON.stringify({ reason: reason, duration: duration }) }, [`The user with the ID ${editUser} has been successfully banned. ${duration === 0 ? "definitely" : "temporarily"} !`])
        closeAllSession()
        setShowModal(null)
    }

    const deleteUserAccount = async (reason: string) => {
        await call(`/api/admin/${editUser}/sanctions/deleteAccount`, { method: "DELETE", body: JSON.stringify({ reason: reason }) }, [`The user account with the id ${editUser} has been successfully deleted !`])
        closeEditUser()
        setShowModal(null)
        setPanelTab("Dashboard")
    }

    // Administration des coins de l'utilisateur ↓

    const updateCoin = async (value: number, reason: string) => {
        const data = await call(`/api/users/${editUser}/coin/`, { method: "PATCH", body: JSON.stringify({ operation: `${value < 0 ? "remove_coins" : "add_coins"}`, value: Math.abs(value), reason: reason || "" }) }, ["Nombre de coins bien mis à jour !"])
        setUsers(prev => prev.map(user => user.user_id === editUser ? { ...user, coins: data.newSold } : user))
        setShowModal(null)
    }

    const setCoins = async (value: any, reason: string = "") => {
        if (typeof value === "string") value = value.trim()

        if (value === "" || value === "+" || value === "-") {
            showNotif("Please enter a valid number !")
            return
        }

        const num = Number(value)

        if (isNaN(num)) {
            showNotif("Please enter a valid number !")
            return
        }
        setShowModal(null)
        const data = await call(`/api/users/${editUser}/coin`, { method: "PATCH", body: JSON.stringify({ operation: "set_coins", value: Math.abs(num), reason: reason || "" }) }, ["Nombre de coins set avec succès !"])
        setUsers(prev => prev.map(user => user.user_id === editUser ? { ...user, coins: data.newSold } : user))
    }

    const resetCoins = async (reason: string = "") => {
        await call(`/api/users/${editUser}/coin`, { method: "PATCH", body: JSON.stringify({ operation: "reset_coins", value: 0, reason: reason || "" }) }, ["Nombre de coins reset avec succès !"])
        setUsers(prev => prev.map(user => user.user_id === editUser ? { ...user, coins: 0 } : user))
        setShowModal(null)
    }

    // Admministration sur la gestion des rôles de l'utilisateur ↓

    const handleCreateRole = async () => {
        if (!newRole || !newRole.label || !newRole.description) {
            showNotif("Please fill in all fields !")
            return
        }

        const perms = allPermissions.filter((v): v is typeof v & { alias: string } => v.canBeSelected && newRole.allPerms.includes(v.alias || "") && typeof v.alias === "string").map(p => p.alias);

        const updatedRole = { ...newRole, allPerms: perms }

        const data = await call(`/api/roles`, { method: "POST", body: JSON.stringify({ role: updatedRole }) }, ["Well-created role !"])
        setRoles(prev => [...prev, data.data])
        setRoleCreation(-1)
        setNewRole({ label: "", description: "", color: "", allPerms: [] })
    }

    const handleEditRole = async () => {
        if (!editRole || !editRole.label || !editRole.description) {
            showNotif("Please fill in all fields !")
            return
        }

        const perms = allPermissions.filter((v): v is typeof v & { alias: string } => v.canBeSelected && selectedPerms.includes(v.alias || "") && typeof v.alias === "string").map(p => p.alias);

        const updatedRole = { ...editRole, allPerms: perms }
        const data = await call(`/api/role/${editRole.id}`, { method: "PATCH", body: JSON.stringify({ role: updatedRole }) })
        setRoles(data.data)
        closeEditUser()
    }

    const handleDeleteRole = async () => {
        await call(`/api/role/${editRole?.id}`, { method: "DELETE" })
        setRoles(roles.filter(r => r.id !== editRole?.id))
        closeEditUser()
    }

    const handleSetRoles = async () => {
        await call(`/api/admin/${editUser}/roles/update`, { method: "POST", body: JSON.stringify({ roles: tempUserRoles }) }, [`The roles of the user with the id ${editUser} have indeed changed !`])
        getUserRoles();
    }

    // Gestion de la progression de l'utilisateur ↓

    const handleEditFlag = async (challengeId: number, flagId: number, isFind: boolean, challengeType: string, reward: boolean) => {
        setModalRewards({ challengeId: -1, flagId: -1, flags: [], isFind: false, challengeType: "" })
        await call(`/api/admin/${editUser}/progression/updateFlag`, { method: "PATCH", body: JSON.stringify({ challengeId: challengeId, flagId: flagId, isFind: isFind, challengeType: challengeType, reward: reward }) }, [`${isFind ? "Remove Flag successfully !" : "Mark as Found successfully !"}`])

        setUserProgression(prev => prev.map(challenge => {
            if (challenge.id !== challengeId) return challenge;

            return {
                ...challenge, flags: challenge.flags.map(flag => {
                    if (flag.id !== flagId) return flag;

                    return {
                        ...flag, is_find: !isFind, flag_found_date: !isFind ? new Date().toISOString() : ""
                    }
                })
            }
        }))

        setDisplayChallenge(prev => {
            if (!prev || prev.id !== challengeId) return prev;

            return {
                ...prev,
                flags: prev.flags.map(flag => {
                    if (flag.id !== flagId) return flag;

                    return {
                        ...flag,
                        is_find: !isFind,
                        flag_found_date: !isFind ? new Date().toISOString() : ""
                    };
                })
            };
        });
    };

    const updateChallengeProgress = async (challengeId: number, flags: Flags[], challengeType: string, markAsFound: boolean, reward: boolean) => {
        setModalRewards({ challengeId: -1, flagId: -1, flags: [], isFind: false, challengeType: "" })
        await call(`/api/admin/${editUser}/progression/updateChallengeProgress`, { method: "PATCH", body: JSON.stringify({ challengeId: challengeId, flags: flags, challengeType: challengeType, markAsFound: markAsFound, reward: reward }) }, [`${markAsFound ? "Mark as Found successfully !" : "Reset Progress successfully !"}`])

        setUserProgression(prev => prev.map(challenge => {
            if (challenge.id !== challengeId) return challenge;

            return {
                ...challenge, flags: challenge.flags.map(flag => {
                    return {
                        ...flag, is_find: markAsFound
                    }
                })
            }
        }))

        setDisplayChallenge(prev => {
            if (!prev || prev.id !== challengeId) return prev;

            return {
                ...prev,
                flags: prev.flags.map(flag => {
                    return {
                        ...flag,
                        is_find: markAsFound
                    };
                })
            };
        });
    }

    // 

    const setMaintenance = async () => {
        await call("/api/admin/maintenance", { method: "PATCH", body: JSON.stringify({ inMaintenance: !inMaintenance }) }, [inMaintenance ? "Maintenance terminée avec succès !" : "Maintenance activée avec succès !"])
        updateInMaintenance(!inMaintenance)
    }

    const closeEditUser = () => {
        setEditUser(-1)
        setRoleCreation(-1)
        setShowModal(null)
        setUserTab("Informations")
        setDisplayUserRoles(false)
        setNewRole({ label: "", description: "", color: "", allPerms: [] })
    }

    return (
        <div id="overlay" className="fixed inset-0 z-50 flex items-center justify-center gap-15 bg-black/70 backdrop-blur-sm">
            <div className="w-7/8 h-9/10 bg-[#212529] border border-red-500/60 shadow-2xl p-6 animate-fadeIn">
                <div className="flex justify-between gap-5 max-h-[50vh] overflow-y-auto pr-2 text-center text-white/70">
                    <h2 className="font-bold italic text-[25px]">FlagCore</h2>
                    <h2 className="text-white/70 text-[25px] font-mono font-bold">ADMIN PANEL</h2>
                    <button onClick={closePanel} className="text-gray-400 hover:text-white text-[25px] cursor-pointer transition duration-500">✕</button>
                </div>
                <hr className="my-5 border-white/30" />
                <div className="flex items-center justify-center w-full gap-3 mb-4">
                    {panelTabLabel.map((v, k) => Array.isArray(permissions) && (permissions.includes(Permissions.advanced.administrator) || permissions.includes(v.perm)) && <button key={k} onClick={() => setPanelTab(v.label)} className={`${panelTab === v.label ? "text-red-500" : "text-white/40"} font-mono px-2 text-[15px] py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#212529]`}>{v.label}</button>)}
                </div>
                {Array.isArray(permissions) && (permissions.includes(Permissions.advanced.administrator) || permissions.includes(Permissions.panelAdmin.dashboard)) && panelTab === "Dashboard" && (
                    <div className="flex flex-col gap-5 mt-5">
                        {/* Dashboard à dèv */}
                    </div>
                )}
                {Array.isArray(permissions) && (permissions.includes(Permissions.advanced.administrator) || permissions.includes(Permissions.panelAdmin.manageUser)) && panelTab === "Gestion des utilisateurs" && (
                    <div className="w-full">
                        <div className="flex items-center gap-3 w-full">
                            {Array.isArray(users) && users.map((el) => (
                                <div onClick={() => { setEditUser(el.user_id); }} key={el.user_id} className="border border-gray-600 text-white/40 w-1/10 py-3 hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer">
                                    <p className="text-center">{el.user_id} | {el.username}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {Array.isArray(permissions) && (permissions.includes(Permissions.advanced.administrator) || permissions.includes(Permissions.panelAdmin.role)) && panelTab === "Gestion des rôles" && (
                    <div className="flex flex-col gap-5 mt-5">
                        <button onClick={() => setRoleCreation(-2)} className="border border-gray-600 text-white/40 w-fit p-3 hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center">Create role</button>
                        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/30"><span className="h-px w-6 bg-white/20" />Rôles ↓<span className="h-px flex-1 bg-white/10" /></div>
                        <div className="my-2">
                            <div className="flex items-center gap-3">
                                {roles.length === 0 && "Aucun rôle pour le moment !"}
                                {roles.map((v, k) => <button key={k} onClick={() => setRoleCreation(v.id)} className={`${v.color} border border-gray-600 text-white/40 w-fit p-3 hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center flex items-center flex-col gap-2`}><p>{v?.label}</p></button>)}
                            </div>
                        </div>
                    </div>
                )}
                {Array.isArray(permissions) && (permissions.includes(Permissions.advanced.administrator) || permissions.includes(Permissions.panelAdmin.logs)) && panelTab === "Logs & Sécurité" && (
                    <div>
                        {inMaintenance ? (
                            <button onClick={() => setMaintenance()} className="flex items-center gap-3 text-white/40 p-4 border border-gray-600 rounded-[7px] hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center"><IoMdCheckboxOutline />Terminer la maintenance</button>
                        ) : (
                            <button onClick={() => setMaintenance()} className="flex items-center gap-3 text-red-500 p-4 border border-gray-600 rounded-[7px] hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center"><MdCheckBoxOutlineBlank />Mettre le site en maintenance</button>
                        )}
                    </div>
                )}
                {Array.isArray(permissions) && (permissions.includes(Permissions.advanced.administrator) || permissions.includes(Permissions.panelAdmin.role)) && roleCreation === -2 && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl animate-fadeIn">
                        <div className="flex w-full max-w-6xl gap-4">
                            <div className="w-1/2 bg-[#151522] border border-white/10 rounded-2xl text-white flex flex-col shadow-2xl overflow-hidden">
                                <div className="relative flex flex-col items-center text-center px-8 py-9 w-full">
                                    <div className="flex items-center justify-center w-16 h-16 rounded-3xl bg-linear-to-br from-yellow-400/20 to-yellow-500/10 border border-yellow-400/20 text-yellow-400 text-2xl shadow-inner mb-6"><LiaCriticalRole /></div>
                                    <div className="flex items-center flex-col gap-2">
                                        <h2 className="text-2xl font-semibold tracking-tight text-white">Creating a role</h2>
                                        <p className="text-sm text-gray-400 leading-relaxed max-w-65">Create any role using our configurator !</p>
                                    </div>
                                    <div className="w-2/3 flex flex-col gap-2 mt-5">
                                        <div className="flex flex-col items-center gap-3">
                                            <input className="w-full p-2 bg-[#2a2a3d] rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500" placeholder="Role Title" value={newRole.label} onChange={e => setNewRole(prev => ({ ...prev, label: e.target.value }))} />
                                            <textarea className="w-full p-2 bg-[#2a2a3d] rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500 resize-none h-20" placeholder="Role Description" value={newRole.description} onChange={e => setNewRole(prev => ({ ...prev, description: e.target.value }))} />
                                            <div className="w-full flex flex-col">
                                                <hr className="my-5 border-gray-600 w-full" />
                                                <div className="flex items-center justify-center flex-wrap w-full gap-3">
                                                    {colorRole.map((v, k) => <button onClick={() => setNewRole(prev => ({ ...prev, color: colorClasses[v] }))} key={k} className={`${newRole.color === colorClasses[v] && "border-2 border-green-800 w-10 h-10"} w-7.5 h-7.5 rounded-full ${colorClasses[v]} cursor-pointer transition duration-500 hover:border-2 hover:border-white/40`}></button>)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex w-full gap-3 mt-3">
                                            <button onClick={() => setRoleCreation(-1)} className="flex-1 py-2.5 border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition duration-500 cursor-pointer active:scale-95">Back</button>
                                            <button onClick={handleCreateRole} className="flex-1 py-2.5 border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition duration-500 cursor-pointer active:scale-95">Create</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/2 bg-[#151522] border border-white/10 rounded-2xl text-white flex flex-col shadow-2xl overflow-hidden">
                                <div className="relative flex flex-col items-center text-center px-8 py-9 w-full">
                                    <div className="flex items-center justify-center w-16 h-16 rounded-3xl bg-linear-to-br from-yellow-400/20 to-yellow-500/10 border border-yellow-400/20 text-yellow-400 text-2xl shadow-inner mb-6"><IoMdPersonAdd /></div>
                                    <div className="flex items-center flex-col gap-2">
                                        <h2 className="text-2xl font-semibold tracking-tight text-white">Permissions management</h2>
                                        <p className="text-sm text-gray-400 leading-relaxed max-w-65">Add all the permissions you need !</p>
                                    </div>
                                    <div className="flex flex-col gap-2 mt-5 bg-[#2a2a3d] w-full p-2 max-h-75 overflow-y-scroll">
                                        {allPermissions.length === 0 && <button className="w-full p-2 bg-[#2a2a3d] rounded-lg text-sm outline-none">No permission granted at this time !</button>}
                                        {allPermissions.map((v, k) => {
                                            const hasPermission = newRole.allPerms.includes(v.alias || "");
                                            const canDisplay = !v.onlyIf || newRole.allPerms.includes(v.onlyIf || "");

                                            if (!v.canBeSelected) {
                                                return (
                                                    <div key={k} className={`flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/30 mb-2 ${k !== 0 && "mt-3"}`}><span className="h-px w-6 bg-white/20" />{v.label}<span className="h-px flex-1 bg-white/10" /></div>
                                                )
                                            }

                                            if (!v.alias || !canDisplay) return null

                                            return (
                                                <button key={k} onClick={() => setNewRole(prev => ({ ...prev, allPerms: hasPermission ? prev.allPerms.filter(p => p !== v.alias) : [...prev.allPerms, v.alias] }))} className={`rounded-lg w-full p-2 text-sm outline-none cursor-pointer transition duration-500 flex items-start justify-start text-start flex-col gap-2 ${hasPermission ? "bg-green-500/40 hover:bg-green-700/40" : "bg-[#151522] hover:bg-[#151522]/80"}`}>
                                                    <div className="flex items-center justify-between w-full">
                                                        <p className="font-bold">{v.label}</p>
                                                        <p className="font-semibold text-[10px] italic">( {v.alias} )</p>
                                                    </div>
                                                    <p className="italic text-[12px]">{v.description}</p>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {Array.isArray(permissions) && (permissions.includes(Permissions.advanced.administrator) || permissions.includes(Permissions.panelAdmin.role)) && roleCreation >= 0 && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl animate-fadeIn">
                        <div className="flex w-full max-w-6xl gap-4">
                            <div className="w-1/2 bg-[#151522] border border-white/10 rounded-2xl text-white flex flex-col shadow-2xl overflow-hidden">
                                <div className="relative flex flex-col items-center text-center px-8 py-9 w-full">
                                    <div className="flex items-center justify-center w-16 h-16 rounded-3xl bg-linear-to-br from-yellow-400/20 to-yellow-500/10 border border-yellow-400/20 text-yellow-400 text-2xl shadow-inner mb-6"><LiaCriticalRole /></div>
                                    <div className="flex items-center flex-col gap-2">
                                        <h2 className="text-2xl font-semibold tracking-tight text-white">Edit role</h2>
                                        <p className="text-sm text-gray-400 leading-relaxed max-w-65">Change this role using our configurator !</p>
                                    </div>
                                    <div className="w-full flex flex-col gap-2 mt-5">
                                        <div className="flex flex-col items-center gap-3">
                                            <input className="w-full p-2 bg-[#2a2a3d] rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500" placeholder="Role Title" value={editRole?.label || ""} onChange={(e) => setEditRole(prev => prev ? { ...prev, label: e.target.value } : null)} />
                                            <textarea className="w-full p-2 bg-[#2a2a3d] rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500 resize-none h-20" placeholder="Role Description" value={editRole?.description || ""} onChange={(e) => setEditRole(prev => prev ? { ...prev, description: e.target.value } : null)} />
                                            <div className="w-full flex flex-col">
                                                <hr className="my-5 border-gray-600 w-full" />
                                                <div className="flex items-center justify-center flex-wrap w-full gap-3">
                                                    {colorRole.map((v, k) => <button key={k} onClick={() => setEditRole(prev => prev ? { ...prev, color: colorClasses[v] } : null)} className={`${editRole?.color === colorClasses[v] && "border-2 border-green-800 w-10 h-10"} w-7.5 h-7.5 rounded-full ${colorClasses[v]} cursor-pointer transition duration-500 hover:border-2 hover:border-white/40`}></button>)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex w-full gap-3 mt-3">
                                            <button onClick={() => setRoleCreation(-1)} className="flex-1 py-2.5 border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition duration-500 cursor-pointer active:scale-95">Back</button>
                                            <button onClick={handleDeleteRole} className="flex-1 py-2.5 border border-white/10 bg-white/5 text-gray-300 hover:bg-red-500/30 hover:text-white transition duration-500 cursor-pointer active:scale-95">Delete</button>
                                            <button onClick={handleEditRole} className="flex-1 py-2.5 border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition duration-500 cursor-pointer active:scale-95">Save Changes</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/2 bg-[#151522] border border-white/10 rounded-2xl text-white flex flex-col shadow-2xl overflow-hidden">
                                <div className="relative flex flex-col items-center text-center px-8 py-9 w-full">
                                    <div className="flex items-center justify-center w-16 h-16 rounded-3xl bg-linear-to-br from-yellow-400/20 to-yellow-500/10 border border-yellow-400/20 text-yellow-400 text-2xl shadow-inner mb-6"><IoMdPersonAdd /></div>
                                    <div className="flex items-center flex-col gap-2">
                                        <h2 className="text-2xl font-semibold tracking-tight text-white">Permissions management</h2>
                                        <p className="text-sm text-gray-400 leading-relaxed max-w-65">Add all the permissions you need!</p>
                                    </div>
                                    <div className="flex flex-col gap-2 mt-5 bg-[#2a2a3d] w-full p-2 max-h-75 overflow-y-scroll">
                                        {allPermissions.map((v, k) => {
                                            const hasPermission = selectedPerms.includes(v.alias || "")
                                            const canDisplay = !v.onlyIf || selectedPerms.includes(v.onlyIf || "");

                                            if (!v.canBeSelected) {
                                                return (
                                                    <div key={k} className={`flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/30 mb-2 ${k !== 0 && "mt-3"}`}><span className="h-px w-6 bg-white/20" />{v.label}<span className="h-px flex-1 bg-white/10" /></div>
                                                )
                                            }

                                            if (!v.alias || !canDisplay) return null

                                            return (
                                                <button key={k} onClick={() => setSelectedPerms(prev => hasPermission ? prev.filter(p => p !== v.alias) : [...prev, v.alias])} className={`rounded-lg w-full p-2 text-sm outline-none cursor-pointer transition duration-500 flex items-start justify-start text-start flex-col gap-2 ${hasPermission ? "bg-green-500/40 hover:bg-green-700/40" : "bg-[#151522] hover:bg-[#151522]/80"}`}>
                                                    <div className="flex items-center justify-between w-full">
                                                        <p className="font-bold">{v.label}</p>
                                                        <p className="font-semibold text-[10px] italic">( {v.alias} )</p>
                                                    </div>
                                                    <p className="italic text-[12px]">{v.description}</p>
                                                </button>
                                            )
                                        })}
                                        {allPermissions.length === 0 && <button className="w-full p-2 bg-[#2a2a3d] rounded-lg text-sm outline-none">Aucune permission pour le moment !</button>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {Array.isArray(permissions) && (permissions.includes(Permissions.advanced.administrator) || permissions.includes(Permissions.panelAdmin.manageUser)) && editUser !== -1 && (
                <div className="w-7/8  min-h-0 absolute h-9/10 bg-[#212529] border border-red-500/60 shadow-2xl p-6 animate-fadeIn">
                    <div className="flex justify-between gap-5 max-h-[50vh] overflow-y-auto pr-2 text-center text-white/70">
                        <h2 className="font-bold italic text-[25px]">FlagCore</h2>
                        <h2 className="text-white/70 text-[25px] font-mono font-bold">ADMIN PANEL - {userTab || "Gestion utilisateur"}</h2>
                        <button onClick={closeEditUser} className="text-gray-400 hover:text-white text-[25px] cursor-pointer transition duration-500">✕</button>
                    </div>
                    <hr className="my-5 border-white/30" />
                    <div className="flex items-center justify-center w-full gap-3 mb-4">
                        {panelUserLabel.map((v, k) => Array.isArray(permissions) && (permissions.includes(Permissions.advanced.administrator) || permissions.includes(v.perm)) && <button key={k} onClick={() => setUserTab(v.label)} className={`${userTab === v.label ? "text-red-500" : "text-white/40"} font-mono px-2 text-[15px] py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#212529]`}>{v.label}</button>)}
                    </div>
                    {Array.isArray(permissions) && (permissions.includes(Permissions.advanced.administrator) || permissions.includes(Permissions.panelAdmin.user.informations)) && userTab === "Informations" && users.filter(el => el.user_id === editUser).map(el => (
                        <div key={el.user_id} className="flex flex-col gap-5 text-white">
                            <div className="flex items-center gap-5 font-bold text-white/40 mr-6">
                                <Link href={`/user/@${el.username}`} className="flex items-center gap-3 text-[25px] hover:text-white/70 transition font-mono duration-500"><img src={el.pp_url || default_pp} alt="Logo de l'utilisateur" className={`w-20 bg-center bg-cover bg-no-repeat ${`${statusColor[el.status] || ""}`}`} /><span className="mx-2">-</span>{el.username} ( Session : {el.is_online ? <span className="text-green-700">Active</span> : <span className="text-red-700">Inactive</span>} )</Link>
                            </div>
                            <p className="flex items-center gap-3 text-[20px] w-fit">Inscrit depuis le : {new Date(el.created_at).toLocaleString()}</p>
                        </div>
                    ))}
                    {Array.isArray(permissions) && (permissions.includes(Permissions.advanced.administrator) || permissions.includes(Permissions.panelAdmin.user.dashboard)) && userTab === "Dashboard" && users.filter(el => el.user_id === editUser).map(el => (
                        <p key={el.user_id}>Dashboard</p>
                    ))}
                    {Array.isArray(permissions) && (permissions.includes(Permissions.advanced.administrator) || permissions.includes(Permissions.panelAdmin.user.session)) && userTab === "Sessions" && (
                        <div className="flex flex-col gap-5">
                            <button onClick={closeAllSession} className="w-fit text-center text-white/40 p-4 border border-gray-600 rounded-[7px] hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer flex items-center gap-3">Fermer toutes les sessions de l'utilisateur</button>
                            <button onClick={resetPassword} className="w-fit text-center text-white/40 p-4 border border-gray-600 rounded-[7px] hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer flex items-center gap-3">Réinitialiser le mot de passe</button>
                            {userSessions.length === 0 ? <h2 className="text-white/70">Aucune session pour le moment !</h2> :
                                <div className="max-h-[calc(100vh-370px)] overflow-y-auto overflow-x-auto rounded-xl border border-white/10">
                                    <table className="min-w-225 w-full text-left border-collapse">
                                        <thead className="bg-black/40 sticky top-0">
                                            <tr className="text-white/40 text-sm font-semibold">
                                                <th className="p-4">Id</th>
                                                <th className="p-4">Session ID</th>
                                                <th className="p-4">Date</th>
                                                <th className="p-4">Statut</th>
                                                <th className="p-4 text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userSessions.map((v, k) => <tr key={k} className="border-t border-white/10 hover:bg-white/5 transition duration-300">
                                                <td className="p-4"><div className="flex items-center gap-2 text-white/40"><CiDatabase /><span>{k}</span></div></td>
                                                <td className="p-4"><span className="text-white/70">{v.session_id}</span></td>
                                                <td className="p-4"><span className={`px-3 py-1 text-white/70`}>{new Date(v.connected_at).toLocaleString()}</span></td>
                                                <td className="p-4"><span className={`px-3 py-1 ${v.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{v.is_active ? "Active" : "Inactive"}</span></td>
                                                <td className="p-4"><button onClick={() => handleChangeSession(v.user_id, v.session_id, v.is_active)} className={`px-3 py-1 transition duration-500 cursor-pointer ${v.is_active ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-green-500/20 text-green-400 hover:bg-green-500/30"}`}>{v.is_active ? "Désactiver" : "Activer"}</button></td>
                                            </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            }
                        </div>
                    )}
                    {Array.isArray(permissions) && (permissions.includes(Permissions.advanced.administrator) || permissions.includes(Permissions.panelAdmin.user.sanctions)) && userTab === "Sanctions" && (
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setShowModal("warnUser")} className="w-fit text-center text-white/40 p-4 border border-gray-600 rounded-[7px] hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer flex items-center gap-3">Avertir l'utilisateur</button>
                                <button onClick={() => setShowModal("banUser")} className="w-fit text-center text-white/40 p-4 border border-gray-600 rounded-[7px] hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer flex items-center gap-3">Bannir l'utilisateur</button>
                                <button onClick={() => setShowModal("deleteAccount")} className="w-fit text-center text-white/40 p-4 border border-gray-600 rounded-[7px] hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer flex items-center gap-3">Supprimer le compte de l'utilisateur</button>
                            </div>
                            {userSanctions.length === 0 ? <h2 className="text-white/70">Aucune sanction pour le moment !</h2> :
                                <div className="max-h-[calc(100vh-370px)] overflow-y-auto overflow-x-auto rounded-xl border border-white/10">
                                    <table className="min-w-225 w-full text-left border-collapse">
                                        <thead className="bg-black/40 sticky top-0">
                                            <tr className="text-white/40 text-sm font-semibold">
                                                <th className="p-4">Id</th>
                                                <th className="p-4">Type</th>
                                                <th className="p-4">Raison</th>
                                                <th className="p-4">Durée ( minute )</th>
                                                <th className="p-4">User Id</th>
                                                <th className="p-4">Staff Id</th>
                                                <th className="p-4">Date</th>
                                                <th className="p-4">Date d'expiration</th>
                                                <th className="p-4">Statut</th>
                                                {/* <th className="p-4 text-center">Action</th> */}
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {userSanctions.map((v, k) => <tr key={k} className="border-t border-white/10 hover:bg-white/5 transition duration-300 w-full">
                                                <td className="p-4"><div className="flex items-center gap-2 text-white/40"><CiDatabase /><span>{v.id}</span></div></td>
                                                <td className="p-4"><span className="text-white/70">{v?.type}</span></td>
                                                <td onClick={() => { setSanction(v); v?.type === "ban" ? setShowModal("displayReasonBan") : setShowModal("displayReasonWarn") }} className="p-4 max-w-50"><span className="block text-white/70 cursor-pointer transition duration-500 hover:text-white/40 truncate">{v?.reason}</span></td>
                                                <td className="p-4"><span className="text-white/70">{v?.duration}</span></td>
                                                <td className="p-4"><span className="text-white/70">{v?.user_id}</span></td>
                                                <td className="p-4"><span className="text-white/70">{v?.staff_id}</span></td>
                                                <td className="p-4"><span className="text-white/70">{new Date(v?.created_at).toLocaleString()}</span></td>
                                                <td className="p-4"><span className="text-white/70">{v.duration === 0 ? "Jamais" : new Date(v.expires_at).toLocaleString()}</span></td>
                                                <td className="p-4"><span className={`px-3 py-1 ${v?.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{v.is_active ? "Active" : "Inactive"}</span></td>
                                                {/* <td className="p-4"><button onClick={() => handleChangeSession(v.user_id, v.session_id, v.is_active)} className={`px-3 py-1 transition duration-500 cursor-pointer ${v.is_active ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-green-500/20 text-green-400 hover:bg-green-500/30"}`}>{v.is_active ? "Désactiver" : "Activer"}</button></td> */}
                                            </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            }
                        </div>
                    )
                    }
                    {
                        Array.isArray(permissions) && (permissions.includes(Permissions.advanced.administrator) || permissions.includes(Permissions.panelAdmin.user.coins)) && userTab === "Gestion des coins" && (
                            <div className="flex flex-col gap-5">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h2 className="text-white/40 text-[18px] sm:text-[20px] font-bold">Ajout / Retrait de coins : </h2>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                        {coinManagement.map((v, k) => <button key={k} onClick={() => updateCoin(Number(v), "")} className="w-fit text-center gap-3 text-white/40 p-4 border border-gray-600 rounded-[7px] hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer">{v}</button>)}
                                    </div>
                                </div>
                                <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                    <button onClick={() => setShowModal("set")} className="w-full sm:w-fit Flex items-center gap-3 text-white/40 p-4 border border-gray-600 rounded-[7px] hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center">Modifier le nombre de coins</button>
                                    <button onClick={() => setShowModal("reset")} className="w-full sm:w-fit flex items-center gap-3 text-white/40 p-4 border border-gray-600 rounded-[7px] hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center">Reset le nombre de coins</button>
                                </div>
                                {userTransactions.length === 0 ? <h2 className="text-white/70">Aucune transaction pour le moment !</h2> :
                                    <div className="max-h-[calc(100vh-370px)] overflow-y-auto overflow-x-auto rounded-xl border border-white/10">
                                        <table className="min-w-225 w-full text-left border-collapse">
                                            <thead className="bg-black/40 sticky top-0">
                                                <tr className="text-white/40 text-sm font-semibold">
                                                    <th className="p-4">Id</th>
                                                    <th className="p-4">Type</th>
                                                    <th className="p-4">Montant</th>
                                                    <th className="p-4">Raison</th>
                                                    <th className="p-4">Id Staff</th>
                                                    <th className="p-4">Reference Id</th>
                                                    <th className="p-4">Date</th>
                                                    {/* <th className="p-4 text-center">Action</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {userTransactions.map((v, k) => <tr key={k} className="border-t border-white/10 hover:bg-white/5 transition duration-300 w-full">
                                                    <td className="p-2 sm:p-4"><div className="flex items-center gap-2 text-white/40"><CiDatabase /><span>{v.id}</span></div></td>
                                                    <td className="p-2 sm:p-4"><span className={`${v?.type === "add_coins" && "text-green-500"} ${v?.type === "remove_coins" && "text-red-500"} ${v?.type === "set_coins" && "text-orange-500"} ${v?.type === "reset_coins" && "text-blue-500"}`}>{v?.type === "add_coins" && "Ajout"}{v?.type === "remove_coins" && "Retrait"}{v?.type === "set_coins" && "Set"}{v?.type === "reset_coins" && "Reset"}</span></td>
                                                    <td className="p-2 sm:p-4"><span className={`p-2 ${v?.type === "add_coins" && "text-green-500"} ${v?.type === "remove_coins" && "text-red-500"} ${v?.type === "set_coins" && "text-orange-500"} ${v?.type === "reset_coins" && "text-blue-500"}`}>{v?.type === "add_coins" && `+${v?.amount}`}{v?.type === "remove_coins" && `-${v?.amount}`}{v?.type === "set_coins" && `${v?.amount}`}{v?.type === "reset_coins" && `${v?.amount}`}</span></td>
                                                    <td className="p-2 sm:p-4 max-w-50"><span className="block text-white/70 cursor-pointer transition duration-500 hover:text-white/40 truncate">{v?.reason ? v?.reason : "Aucune"}</span></td>
                                                    <td className="p-2 sm:p-4"><span className="text-white/70">{v?.staff_id}</span></td>
                                                    <td className="p-2 sm:p-4"><span className="text-white/70">{v?.reference_id ? v?.reference_id : "Aucune"}</span></td>
                                                    <td className="p-2 sm:p-4"><span className="text-white/70">{new Date(v?.created_at).toLocaleString()}</span></td>
                                                    {/* <td className="p-4"><button onClick={() => handleChangeSession(v.user_id, v.session_id, v.is_active)} className={`px-3 py-1 transition duration-500 cursor-pointer ${v.is_active ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-green-500/20 text-green-400 hover:bg-green-500/30"}`}>{v.is_active ? "Désactiver" : "Activer"}</button></td> */}
                                                </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                }
                            </div>
                        )
                    }
                    {
                        Array.isArray(permissions) && (permissions.includes(Permissions.advanced.administrator) || permissions.includes(Permissions.panelAdmin.user.role)) && userTab === "Gestion des rôles" && (
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg p-2 w-fit">
                                    <DropDown<number> isOnce={false} label="Rôles de l'utilisateur" value={tempUserRoles} isOpen={displayUserRoles} options={roles.map(r => ({ color: r.color, label: r.label, value: r.id })) as RoleOption[]} onToggle={() => setDisplayUserRoles(!displayUserRoles)} onSelect={(v) => setTempUserRoles(prev => { const exists = prev.some(r => r.value === v.value); return exists ? prev.filter(role => role.value !== v.value) : [...prev, v] })} />
                                </div>
                                <button onClick={handleSetRoles}>Enregistrer</button>
                            </div>
                        )
                    }
                    {Array.isArray(permissions) && (permissions.includes(Permissions.advanced.administrator) || permissions.includes(Permissions.panelAdmin.user.progression)) && userTab === "Gestion de la progression" && (
                        <div className="flex items-center gap-2">
                            {userProgression.map((v, k) => (
                                <div key={k} onClick={() => setDisplayChallenge(v)} className={`w-fit flex flex-col items-center gap-4 px-4 py-2 text-sm text-[20px] border border-white/10 hover:border-white/40 transition duration-500 cursor-pointer font-mono text-white/40`}>
                                    <p>{v?.title} | {v?.difficulty}</p>
                                    <div className="flex items-center gap-2 text-[12px] font-semibold"><p>{v.type}</p> | {v.category.map((vd, kd) => (<span key={kd} className={`px-2 py-0.5 bg-green-500/10`}>{vd}</span>))}</div>
                                    <p><span className={`font-semibold ${v.flags.filter(f => f.is_find).length === v.flags.length ? "text-green-600" : v.flags.filter(f => f.is_find).length >= v.flags?.length / 2 ? "text-orange-500" : "text-red-600"}`}>{v.flags.filter(f => f.is_find).length || 0}</span> / {v.flags?.length || 0}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {showModal === "set" && <InputNumber title="Modifier les coins" onClose={() => setShowModal(null)} onValidate={({ input1, input2 }) => { setCoins(input1, input2) }} input1={{ display: true, placeholder: "Number of coins", type: "number" }} input2={{ display: true, placeholder: "Reason" }} />}
                    {showModal === "reset" && <InputNumber title="Reset des coins" onClose={() => setShowModal(null)} onValidate={({ input2 }) => { resetCoins(input2) }} input2={{ display: true, placeholder: "Reason" }} />}
                    {showModal === "warnUser" && <InputNumber title="Avertir un utilisateur" onClose={() => setShowModal(null)} onValidate={({ input1 }) => { warnUser(String(input1)) }} input1={{ display: true, placeholder: "Reason for the warn", type: "text" }} />}
                    {showModal === "banUser" && <InputNumber title="Bannir un utilisateur ( 0 pour ban définitif )" onClose={() => setShowModal(null)} onValidate={({ input1, input2 }) => { banUser(String(input1), Number(input2)) }} input1={{ display: true, placeholder: "Reason for the ban", type: "text" }} input2={{ display: true, placeholder: "Duration ( in minute )", type: "number" }} />}
                    {showModal === "deleteAccount" && <InputNumber title="Supprimer un utilisateur" onClose={() => setShowModal(null)} onValidate={({ input1 }) => { deleteUserAccount(String(input1)) }} input1={{ display: true, placeholder: "Reason for removal", type: "text" }} />}
                    {showModal === "displayReasonBan" && <DisplayBan id={sanction?.id || -1} staff_id={sanction?.staff_id || -1} reason={sanction?.reason || ""} duration={sanction?.duration || -1} expires_at={sanction?.expires_at || ""} onSelect={() => setShowModal(null)} />}
                    {showModal === "displayReasonWarn" && <DisplayWarn id={sanction?.id || -1} staff_id={sanction?.staff_id || -1} reason={sanction?.reason || ""} onSelect={() => setShowModal(null)} />}
                </div >
            )}
            {Array.isArray(permissions) && (permissions.includes(Permissions.advanced.administrator) || permissions.includes(Permissions.panelAdmin.user.progression)) && displayChallenge && (
                <div className="w-7/8 min-h-0 absolute h-9/10 bg-[#212529] border border-red-500/60 shadow-2xl p-6 animate-fadeIn">
                    <div className="flex justify-between gap-5 max-h-[50vh] overflow-y-auto pr-2 text-center text-white/70 mb-8">
                        <h2 className="font-bold italic text-[25px]">FlagCore</h2>
                        <h2 className="text-white/70 text-[25px] font-mono font-bold">ADMIN PANEL - {`Gestion du challenge | ${displayChallenge.title}`}</h2>
                        <button onClick={() => setDisplayChallenge(null)} className="text-gray-400 hover:text-white text-[25px] cursor-pointer transition duration-500">✕</button>
                    </div>
                    <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3 my-5">
                        <button onClick={() => setModalRewards({ challengeId: displayChallenge.id, flagId: -1, flags: displayChallenge.flags, isFind: false, challengeType: displayChallenge.type })}  className="w-full sm:w-fit Flex items-center gap-3 text-white/40 p-4 border border-gray-600 rounded-[7px] hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center">Reset Challenge Progress</button>
                        <button onClick={() => setModalRewards({ challengeId: displayChallenge.id, flagId: -1, flags: displayChallenge.flags, isFind: true, challengeType: displayChallenge.type })} className="w-full sm:w-fit flex items-center gap-3 text-white/40 p-4 border border-gray-600 rounded-[7px] hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center">Complete Challenge</button>
                    </div>
                    <div className="max-h-[calc(100vh-370px)] overflow-y-auto overflow-x-auto rounded-xl border border-white/10">
                        <table className="min-w-225 w-full text-left border-collapse">
                            <thead className="bg-black/40 sticky top-0">
                                <tr className="text-white/40 text-sm font-semibold">
                                    <th className="p-4">Id</th>
                                    <th className="p-4">Flag</th>
                                    <th className="p-4">Is Find</th>
                                    <th className="p-4">Date Find</th>
                                    <th className="p-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayChallenge.flags.map((v, k) =>
                                    <tr key={k} className="border-t border-white/10 hover:bg-white/5 transition duration-300 w-full">
                                        <td className="p-2 sm:p-4"><div className="flex items-center gap-2 text-white/40"><CiDatabase /><span>{v.id}</span></div></td>
                                        <td className="p-2 sm:p-4"><span className={`text-white/70`}>{v?.flag}</span></td>
                                        <td className="p-2 sm:p-4"><span className={`px-3 py-1 transition duration-500 cursor-pointer ${v.is_find ? "bg-green-500/20 text-white/40 hover:text-white/60" : "bg-red-500/20 text-white/40 hover:text-white/60"}`}>{v.is_find ? "True" : "False"}</span></td>
                                        <td className="p-2 sm:p-4"><span className={`px-3 py-1 transition duration-500 cursor-pointer ${v.flag_found_date ? "bg-green-500/20 text-white/40 hover:text-white/60" : "bg-red-500/20 text-white/40 hover:text-white/60"}`}>{v.flag_found_date ? new Date(v.flag_found_date).toLocaleString() : "Not find"}</span></td>
                                        <td className="p-4 flex items-center justify-center gap-3">
                                            <button onClick={() => setModalRewards({ challengeId: v.challenge_id, flagId: v.id, flags: [], isFind: v.is_find || null, challengeType: displayChallenge.type }) } className={`px-3 py-1 transition duration-500 cursor-pointer ${v.is_find ? "bg-red-500/20 text-white/40 hover:text-white/60" : "bg-green-500/20 text-white/40 hover:text-white/60"}`}>{v.is_find ? "Remove Flag" : "Mark as found"}</button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {modalRewards.challengeId !== -1 && modalRewards.flags.length === 0 && <ModalBool title="With reward ?" label={`Update the user with the rewards ?`} subtitle="" onSelect={(value) => handleEditFlag(modalRewards.challengeId, modalRewards.flagId, modalRewards.isFind || false, modalRewards.challengeType, value)} />}
            {modalRewards.challengeId !== -1 && modalRewards.flags.length !== 0 && <ModalBool title="With reward ?" label={`Update the user by removing rewards ?`} subtitle="" onSelect={(value) => updateChallengeProgress(modalRewards.challengeId, modalRewards.flags, modalRewards.challengeType, modalRewards.isFind || false, value) } />}
        </div >
    )
}