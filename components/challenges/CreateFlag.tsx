"use client"

import { useState } from "react";
import DropDown from "../ui/DropDown";
import { difficultyBtn, NewCtfFlag } from "@/lib/types";
import { useNotif } from "../NotifProvider";

type CreateFlagType = {
    onClose: () => void;
    onSubmit: (flag: NewCtfFlag) => void;
}

export default function CreateFlag({ onClose, onSubmit }: CreateFlagType) {
    const { showNotif } = useNotif()

    const [newFlag, setNewFlag] = useState<NewCtfFlag>({ title: "", difficulty: null, description: "", flag: "", flag_format: "", hint: "" });
    const [settingsNewFlag, setSettingsNewFlag] = useState({ difficulty: false });

    const canSubmit = newFlag.title && newFlag.difficulty && newFlag.description && newFlag.flag && newFlag.flag_format

    const resetForms = () => {
        setNewFlag({ title: "", difficulty: null, description: "", flag: "", flag_format: "", hint: "" });
        setSettingsNewFlag(prev => ({ ...prev, difficulty: false }));
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
            <div className="bg-[#212529] p-6 w-2/7 text-white shadow-2xl space-y-5 border border-white/10">
                <div className="text-center space-y-1">
                    <h2 className="text-xl font-bold font-mono">Creating a flag</h2>
                    <p className="text-white/40 text-xs font-mono">Configure each flag to your liking</p>
                </div>
                <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                        <input className="p-2 bg-[#363a3f] text-sm outline-none focus:ring-1 focus:ring-orange-500 font-mono" placeholder="Title" value={newFlag.title} onChange={e => setNewFlag({ ...newFlag, title: e.target.value })} />
                        <DropDown isOnce label="Difficulty" value={newFlag.difficulty} isOpen={settingsNewFlag.difficulty} options={difficultyBtn} onToggle={() => setSettingsNewFlag(s => ({ ...s, difficulty: !s.difficulty }))} onSelect={v => { setNewFlag({ ...newFlag, difficulty: v }); setSettingsNewFlag({ ...settingsNewFlag, difficulty: false }) }} />
                    </div>
                    <div className="flex flex-col">
                        <textarea maxLength={100} className="w-full p-2 bg-[#363a3f] text-sm outline-none focus:ring-1 focus:ring-orange-500 resize-none h-20 font-mono" placeholder="Description" value={newFlag.description} onChange={e => setNewFlag({ ...newFlag, description: e.target.value })} />
                        <p className="text-white/40 flex justify-end text-[14px]">{newFlag.description.length} / 100</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <input className="p-2 bg-[#363a3f] text-sm outline-none focus:ring-1 focus:ring-orange-500 font-mono" placeholder="Flag Format (Flag_Format)" value={newFlag.flag_format} onChange={e => setNewFlag({ ...newFlag, flag_format: e.target.value })} />
                        <input className="w-full p-2 bg-[#363a3f] text-sm outline-none focus:ring-1 focus:ring-orange-500 font-mono" placeholder="Flag expected" value={newFlag.flag} onChange={e => setNewFlag({ ...newFlag, flag: e.target.value })} />
                    </div>
                    <input className="p-2 w-full bg-[#363a3f] text-sm outline-none focus:ring-1 focus:ring-orange-500 font-mono" placeholder="Hint" value={newFlag.hint} onChange={e => setNewFlag({ ...newFlag, hint: e.target.value })} />
                </div>
                <div className="flex gap-2 pt-1">
                    <button onClick={onClose} className="bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs py-2 transition duration-500 cursor-pointer font-mono w-60">Back</button>
                    <button onClick={() => { if (!canSubmit) { showNotif("Please fill in all fields !"); return; } onSubmit(newFlag); resetForms(); }} className="bg-green-500/10 hover:bg-green-500/20 text-green-300 text-xs py-2 transition duration-500 disabled:opacity-40 cursor-pointer font-mono w-60">Add</button>
                </div>
            </div>
        </div>
    )
}