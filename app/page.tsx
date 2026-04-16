"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { User } from "@/lib/types.js";
import { motion } from "motion/react"

export default function Home() {

    let date = new Date();

    const [userSession, setUserSession] = useState<{ userData: User | null }>({ userData: null })
    const [sessionLoaded, setSessionLoaded] = useState(false)

    useEffect(() => {
        if (sessionLoaded) return
        async function getSession() {
            const res = await fetch("/api/session")
            const data = await res.json()
            setUserSession(data)
            setSessionLoaded(true)
        }

        getSession()
    }, [])

    return (
        <div>
            <Navbar />
            <h2 className="text-white/70 text-xl text-[70px] mt-45 ml-20 font-mono text-left font-bold">Welcome to your CTF platform.</h2>
            <div className="border-t-2 border-b-2 border-white/40 ml-20 mr-20 mt-20">
                <motion.h2 className="text-white/70 text-xl text-[30px] mt-5 ml-10 font-mono text-left opacity-0" animate={{ opacity: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100] }} transition={{ duration: 5 }}>{userSession.userData?.username}@flagcore {date.toISOString().split('T')[0]} - Session not ready, loading ...</motion.h2>
                <motion.h2 className="text-white/70 text-xl text-[30px] mt-5 ml-10 font-mono text-left opacity-0" animate={{ opacity: [0, 0, 0, 0, 0, 0, 0, 100, 100, 100] }} transition={{ duration: 5 }}>{userSession.userData?.username}@flagcore {date.toISOString().split('T')[0]} - Session established with flagcore</motion.h2>
                <motion.h2 className="text-white/70 text-xl text-[30px] mt-5 mb-5 ml-10 font-mono text-left opacity-0" animate={{ opacity: [0, 0, 0, 0, 0, 0, 0, 0, 0, 100] }} transition={{ duration: 5 }}>{userSession.userData?.username}@flagcore {date.toISOString().split('T')[0]} - Session ready for work</motion.h2>
            </div>
        </div>
    );
}