"use client";

import Navbar from "@/components/Navbar";
import { useNotif } from "@/components/NotifProvider";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { User } from "@/lib/types";

export default function Home() {

    const { showNotif } = useNotif()
    const router = useRouter();

    const [userSession, setUserSession] = useState<{ userData: User | null }>({ userData: null })
    const [sessionLoaded, setSessionLoaded] = useState(false)

    useEffect(() => {
        if (sessionLoaded) return
        const getUser = async () => {
            const res = await fetch("/api/auth/session", {
                method: "GET"
            })
            if (!res) {
                router.push("/login")
            }
            setUserSession(await res.json())
            setSessionLoaded(true)
        }
        getUser()
    }, [])

    return (
        <div>
            <Navbar />
            <h2 className="text-white/70 text-xl sm:text-7xl mt-100 font-mono text-center">Coming soon ...</h2>
            <a href="/ctf/phishout" className="text-white/70 hover:text-white/40 cursor-pointer transition duration-500 text-xl sm:text-2xl mt-10 font-mono flex justify-center items-center">Return to the phishout challenge</a>
        </div>
    );
}