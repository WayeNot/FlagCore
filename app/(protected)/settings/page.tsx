"use client"

import InsertFile from "@/components/challenges/InsertFile";
import { useNotif } from "@/components/NotifProvider";
import DropDown from "@/components/ui/DropDown";
import { useApi } from "@/hooks/useApi";
import { default_pp, statusColor } from "@/lib/config";
import { socialMedias, Status, statusBtn } from "@/lib/types"
import { useNavData } from "@/stores/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CiSquareInfo } from "react-icons/ci";
import { ImTab } from "react-icons/im";
import { IoSettings, IoShareSocial } from "react-icons/io5";
import { MdOutlineDangerous, MdOutlinePassword } from "react-icons/md";
import { PiSecurityCameraFill } from "react-icons/pi";

export default function Home() {
    const { call } = useApi();
    const { showNotif } = useNotif()
    const router = useRouter();

    const { user_id, username, mail, bio, role, pp_url, status, socialMedia, updateUsername, updateMail, updateBio, updatePp_url, updateStatus, updateSocialMedia } = useNavData()

    const [displayFiles, setDisplayFiles] = useState(false)

    const [displayStatus, setDisplayStatus] = useState(false)

    const panelTab = ["Account Details", "Preferences", "Password and Security"]

    const [panelT, setPanelT] = useState(panelTab[0])

    const [password, setPassword] = useState({ currentPassword: "", newPassword1: "", newPassword2: "" })

    const updateProfilePicture = async (selectedFile: File[]) => {
        const formData = new FormData();
        selectedFile.forEach(f => formData.append("files[]", f));
        const res = await call(`/api/upload`, { method: "POST", body: formData })
        setDisplayFiles(false)
        const newPicture = res.files[0];
        updatePp_url(newPicture)
    }

    const updateProfile = async () => {
        if (!username || !mail || !bio || !status) {
            showNotif("Missing field(s) !")
            return
        }
        await call(`/api/user/${user_id}/Account/updateProfile`, { method: "PATCH", body: JSON.stringify({ username: username, mail: mail, bio: bio, pp_url: pp_url, status: status }) })
        showNotif("Your information has been updated successfully!", "success")
    }

    const updateSocial = async () => {
        await call(`/api/user/${user_id}/Account/updateSocial`, { method: "PATCH", body: JSON.stringify({ social: socialMedia }) })
        showNotif("Social information has been updated successfully!", "success")
    }

    const disableAccount = async () => {
        await call(`/api/user/${user_id}/Account/disableAccount`, { method: "PATCH" }, ["Account disabled successfully"])
        router.refresh()
        router.push("/accounts/login")
    }

    const selectedStatusOption = statusBtn.find(o => o.value === status) ?? null;

    // Password & Security ↓

    const updatePassword = async () => {
        if (!password.currentPassword || !password.newPassword1 || !password.newPassword2) {
            showNotif("Missing field(s) !")
            return
        }

        await call(`/api/user/${user_id}/Account/resetPassword`, { method: "PATCH", body: JSON.stringify({ password }) }, ["Password successfully changed !"])
        setPassword({ currentPassword: "", newPassword1: "", newPassword2: "" })
    }

    return (
        <div className="flex justify-center gap-14 m-auto w-full">
            <div className=" flex flex-col items-start bg-white/5 w-fit p-5 text-white/40 h-fit">
                <h2 className="flex items-center gap-3 font-semibold text-white/50"><IoSettings />Manage account</h2>
                <hr className="text-white/70 w-full my-5 m-auto" />
                <div className="flex items-start flex-col">
                    {panelTab.map((v, k) => (
                        <button key={k} onClick={() => setPanelT(v)} className={`${v === panelT ? "bg-white/15" : "hover:border-white/10 hover:bg-white/5"} text-[12px] text-left font-semibold w-full text-gray-300 p-2 border-none hover:text-white transition duration-500 cursor-pointer`}>{v}</button>
                    ))}
                </div>
            </div>
            <div className="w-3/6">
                {panelT === "Account Details" && (
                    <div>
                        <div className="flex items-center justify-between font-semibold text-gray-300">
                            <h2>Public profile</h2>
                            <Link href={`/user/@${username}`} className="text-[12px] p-2 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition duration-500 cursor-pointer">Go to your personal profile</Link>
                        </div>
                        <hr className="text-white/70 w-full my-5 m-auto" />
                        <div className="flex items-start gap-8 w-full my-5">
                            <div className="flex flex-col gap-5 flex-1">
                                <div className="flex flex-col w-full bg-white/5 p-4">
                                    <h2 className="flex items-center gap-3 text-[20px] font-bold text-white/40 mb-5 w-full"><CiSquareInfo className="text-[25px]" />General Information</h2>
                                    <div className="flex flex-col items-start gap-5 w-full">
                                        <div className="flex items-center gap-2 w-full">
                                            <div className="flex flex-col gap-2 w-1/2">
                                                <h2 className="font-bold text-white/60">Username ( no space ! )</h2>
                                                <input type="text" placeholder={"Your username"} className="p-2 border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition duration-500" value={username} onChange={e => { const value = e.target.value.replace(/\s/g, ""); updateUsername(value) }} />
                                            </div>
                                            <div className="flex flex-col gap-2 w-1/2">
                                                <h2 className="font-bold text-white/60">Public mail</h2>
                                                <input type="email" placeholder={"Your mail"} className="p-2 border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition duration-500" value={mail} onChange={e => { const value = e.target.value.replace(/\s/g, ""); updateMail(value) }} />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 w-full">
                                            <div className="flex flex-col gap-2 w-1/2">
                                                <h2 className="font-bold text-white/60">Display Picture</h2>
                                                <input type="email" placeholder={"Your display picture"} className="p-2 border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition duration-500" value={pp_url} onChange={e => updatePp_url(e.target.value)} />
                                            </div>
                                            <div className="flex flex-col gap-2 w-1/2">
                                                <h2 className="font-bold text-white/60">Status</h2>
                                                <DropDown<Status> isOnce label="Status" value={selectedStatusOption} isOpen={displayStatus} options={statusBtn} onToggle={() => setDisplayStatus(!displayStatus)} onSelect={(v) => { updateStatus(v.value); setDisplayStatus(false) }} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 w-full">
                                            <h2 className="font-bold text-white/60">Bio</h2>
                                            <div className="w-full flex flex-col">
                                                <textarea maxLength={150} className="p-2 w-full border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition duration-500 resize-none h-25" placeholder="Tell us a little bit about yourself" value={bio} onChange={e => updateBio(e.target.value)} />
                                                <p className="text-white/40 flex justify-end">{bio.length} / 150</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={updateProfile} className="text-[12px] mt-5 w-fit font-semibold text-gray-300 p-2 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition duration-500 cursor-pointer">Save Changes</button>
                                </div>
                                <div className="flex flex-col w-full bg-white/5 p-4">
                                    <h2 className="flex items-center gap-3 text-[20px] font-bold text-white/40 mb-5 w-full"><IoShareSocial className="text-[25px]" />Social Information</h2>
                                    <div className="flex flex-col items-start gap-5 w-full">
                                        {socialMedias.map(social => (
                                            <div key={social.key} className="flex items-center gap-4 w-full">
                                                <social.icon className="text-white/40 text-[25px]" />
                                                <input type="text" placeholder={`Your ${social.label}`} className="w-full p-2 border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition duration-500" value={socialMedia[social.key]} onChange={e => updateSocialMedia(social.key, e.target.value)} />
                                            </div>
                                        ))}
                                        <button onClick={updateSocial} className="text-[12px] mt-5 w-fit font-semibold text-gray-300 p-2 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition duration-500 cursor-pointer">Save Changes</button>
                                    </div>
                                </div>
                                <div className="flex flex-col w-full bg-white/5 p-4">
                                    <h2 className="flex items-center gap-3 text-[20px] font-bold text-white/40 mb-2"><MdOutlineDangerous className="text-[25px]" />Disable your account</h2>
                                    <div className="flex flex-col items-start gap-5">
                                        <p className="text-white/40 text-[13px] italic">If you disable your account you will lose definitive access to it with no way of recovery. Your personal data and progress will be erased and lost as well as any ongoing subscription.</p>
                                        <button onClick={disableAccount} className="text-[12px] w-fit font-semibold text-gray-300 p-2 border border-white/10 bg-red-500/30 hover:bg-red-500/50 hover:text-white transition duration-500 cursor-pointer">Disable my account</button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-start w-fit bg-white/5 p-3">
                                <img onClick={() => setDisplayFiles(true)} src={pp_url || default_pp} alt="user logo" className={`max-w-32 object-cover cursor-pointer transition duration-500 shrink-0 ${statusColor[status ?? "offline"]}`} />
                                <div className="flex flex-col items-start gap-2 mt-2 flex-wrap">
                                    {role?.map((v, k) => (
                                        <p key={k} className={`${v.color} text-white/40 w-fit text-[12px] p-2`}>{v.label}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {panelT === "Preferences" && (
                    <div className="w-full flex flex-col items-center gap-5">
                        <div className="flex flex-col w-full bg-white/5 p-4">
                            <h2 className="flex items-center gap-5 text-[20px] font-bold text-white/40 mb-5"><ImTab className="text-[25px]" />Preferences</h2>
                            <div className="flex flex-col gap-5 flex-1">
                                <div className="w-full flex flex-col gap-3">
                                    <h2 className="text-white/40 text-[25px] text-center">Comming soon...</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {panelT === "Password and Security" && (
                    <div className="w-full flex flex-col items-center gap-5">
                        <div className="flex flex-col w-full bg-white/5 p-4">
                            <h2 className="flex items-center gap-5 text-[20px] font-bold text-white/40 mb-5"><MdOutlinePassword className="text-red-500/40" />Change password</h2>
                            <div className="flex flex-col gap-5 flex-1">
                                <div className="w-full flex flex-col gap-3">
                                    <div className="flex flex-col gap-2 w-full">
                                        <h2 className="font-bold text-white/60">Current password</h2>
                                        <input type="text" placeholder="Enter current password" className="p-2 border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition duration-500" value={password.currentPassword} onChange={e => setPassword(prev => ({ ...prev, currentPassword: e.target.value }))} />
                                    </div>
                                    <div className="flex flex-col gap-2 w-full">
                                        <h2 className="font-bold text-white/60">New password</h2>
                                        <input type="text" placeholder="Enter new password" className="p-2 border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition duration-500" value={password.newPassword1} onChange={e => setPassword(prev => ({ ...prev, newPassword1: e.target.value }))} />
                                    </div>
                                    <div className="flex flex-col gap-2 w-full">
                                        <h2 className="font-bold text-white/60">Confirm new password</h2>
                                        <input type="text" placeholder="Re-type new password" className="p-2 border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition duration-500" value={password.newPassword2} onChange={e => setPassword(prev => ({ ...prev, newPassword2: e.target.value }))} />
                                    </div>
                                    <button onClick={updatePassword} className="text-[12px] w-fit font-semibold text-gray-300 p-2 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition duration-500 cursor-pointer">Update Password</button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-full bg-white/5 p-4">
                            <h2 className="flex items-center gap-5 text-[20px] font-bold text-white/40 mb-5"><PiSecurityCameraFill className="text-red-500/40 text-[25px]" />Two Factor Authentication</h2>
                            <div className="flex flex-col gap-5 flex-1">
                                <div className="w-full flex flex-col gap-3">
                                    <h2 className="text-white/40 text-[25px] text-center">Comming soon...</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {displayFiles && <InsertFile multiple={false} onClose={() => setDisplayFiles(false)} onSubmit={updateProfilePicture} />}
            </div>
        </div>

    )
}