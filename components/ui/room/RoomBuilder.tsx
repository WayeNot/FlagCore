"use client"

import InsertMember from "@/components/challenges/InsertMember";
import { useApi } from "@/hooks/useApi";
import { User } from "@/lib/types";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

type RoomBuilderType = {
    onClose: () => void;
    onCreate: (v: any) => void;
}

export default function RoomBuilder({ onClose, onCreate }: RoomBuilderType) {
    const { call } = useApi();

    const [roomData, setRoomData] = useState<{ name: string; description: string; max_person: number; moderator: any[] }>({ name: "", description: "", max_person: -1, moderator: [] })
    const [displayModerator, setDisplayModerator] = useState(false)
    const [allUser, setAllUser] = useState<User[]>([]);

    useEffect(() => {
        if (!displayModerator) return;

        const getAllUser = async () => {
            const data = await call(`/api/users`, { method: "GET" });
            setAllUser(data.data)
        }

        getAllUser()
    }, [displayModerator])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-1/3 bg-[#212529] border border-white/10 text-white flex flex-col shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#212529]">
                    <h1 className="text-sm font-bold tracking-wide font-mono text-[20px] text-white/70">Room Builder</h1>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition duration-500 cursor-pointer"><IoMdClose size={18} /></button>
                </div>
                <div className="p-4 space-y-4 overflow-y-auto max-h-[75vh]">
                    <div className="bg-[#363a3f] border border-white/5 font-mono p-3 space-y-2">
                        <div className="text-[11px] text-white/40">General Information</div>
                        <div className="grid grid-cols-2 gap-2">
                            <input className="p-2 bg-[#212529] text-xs outline-none border border-white/5 focus:border-orange-500 transition" type="text" placeholder="Room name" value={roomData.name} onChange={e => setRoomData(prev => ({ ...prev, name: e.target.value }))} />
                            <input className="p-2 bg-[#212529] text-xs outline-none border border-white/5 focus:border-orange-500 transition" type="number" placeholder="Max person" value={roomData.max_person} onChange={e => setRoomData(prev => ({ ...prev, max_person: Number(e.target.value) }))} />
                        </div>
                    </div>
                    <div className="bg-[#363a3f] border border-white/5 p-3 space-y-2 w-full font-mono">
                        <div className="text-[11px] text-white/40">Description</div>
                        <textarea className="w-full h-20 overflow-y-auto p-2 bg-[#212529] text-xs outline-none border border-white/5 focus:border-orange-500 transition resize-none" placeholder="Description" value={roomData.description} onChange={e => setRoomData(prev => ({ ...prev, description: e.target.value }))} />
                    </div>
                    <div className="bg-[#363a3f] border border-white/5 p-3 space-y-2">
                        <button onClick={() => setDisplayModerator(true)} className="bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs py-2 transition duration-500 cursor-pointer font-mono">Set Administrator</button>
                    </div>
                </div>
                <div className="p-3 border-t border-white/10 bg-[#212529] grid grid-cols-2 gap-2">
                    <button onClick={onClose} className="bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs py-2 transition duration-500 cursor-pointer font-mono">Back</button>
                    <button onClick={() => onCreate(roomData)} className={`bg-green-500/10 hover:bg-green-500/20 text-green-300 text-xs py-2 transition duration-500 disabled:opacity-40 cursor-pointer font-mono`}>Create</button>
                </div>
                {displayModerator && <InsertMember onClose={() => setDisplayModerator(false)} allMember={allUser} onSubmit={moderator => setRoomData(prev => ({ ...prev, moderator: [...prev.moderator, ...moderator] }))} />}
            </div>
        </div>
    )
}