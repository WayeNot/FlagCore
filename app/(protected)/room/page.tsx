"use client"

import RoomBuilder from "@/components/ui/room/RoomBuilder";
import { useApi } from "@/hooks/useApi";
import { Permissions } from "@/lib/config";
import { useNavData } from "@/stores/store";
import { useEffect, useState } from "react";
import { BiPlusCircle } from "react-icons/bi";

export default function Home() {
    const { call } = useApi()
    const { user_id, permissions } = useNavData()

    const [allUserRoom, setAllUserRoom] = useState([]);
    const [newRoom, setNewRoom] = useState([])
    const [roomCode, setRoomCode] = useState("")
    const [createRoom, setCreateRoom] = useState(false)

    useEffect(() => {
        console.log(allUserRoom);
    }, [allUserRoom])

    const getRooms = async () => {
        const data = await call(`/api/user/rooms/${user_id}`)
        setAllUserRoom(data.data)
    }

    const joinRoom = async () => {
        const data = await call(`/api/rooms/join`, { method: "POST", body: JSON.stringify({ code: roomCode }) }, [`Vous avez bien rejoint la room avec le code : ${roomCode} !`])
    }

    useEffect(() => {
        getRooms()
    }, [])

    // Création de room ↓

    const handleCreate = async (v: []) => {
        // await call(`/api/room`, { method: "POST", body: JSON.stringify({ newRoom: v })}, [`The room ${v.title} has been successfully created !!`])
        handleCreate(v)
        setCreateRoom(false);
    }

    return (
        <div>
            <h2 className="text-center text-white/60 text-[20px]">Système de room en développement !</h2>
            <div className="flex items-center gap-2 w-1/3">
                <input type="text" className="p-2 bg-[#212529] text-xs outline-none border text-white/60 border-white/5 focus:border-white/50 transition duration-500 w-1/5" placeholder="Insert the room code" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
                <button onClick={joinRoom} className="w-1/5 cursor-pointer flex items-center justify-center gap-3 border-2 border-white/40 text-white/40 font-mono text-[20px] hover:bg-white/40 hover:border-white/40 hover:text-white transition duration-500">Join</button>
                {Array.isArray(permissions) && permissions.includes(Permissions.advanced.administrator) && <button onClick={() => setCreateRoom(true)} className="w-fit px-3 cursor-pointer flex items-center justify-center gap-3 border-2 border-white/40 text-white/40 font-mono text-[20px] hover:bg-white/40 hover:border-white/40 hover:text-white transition duration-500"><BiPlusCircle className="text-white/40" />Create room</button>}
            </div>
            <div className="space-y-4 mt-5 flex flex-col gap-5">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/30"><span className="h-px w-6 bg-white/20" />Rooms active<span className="h-px flex-1 bg-white/10" /></div>
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/30"><span className="h-px w-6 bg-white/20" />Ancienne rooms<span className="h-px flex-1 bg-white/10" /></div>
            </div>
            {createRoom && <RoomBuilder onCreate={v => handleCreate(v)} onClose={() => setCreateRoom(false)}/>}
        </div>
    )
}