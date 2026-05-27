"use client"

import RoomBuilder from "@/components/Room/RoomBuilder";
import { useNotif } from "@/components/NotifProvider";
import { useApi } from "@/hooks/useApi";
import { Permissions } from "@/lib/config";
import { ActiveRoom, InactiveRoom, Room } from "@/lib/types";
import { useNavData } from "@/stores/store";
import { useEffect, useState } from "react";
import { BiPlusCircle } from "react-icons/bi";
import { VscCircleLargeFilled } from "react-icons/vsc";
<<<<<<< HEAD
=======
import RoomPreview from "@/components/Room/RoomPreview";
import { useRouter } from "next/navigation";
>>>>>>> ded111de9a18c6e3512cbe7921dee4c1c5b45b80


export default function Home() {
    const { call } = useApi()
    const { showNotif } = useNotif()
    const { permissions, user_id } = useNavData()
    const router = useRouter();

    const [allCreatedRoom, setAllCreatedRoom] = useState<Room[]>([]);
    const [allActiveRoom, setAllActiveRoom] = useState<ActiveRoom[]>([]);
    const [allInactiveRoom, setAllInactiveRoom] = useState<InactiveRoom[]>([]);
    const [editRoom, setEditRoom] = useState<Room>()
    const [roomCode, setRoomCode] = useState("")
    const [createRoom, setCreateRoom] = useState(false)

    const [previewChallenge, setPreviewChallenge] = useState<ActiveRoom | undefined>()

    useEffect(() => {
        getRooms()
    }, [])

    // Get des rooms ↓

    const getRooms = async () => {
        const data = await call(`/api/room`)
        setAllCreatedRoom(data.createdRoom)
        setAllActiveRoom(data.activeRoom)
        setAllInactiveRoom(data.inactiveRoom)
    }

    // Création de room ↓

    const handleCreate = async (v: Room) => {
        const id = await call(`/api/room`, { method: "POST", body: JSON.stringify({ newRoom: v }) }, [`The room ${v.name} has been successfully created !`])
        setAllCreatedRoom(prev => ([...prev, { ...v, id: id.id }]))
        setCreateRoom(false);
    }

    // Édition d'une room ↓

    const handleEdit = async (v: Room) => {
        await call(`/api/room`, { method: "PATCH", body: JSON.stringify({ id: editRoom?.id, editRoom: v }) }, [`The room ${v.name} has been successfully edited !`])
        setAllCreatedRoom(allCreatedRoom.map(r => r.id === editRoom?.id ? { ...r, ...v } : r))
        setEditRoom(undefined);
    }

    // Suppression de la room ↓

    const deleteRoom = async () => {
        await call(`/api/room`, { method: "DELETE", body: JSON.stringify({ id: editRoom?.id }) }, [`The room ${editRoom?.name} has been successfully deleted !`])
        setAllCreatedRoom(allCreatedRoom.filter(r => r.id !== editRoom?.id))
        setAllActiveRoom(allActiveRoom.filter(r => r.id !== editRoom?.id))
        setAllInactiveRoom(allInactiveRoom.filter(r => r.id !== editRoom?.id))
        setEditRoom(undefined);
    }

    // Join d'une room par code ↓

    const joinRoom = async () => {
        if (!roomCode) {
            showNotif("Missing field(s) !")
            return
        }
        const data = await call(`/api/room/join`, { method: "POST", body: JSON.stringify({ code: roomCode }) }, [`You have just joined a room !`])

        setAllActiveRoom(prev => ([...prev, data.room]))
        setAllInactiveRoom(allInactiveRoom.filter(r => r.id !== data.room.id))
        setRoomCode("")
    }

    // Join de la page room ↓

    const goToRoom = () => {
        if (!previewChallenge) return;
        showNotif(`You are joining room ${previewChallenge?.name} !`, "success")
        router.refresh()
        router.push(`/room/${previewChallenge?.id}`)
        setPreviewChallenge(undefined)
    }

    // Leave de la room définitivement ↓

    const onLeave = async () => {
        if (!previewChallenge) return;        

        await call(`/api/room/${previewChallenge?.id}/leave`, { method: "PATCH" }, [`You have successfully left room ${previewChallenge?.name}`])
        setAllActiveRoom(allActiveRoom.filter(r => r.id !== previewChallenge?.id))
        setPreviewChallenge(undefined)
        getRooms()
    }

    return (
        <div>
            <div className="border-t-2 border-b-2 my-15 border-white/30">
                <h2 className="text-center text-white/30 text-[35px] font-mono mt-10 mb-15">To access a room, please enter your access code :</h2>
                <div className="flex gap-5 w-1/3 mb-10 mx-auto">
                    <input type="text" className="w-full border-2 font-mono text-[20px] border-white/40 text-white/80 p-1.5 placeholder:text-white/25" placeholder="Insert the room code" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
                    <button onClick={joinRoom} className="cursor-pointer text-[20px] flex p-2 items-center justify-center gap-3 border-2 border-white/40 text-white/40 font-mono hover:bg-white/40 hover:border-white/40 hover:text-white transition duration-500">JOIN</button>
                </div>
                <div className="flex items-center justify-center mb-5 gap-3 w-1/3 m-auto">
                    {Array.isArray(permissions) && permissions.includes(Permissions.advanced.administrator) && <button onClick={() => setCreateRoom(true)} className="w-1/2 cursor-pointer flex items-center justify-center gap-3 border-2 border-white/40 p-2 text-white/40 font-mono text-[20px] hover:bg-white/40 hover:border-white/40 hover:text-white transition duration-500"><BiPlusCircle size={20} className="text-white/40" />Create room</button>}
                    <button onClick={getRooms} className="w-1/2 cursor-pointer text-[20px] flex p-2 items-center justify-center gap-3 border-2 border-white/40 text-white/40 font-mono hover:bg-white/40 hover:border-white/40 hover:text-white transition duration-500">Refresh the list of rooms</button>
                </div>
            </div>
            <div className="space-y-4 mt-5 flex flex-col gap-5 font-mono">
                <div className="flex m-auto gap-30 w-[90%]">
                    {permissions && Array.isArray(permissions) && (permissions.includes(Permissions.advanced.administrator) || permissions.includes(Permissions.room.canModerateRoom)) &&
                        <div className="flex-col w-[30%] items-center gap-3 text-[20px] uppercase border-2 border-white/40 tracking-[0.2em] text-white/30">
                            <h2 className="flex items-center justify-center gap-6 p-2"><VscCircleLargeFilled size={15} className="text-orange-400" />Created rooms</h2>
                            <div className="border-t-2 p-3 flex items-center gap-3 w-full">
                                {allCreatedRoom.length === 0 && <h2 className="text-center">None at the moment !</h2>}
                                {allCreatedRoom.map((v, k) => (
                                    <button key={k} onClick={() => setEditRoom(v)} className="w-fit cursor-pointer text-[20px] flex p-2 items-center justify-center gap-3 border-2 border-white/40 text-white/40 font-mono hover:bg-white/40 hover:border-white/40 hover:text-white transition duration-500">{v.name}</button>
                                ))}
                            </div>
                        </div>
                    }
                    <div className="flex-col w-[30%] items-center gap-3 text-[20px] uppercase border-2 border-white/40 tracking-[0.2em] text-white/30">
                        <h2 className="flex items-center justify-center gap-6 p-2"><VscCircleLargeFilled size={15} className="text-green-400" />Active Rooms</h2>
                        <div className="border-t-2 p-3 flex items-center gap-3 w-full">
                            {allActiveRoom.length === 0 && <h2 className="text-center">None at the moment !</h2>}
                            {allActiveRoom.map((v, k) => (
                                <button key={k} onClick={() => setPreviewChallenge(v)} className="w-fit cursor-pointer text-[20px] flex p-2 items-center justify-center gap-3 border-2 border-white/40 text-white/40 font-mono hover:bg-white/40 hover:border-white/40 hover:text-white transition duration-500">{v.name}</button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-col w-[30%] items-cente gap-3 text-[20px] uppercase border-2 border-white/40 tracking-[0.2em] text-white/30">
                        <h2 className="flex items-center justify-center gap-6 p-2"><VscCircleLargeFilled size={15} className="text-red-400" />Old Rooms</h2>
                        <div className="border-t-2 p-3 flex flex-col gap-3 w-full">
                            {allInactiveRoom.length === 0 && <h2 className="text-center">None at the moment !</h2>}
                            {allInactiveRoom.map((v, k) => (
                                <button key={k} onClick={joinRoom} className="w-fit cursor-pointer text-[20px] flex p-2 items-center justify-center gap-3 border-2 border-white/40 text-white/40 font-mono hover:bg-white/40 hover:border-white/40 hover:text-white transition duration-500">{v.name}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {previewChallenge && previewChallenge !== null && <RoomPreview room={previewChallenge} onLeave={onLeave} onJoin={goToRoom} onClose={() => setPreviewChallenge(undefined)} />}
            {editRoom && <RoomBuilder onDelete={deleteRoom} editBuilder={editRoom} onCreate={v => handleEdit(v)} onClose={() => setEditRoom(undefined)} />}
            {createRoom && <RoomBuilder editBuilder={editRoom} onCreate={v => handleCreate(v)} onClose={() => setCreateRoom(false)} />}
        </div>
    )
}