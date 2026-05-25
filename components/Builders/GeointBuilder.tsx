"use client";

import { BsLightningChargeFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { MdOutlineDescription, MdSend } from "react-icons/md";
import DropDown from "@/components/ui/DropDown";
import { difficultyBtn, GeointBuilderState, NewCtfFlag } from "@/lib/types";
import { useState } from "react";
import { useNotif } from "@/components/NotifProvider";
import { CiCircleRemove } from "react-icons/ci";
import { AiFillDelete } from "react-icons/ai";
import CreateFlag from "../challenges/CreateFlag";
import { TiWarning } from "react-icons/ti";

export default function GeointBuilder({ onClose }: any) {
    const { showNotif } = useNotif()
    const [builder, setBuilder] = useState<GeointBuilderState>({ title: "", description: "", difficulty: null, flag_format: "", images: [] });
    const [flags, setFlags] = useState<NewCtfFlag[]>([])
    const [difficultyOpen, setDifficultyOpen] = useState(false);
    const canCreate = builder.title && builder.description && builder.difficulty && builder.flag_format && builder.images.length > 0 && flags.length > 0;
    const handleChange = (key: keyof GeointBuilderState, value: any) => setBuilder(prev => ({ ...prev, [key]: value }));
    const [currentImage, setCurrentImage] = useState("")
    const [displayImage, setDisplayImage] = useState(false)
    const [displayImageRightPanel, setDisplayImageRightPanel] = useState(-1)

    const [displayFlags, setDisplayFlags] = useState(false)

    const handleBuild = async () => {
        if (!canCreate) { showNotif("You have not filled in all the fields !"); return; }        

        await fetch("/api/challenges?type=geoint", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ challenge: { ...builder, difficulty: builder.difficulty?.value }, flags, files: [] })
        });
        onClose()
    }

    const handleRemoveImage = (index: number) => {
        const updatedImages = builder.images.filter((_, i) => i !== index)
        setBuilder(prev => ({ ...prev, images: updatedImages }))
        showNotif("Image successfully deleted !", "success")
    }

    const handleRemoveFlag = (index: number) => {
        const updatedFlags = flags.filter((_, i) => i !== index)
        setFlags(updatedFlags)
        showNotif("Flag successfully removed !", "success")
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <div className="flex w-full max-w-6xl gap-4">
                <div className="w-1/2 bg-[#212529] border border-white/10 text-white shadow-[0_0_30px_rgba(0,0,0,0.4)] flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                        <h2 className="font-bold text-sm flex items-center gap-2 font-mono text-[20px] text-white/70">GEOINT Builder</h2>
                        <button onClick={onClose} className="text-white/40 hover:text-white transition duration-500 cursor-pointer"><IoMdClose size={18} /></button>
                    </div>
                    <div className="p-4 space-y-4 overflow-y-auto flex-1">
                        <div className="flex items-center justify-between gap-2 w-full bg-[#363a3f] border border-white/5 p-3">
                            <div className="w-1/2 flex flex-col gap-2">
                                <div className="text-white/60 text-xs font-mono">Name of the challenge</div>
                                <div className="relative">
                                    <input placeholder=" " className="peer w-full bg-[#212529] p-2 text-sm outline-none border border-white/5 focus:border-orange-500" value={builder.title} onChange={e => handleChange("title", e.target.value)} />
                                </div>
                            </div>
                            <div className="w-1/2 flex flex-col gap-2">
                                <div className="text-white/60 text-xs font-mono">Difficulty</div>
                                <div className="relative">
                                    <DropDown isOnce label="Difficulty" value={builder.difficulty} isOpen={difficultyOpen} options={difficultyBtn} onToggle={() => setDifficultyOpen(!difficultyOpen)} onSelect={(v) => { handleChange("difficulty", v); setDifficultyOpen(false) }} />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-2 w-full bg-[#363a3f] border border-white/5 p-3">
                            <div className="w-full flex flex-col gap-2">
                                <div className="text-white/60 text-xs font-mono">Challenge description</div>
                                <div className="relative">
                                    <textarea placeholder=" " className="peer w-full bg-[#212529] p-2 text-sm outline-none border border-white/5 focus:border-orange-500 h-20 resize-none" value={builder.description} onChange={e => handleChange("description", e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-2 w-full bg-[#363a3f] border border-white/5 p-3">
                            <div className="w-1/2 flex flex-col gap-2">
                                <div className="text-white/60 text-xs font-mono">Starting image</div>
                                <div className="relative">
                                    <div className="flex-1 relative">
                                        <input placeholder=" " type="text" maxLength={150} value={currentImage} onChange={e => setCurrentImage(e.target.value)} className="w-full h-11 px-4 pr-10 bg-[#212529] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition" />
                                        <span onClick={() => { if (!currentImage) return; handleChange("images", [...builder.images, currentImage]); setCurrentImage(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:bg-[#2a2a3d] cursor-pointer transition duration-500 hover:text-blue-600"><MdSend /></span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/2 flex flex-col gap-2">
                                <div className="text-white/60 text-xs font-mono">Flag format (FirstName_LastName)</div>
                                <div className="relative">
                                    <input placeholder=" " type="text" maxLength={35} value={builder.flag_format} onChange={e => handleChange("flag_format", e.target.value)} className="w-full h-11 px-4 pr-10 bg-[#212529] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition" />
                                </div>
                            </div>
                        </div>
                        {currentImage && <img src={currentImage} onClick={() => { setDisplayImage(true) }} className="bg-[#363a3f] border-white/10 p-2 w-fit m-auto shadow-lg sm:h-36 sm:w-36 object-cover border cursor-pointer hover:scale-105 hover:border-white/20 transition duration-300" />}
                    </div>
                    <div className="p-4 border-t border-white/10 flex items-center justify-center gap-4 mt-auto">
                        <button onClick={() => setDisplayFlags(true)} className="bg-[#363a3f] hover:brightness-200 text-xs py-2 transition duration-500 cursor-pointer font-mono w-40">Flag creation</button>
                        <button onClick={onClose} className="bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs py-2 transition duration-500 cursor-pointer font-mono w-60">Back</button>
                        <button onClick={handleBuild} className="bg-green-500/10 hover:bg-green-500/20 text-green-300 text-xs py-2 transition duration-500 disabled:opacity-40 cursor-pointer font-mono w-60">Add</button>
                    </div>
                </div>
                <div className="w-1/2 bg-[#212529] border border-white/10 overflow-y-auto p-6 text-white space-y-5 shadow-[0_0_30px_rgba(0,0,0,0.4)] flex flex-col h-full">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold flex items-center gap-2 text-white/70 font-mono">Preview</h2>
                        <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 font-mono">Live preview</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-[#363a3f] border border-white/10 p-3">
                            <p className="text-white/40 text-xs font-mono">Name</p>
                            <p className="text-orange-300 font-medium truncate">{builder.title || "N/A"}</p>
                        </div>

                        <div className="bg-[#363a3f] border border-white/10 p-3">
                            <p className="text-white/40 text-xs font-mono">Difficulty</p>
                            <p className="text-orange-300 font-medium">{builder.difficulty?.label || "N/A"}</p>
                        </div>
                        <div className="bg-[#363a3f] border border-white/10 p-3">
                            <p className="text-white/40 text-xs font-mono">Flag format</p>
                            <p className="text-orange-300 font-medium">{builder.flag_format || "N/A"}</p>
                        </div>
                    </div>
                    <div className="bg-[#363a3f] border border-white/10 p-3 space-y-2">
                        <p className="text-white/40 text-xs font-mono">Description</p>
                        <div className="max-h-20 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            <p className="text-white/60 text-sm leading-relaxed wrap-break-word">{builder.description || "No description"}</p>
                        </div>
                    </div>
                    {(displayImage && currentImage !== "") || displayImageRightPanel !== -1 && (
                        <div onClick={() => { setDisplayImage(false); setDisplayImageRightPanel(-1); }} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
                            <div onClick={(e) => { e.stopPropagation() }} className="relative">
                                <img src={currentImage !== "" ? currentImage : builder.images[displayImageRightPanel]} alt="Image de départ" className="w-[30vw] max-w-4xl h-auto rounded-lg" />
                                <button onClick={() => { setDisplayImage(false); setDisplayImageRightPanel(-1); }} className="absolute -top-4 -right-4 bg-white text-black rounded-full p-2 shadow-lg hover:scale-110 transition duration-500 cursor-pointer hover:text-red-600"><CiCircleRemove size={30} /></button>
                            </div>
                        </div>
                    )}
                    {builder.images.length > 0 ? (
                        <div className="bg-[#363a3f] border border-white/10 p-2 flex items-start justify-center gap-8 w-full flex-wrap">
                            {builder.images.map((v, k) => (
                                <div key={k} onClick={(e) => { e.stopPropagation() }} className="relative">
                                    <img key={k} src={v} onClick={() => setDisplayImageRightPanel(k)} alt="Image de départ" className="h-40 w-40 object-cover rounded-lg border border-white/10 cursor-pointer transition duration-500" />
                                    <button onClick={() => handleRemoveImage(k)} className="absolute -top-4 -right-4 bg-[#212529] text-white rounded-full p-2 shadow-lg hover:scale-110 transition duration-500 cursor-pointer hover:text-red-600"><AiFillDelete size={15} /></button>
                                </div>
                            ))}
                        </div>
                    ) : <h2 className="text-orange-400 text-center bg-[#363a3f] border border-white/10 py-5 flex items-center justify-center gap-3 font-mono"><TiWarning size={25}/>No images available at the moment<TiWarning size={25}/></h2>}
                    {flags.length > 0 ? (
                        <div className="bg-[#363a3f] border border-white/10 p-2 flex flex-col items-start justify-start gap-2 w-full flex-wrap">
                            <h2>Liste des flags : ( Titre | Flag )</h2>
                            {flags.map((v, k) => (
                                <div key={k} className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-2">
                                        <p>{k + 1} - </p>
                                        <p>{v.title} - {v.flag}</p>
                                    </div>
                                    <button onClick={() => handleRemoveFlag(k)} className="text-red-600/40 rounded-full p-2 shadow-lg hover:scale-110 transition duration-500 cursor-pointer hover:text-red-600"><AiFillDelete size={20} /></button>
                                </div>
                            ))}
                        </div>
                    ) : <h2 className="text-orange-400 text-center bg-[#363a3f] border border-white/10 py-5 flex items-center justify-center gap-3 font-mono"><TiWarning size={25}/>No flags available at the moment<TiWarning size={25}/></h2>}
                    {displayFlags && <CreateFlag onClose={() => setDisplayFlags(false)} onSubmit={(flag) => setFlags(prev => [...prev, flag])} />}
                </div>
            </div>
        </div>
    );
}