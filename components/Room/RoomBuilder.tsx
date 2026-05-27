"use client"

import InsertMember from "@/components/challenges/InsertMember";
import { useApi } from "@/hooks/useApi";
import { Room, User } from "@/lib/types";
import { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useNotif } from "../NotifProvider";
import { Permissions } from "@/lib/config";
import { useNavData } from "@/stores/store";
import { TfiReload } from "react-icons/tfi";

type RoomBuilderType = {
    editBuilder: Room | undefined;
    onClose: () => void;
    onCreate: (v: any) => void;
    onDelete?: () => void;
}

export default function RoomBuilder({ editBuilder, onClose, onCreate, onDelete }: RoomBuilderType) {
    const { call } = useApi();
    const { showNotif } = useNotif()
    const { permissions } = useNavData()

    const [roomData, setRoomData] = useState<{ id: Number, name: string; description: string; max_person: number; administrators: User[] }>({ id: Math.floor(Math.random() * 100), name: "", description: "", max_person: 0, administrators: [] })
    const [displayAdministrators, setDisplayAdministrators] = useState(false)
    const [allUser, setAllUser] = useState<User[]>([]);
    const [roomCode, setRoomCode] = useState<string>("")
    const [inviteUser, setInviteUser] = useState(false)
    const [invitedUser, setInvitedUser] = useState<User[]>([])
    const [manageUser, setManageUser] = useState(false)

    useEffect(() => {
        if (!editBuilder) return;

        setRoomData({ id: editBuilder.id, name: editBuilder.name, description: editBuilder.description, max_person: editBuilder.max_person, administrators: [] })

        const getAllUser = async () => {
            const users = await Promise.all(editBuilder.administrators.map(async (id) => {
                const data = await call(`/api/user/${id}`, { method: "GET" });
                return data.data
            }))
            setRoomData(prev => ({ ...prev, administrators: users }))
        }

        getAllUser()
        getCode()
    }, [editBuilder]);

    useEffect(() => {
        const getAllUser = async () => {
            const data = await call("/api/users")
            setAllUser(await data.data)
        }

        getAllUser()
    }, [displayAdministrators]);

    // Gestion des codes ↓

    const generateCode = async () => {
        const code = await call(`/api/room/code`, { method: "POST", body: JSON.stringify({ room_id: roomData.id }) }, [`New code generated and copied to your clipboard !`])
        setRoomCode(code.data)
        copyCode(code.data)
    }

    const getCode = async () => {
        const code = await call(`/api/room/code`)
        if (!code.data || code.data.length === 0) return

        setRoomCode(code.data)
    }

    const copyCode = (text: string) => {
        navigator.clipboard.writeText(text || roomCode)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-1/3 bg-[#212529] border border-white/10 text-white flex flex-col shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#212529]">
                    <h1 className="text-sm font-bold tracking-wide font-mono text-[20px] text-white/70">Room Builder</h1>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition duration-500 cursor-pointer"><IoMdClose size={18} /></button>
                </div>
                <div className="p-4 space-y-4 overflow-y-auto max-h-[75vh]">
                    {Permissions && Array.isArray(permissions) && ((!editBuilder && (permissions.includes(Permissions.advanced.administrator) || (permissions.includes(Permissions.room.canCreateChallenge)))) || (editBuilder && (permissions.includes(Permissions.advanced.administrator) || (permissions.includes(Permissions.room.canEditRoom))))) && (
                        <div>
                            <div className="bg-[#363a3f] border border-white/5 font-mono p-3 space-y-2">
                                <div className="text-[11px] text-white/40">General Information</div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="w-full flex flex-col">
                                        <p className="text-[11px] text-white/40">Room name</p>
                                        <input maxLength={25} className="p-2 bg-[#212529] text-xs outline-none border border-white/5 focus:border-orange-500 transition" type="text" placeholder="Room name" value={roomData.name} onChange={e => setRoomData(prev => ({ ...prev, name: e.target.value }))} />
                                    </div>
                                    <div className="w-full flex flex-col">
                                        <p className="text-[11px] text-white/40">Maximum number of member ( 0 for unlimited )</p>
                                        <input className="p-2 bg-[#212529] text-xs outline-none border border-white/5 focus:border-orange-500 transition" type="number" placeholder="Max person" value={roomData.max_person} onChange={e => setRoomData(prev => ({ ...prev, max_person: Number(e.target.value) }))} />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#363a3f] border border-white/5 p-3 space-y-2 w-full font-mono">
                                <div className="text-[11px] text-white/40">Description</div>
                                <div className="w-full flex flex-col">
                                    <textarea maxLength={150} className="w-full h-20 overflow-y-auto p-2 bg-[#212529] text-xs outline-none border border-white/5 focus:border-orange-500 transition resize-none" placeholder="Description" value={roomData.description} onChange={e => setRoomData(prev => ({ ...prev, description: e.target.value }))} />
                                    <p className="text-white/40 flex justify-end">{roomData.description.length} / 150</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {editBuilder && Permissions && Array.isArray(permissions) && (permissions.includes(Permissions.advanced.administrator) || (permissions.includes(Permissions.room.canManageUser))) && (
                        <div className="w-full">
                            <div className="bg-[#363a3f] border border-white/5 p-3 space-y-2 w-full font-mono">
                                <div className="text-[11px] text-white/40">User management</div>
                                <div className="flex flex-col items-center gap-2 w-full">
                                    <div className="flex items-stretch gap-2 w-full">
                                        {roomCode ? <div className="bg-[#212529] w-full text-[14px] select-none p-2 text-white/40 flex items-center justify-center gap-2">{roomCode}<FaCopy onClick={() => { copyCode(""); showNotif("Code copied to clipboard !", "success") }} className="hover:text-white/60 transition duration-500 cursor-pointer" /></div> : <p className="bg-[#212529] w-full text-[14px] select-none p-2 text-white/40 text-center">No code available at this time.</p>}
                                        <button className="bg-[#212529] text-white/40 hover:text-white/60 px-3 flex items-center justify-center transition duration-500 cursor-pointer" onClick={generateCode}><TfiReload className="text-[20px]" /></button>
                                    </div>
                                    <div className="flex items-center gap-3 w-full">
                                        <button onClick={() => setInviteUser(true)} className="w-1/2 bg-[#212529] text-white/40 hover:text-white/60 text-xs p-2 transition duration-500 cursor-pointer font-mono flex items-center justify-center gap-2">Invite users ( <p className="text-red-500">Feature !</p> )</button>
                                        <button onClick={() => setManageUser(true)} className="w-1/2 bg-[#212529] text-white/40 hover:text-white/60 text-xs p-2 transition duration-500 cursor-pointer font-mono flex items-center justify-center gap-2">Manage users ( <p className="text-red-500">Feature !</p> )</button>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#363a3f] border border-white/5 p-3 flex items-center gap-4">
                                <button onClick={() => setDisplayAdministrators(true)} className="bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs p-2 transition duration-500 cursor-pointer font-mono">Set Administrator</button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-3 border-t border-white/10 bg-[#212529] gap-2 w-full">
                    {editBuilder ? (
                        <div className="w-full flex items-center gap-2">
                            <button onClick={onClose} className="w-1/3 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs py-2 transition duration-500 cursor-pointer font-mono">Back</button>
                            <button onClick={onDelete} className={`w-1/3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 text-xs py-2 transition duration-500 disabled:opacity-40 cursor-pointer font-mono`}>Delete</button>
                            <button onClick={() => onCreate(roomData)} className={`w-1/3 bg-green-500/10 hover:bg-green-500/20 text-green-300 text-xs py-2 transition duration-500 disabled:opacity-40 cursor-pointer font-mono`}>Edit</button>
                        </div>
                    ) : (
                        <div className="w-full flex items-center gap-2">
                            <button onClick={onClose} className="w-1/2 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs py-2 transition duration-500 cursor-pointer font-mono">Back</button>
                            <button onClick={() => onCreate(roomData)} className={`w-1/2 bg-green-500/10 hover:bg-green-500/20 text-green-300 text-xs py-2 transition duration-500 disabled:opacity-40 cursor-pointer font-mono`}>Create</button>
                        </div>
                    )}
                </div>
                {inviteUser && <InsertMember title={"Invite the users participating in the room !"} allMember={allUser} currentMember={invitedUser} onClose={() => setInviteUser(false)} onSubmit={player => setInvitedUser([...player])} />}
                {displayAdministrators && <InsertMember title={"Invite the room administrators !"} allMember={allUser} currentMember={roomData.administrators} onClose={() => setDisplayAdministrators(false)} onSubmit={administrators => setRoomData(prev => ({ ...prev, administrators: [...administrators] }))} />}
            </div>
        </div>
    )
}