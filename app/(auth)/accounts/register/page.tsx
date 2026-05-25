"use client";

import { useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { MdAccountBox } from "react-icons/md";

import { useRouter } from 'next/navigation'
import { useNotif } from "@/components/NotifProvider";
import { default_pp } from "@/lib/config";
import Typewriter from 'typewriter-effect';
import { SiRedhat } from "react-icons/si";

export default function Home() {
    const { showNotif } = useNotif()

    const [credentials, setCredentials] = useState({ username: "", mail: "", password: "", pp_url: default_pp, is_anonymous: false })
    const router = useRouter();

    const validatemail = () => {
        return String(credentials.mail).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }

    const handleRegister = async (e: any) => {
        e.preventDefault();

        if (!validatemail()) { showNotif("Incorrect mail address format !", "error"); return; }

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials)
        })

        if (!res.ok) {
            const err = await res.text()
            showNotif(err, "error");
            return
        }
        router.refresh()
        router.push("/home")
    }

    const handleRedirect = () => {
        router.refresh()
        router.push("/accounts/login")
    }

    return (
        <div>
            <div className="sm:hidden md:hidden fixed inset-0 bg-[#1e1e2f] font-mono z-50 flex items-center justify-center">
                <h2 className="text-white text-xl text-center">
                    The mobile version is coming soon.
                </h2>
            </div>

            <div className="hidden lg:block">
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-black/ border border-white/70 shadow-2xl p-6 animate-fadeIn">
                        <div className="text-[35px] font-bold text-white/70 text-center font-mono w-full mb-4">
                            <Typewriter onInit={(tw) => tw.typeString('Register').stop().start()} />
                        </div>
                        <hr className="text-white w-4/5 my-5 m-auto" />
                        <form method="post" className="flex flex-col items-center w-full gap-4">
                            <div className="flex flex-col items-center justify-center gap-1 w-full">
                                <div className="flex items-center gap-3 w-4/5 h-fit">
                                    <input value={credentials.username} onChange={e => { const value = e.target.value.replace(/\s/g, ""); setCredentials({ ...credentials, username: value }) }} className="border-2 font-mono text-[20px] border-white/40 w-full text-white/80 p-1.5" placeholder="Username" type="text" maxLength={25} />
                                    {/*{credentials.is_anonymous ? <SiRedhat size={40} className="text-red-500/80 cursor-pointer w-1/5 p-1.5" onClick={() => setCredentials(prev => ({ ...prev, is_anonymous: false }))}/> : <SiRedhat size={40} className="text-green-500/80 cursor-pointer w-1/5 p-1.5" onClick={() => setCredentials(prev => ({ ...prev, is_anonymous: true }))} />}*/}
                                </div>
                                <input value={credentials.mail} onChange={e => { const value = e.target.value.replace(/\s/g, ""); setCredentials({ ...credentials, mail: value }) }} className="border-2 font-mono text-[20px] border-white/40 w-4/5 text-white/80 p-1.5 mt-1" placeholder="Mail address" type="email" maxLength={50} />
                                <div className="w-full flex flex-col justify-center items-center">
                                    <input value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} className="border-2 font-mono text-[20px] border-white/40 w-4/5 text-white/80 p-1.5  mt-1" placeholder="Password" type="password" maxLength={50} />
                                    <p>Minimum :</p>
                                    <div className="w-4/5 flex flex-col items-center text-white/40 bg-white/30">
                                        <p className={credentials.password.length >= 8 ? "text-green-500/60" : "text-red-500/60"}>8 caractères</p>
                                        <p className={/[A-Z]/.test(credentials.password) ? "text-green-500/60" : "text-red-500/60"}>Une majuscule</p>
                                        <p className={/[a-z]/.test(credentials.password) ? "text-green-500/60" : "text-red-500/60"}>Une minuscule</p>
                                        <p className={/[\d]/.test(credentials.password) ? "text-green-500/60" : "text-red-500/60"}>Un chiffre</p>
                                        <p className={/[.*+?^${}()|[\]\\]/g.test(credentials.password) ? "text-green-500/60" : "text-red-500/60"}>Un caractère spécial</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={(e) => handleRegister(e)} className="cursor-pointer flex items-center justify-center gap-3 border-2 border-white/40 text-white/40 w-4/5 p-2 font-mono text-[20px] hover:bg-white/40 hover:border-white/40 hover:text-white transition duration-500">Enter<BsArrowRight /></button>
                            <p onClick={handleRedirect} className="flex items-center gap-3 text-white/30 hover:underline font-mono text-[17px] transition duration-500 cursor-pointer hover:text-white pt-5"><MdAccountBox />Login</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}