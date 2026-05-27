"use client"

import { Room } from "@/lib/types";
import { IoMdClose } from "react-icons/io";

type RoomPreviewType = {
    room: Room;
    onLeave: () => void;
    onClose: () => void;
    onJoin: () => void;
}

export default function RoomPreview({ room, onLeave, onClose, onJoin }: RoomPreviewType) {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-1/3 bg-[#212529] border border-white/10 text-white flex flex-col shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#212529]">
                    <h1 className="text-sm font-bold tracking-wide font-mono text-[20px] text-white/70">Room : {room.name}</h1>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition duration-500 cursor-pointer"><IoMdClose size={18} /></button>
                </div>
                <div className="p-4 space-y-4 overflow-y-auto max-h-[75vh]">
                    <div className="bg-[#363a3f] border border-white/5 p-3 space-y-2 w-full font-mono">
                        <div className="w-full flex flex-col">
                            <p className="text-white/40 w-full h-fit max-h-20 overflow-y-auto p-2 bg-[#212529] text-xs outline-none border border-white/5 focus:border-orange-500 transition">{room.description}</p>
                        </div>
                        <div className="w-full flex flex-col">
                            <div className="w-full flex items-center gap-2">
                                <button onClick={onLeave} className={`w-1/3 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs py-2 transition duration-500 disabled:opacity-40 cursor-pointer font-mono`}>leave permanently</button>
                                <button onClick={onClose} className="w-1/3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 text-xs py-2 transition duration-500 cursor-pointer font-mono">Back</button>
                                <button onClick={onJoin} className={`w-1/3 bg-green-500/10 hover:bg-green-500/20 text-green-300 text-xs py-2 transition duration-500 disabled:opacity-40 cursor-pointer font-mono`}>Join</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}