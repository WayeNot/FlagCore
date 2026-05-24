"use client"

import { useEffect, useState } from "react";
import { User } from "@/lib/types";

type InsertFileType = {
    title: string;
    allMember: User[];
    currentMember?: User[];
    onClose: () => void;
    onSubmit: (member: User[]) => void;
}

export default function InsertMember({ title, allMember, currentMember, onClose, onSubmit }: InsertFileType) {
    const [member, setMember] = useState<User[]>([]);
    const [search, setSearch] = useState("")

    useEffect(() => {        
        setMember(currentMember || []);
    }, [currentMember]);

    const canSubmit = member.length !== 0

    const addMember = (newMember: User) => {
        setMember(prev => {
            const alreadyExist = prev.some(m => m.username === newMember.username);

            if (alreadyExist) return prev.filter(u => u.username !== newMember.username)

            return [...prev, newMember];
        });
    }

    const handleSubmit = () => {        
        onSubmit(member);
        setMember([]);
        onClose();
    }

    const filteredMember = allMember.filter(m => m.username.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
            <div className="bg-[#212529] w-140 p-5 text-white shadow-2xl border border-white/10 space-y-4">
                <div className="text-center">
                    <h2 className="text-lg font-bold font-mono">{title}</h2>
                </div>
                <div className="flex flex-col gap-3">
                    <input type="text" className="p-2 bg-[#212529] text-xs outline-none border border-white/5 focus:border-white/50 transition duration-500 w-full" placeholder="Search member" value={search} onChange={(e) => setSearch(e.target.value)} />
                    <div className="flex items-center gap-3">
                        {filteredMember.length === 0 && <h2>No members were found in your search !</h2>}
                        {allMember && allMember.length > 0 && filteredMember.map((v, k) => (
                            <button key={k} onClick={() => addMember(v)} className={`text-[12px] p-2 truncate transition duration-500 cursor-pointer ${member.some(m => m.username === v.username) ? "bg-green-500/40" : "bg-[#363a3f] hover:bg-[#363a3f]/40"}`}>{v.username}</button>
                        ))}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={onClose} className="bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs py-2 transition duration-500 cursor-pointer font-mono w-65">Back</button>
                    <button disabled={!canSubmit} onClick={handleSubmit} className="bg-green-500/10 hover:bg-green-500/20 text-green-300 text-xs py-2 transition duration-500 disabled:opacity-40 cursor-pointer font-mono w-65">Send</button>
                </div>
            </div>
        </div>
    )
}