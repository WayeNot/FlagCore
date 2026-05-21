"use client"

import RoomBuilder from "@/components/ui/room/RoomBuilder";
import { useApi } from "@/hooks/useApi";
import { Permissions } from "@/lib/config";
import { useNavData } from "@/stores/store";
import { useEffect, useState } from "react";
import { BiPlusCircle } from "react-icons/bi";
import { VscCircleLargeFilled } from "react-icons/vsc";


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
            <h2 className="text-center text-white/30 text-[35px] font-mono mt-20 mb-15">To access a room, please enter your access code :</h2>
            <div className="flex gap-10 w-1/3 mb-20 mx-auto">
                <input type="text" className="w-full border-2 font-mono text-[20px] border-white/40 text-white/80 p-1.5 placeholder:text-white/25" placeholder="Insert the room code" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
                <button onClick={joinRoom} className="cursor-pointer text-[20px] flex p-2 items-center justify-center gap-3 border-2 border-white/40 text-white/40 font-mono hover:bg-white/40 hover:border-white/40 hover:text-white transition duration-500">JOIN</button>
            </div>
            {Array.isArray(permissions) && permissions.includes(Permissions.advanced.administrator) && <button onClick={() => setCreateRoom(true)} className="w-fit px-3 mb-25 cursor-pointer flex items-center mx-auto gap-3 border-2 border-white/40 p-2 text-white/40 font-mono text-[20px] hover:bg-white/40 hover:border-white/40 hover:text-white transition duration-500"><BiPlusCircle size={20} className="text-white/40" />Create room</button>}
            <div className="space-y-4 mt-5 flex flex-col gap-5 font-mono">            
                <div className="flex mx-auto gap-30">
                    <div className="flex-col items-center gap-3 text-[20px] uppercase border-2 border-white/40 tracking-[0.2em] text-white/30">
                        <h2 className="flex items-center gap-6 mx-50 p-2"><VscCircleLargeFilled size={15} className="text-green-400" />Active Rooms</h2>
                        <div className="border-t-2"></div>
                        <p>test</p>
                    </div>
                    <div className="flex-col items-cente gap-3 text-[20px] uppercase border-2 border-white/40 tracking-[0.2em] text-white/30">
                        <h2 className="flex items-center gap-6 mx-50 p-2"><VscCircleLargeFilled size={15} className="text-red-400" />Old Rooms</h2>
                        <div className="border-t-2"></div>
                        <p>test</p>
                    </div>
                </div>

            </div>
            {createRoom && <RoomBuilder onCreate={v => handleCreate(v)} onClose={() => setCreateRoom(false)}/>}
        </div>
    )
}