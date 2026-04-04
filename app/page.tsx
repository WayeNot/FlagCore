"use client";

import { useEffect, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { MdAccountBox } from "react-icons/md";

export default function Home() {
    const [userSession, setUserSession] = useState({ userData: [] })

    useEffect(() => {
        async function getSession() {
            const res = await fetch("/api/session", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })

            if (!res.ok) {
                console.error('Impossible de GET la session')
                return
            }
            setUserSession(await res.json())
        }
        getSession()
    }, [])

    return (
        <div>
            <h2 className="text-white/70 text-xl sm:text-7xl mt-100 font-mono text-center">Coming soon ...</h2>
            <a href="/ctf/phishout" className="text-white/70 hover:text-white/40 cursor-pointer transition duration-500 text-xl sm:text-2xl mt-10 font-mono flex justify-center items-center">Return to the phishout challenge</a>
        </div>
    );
}