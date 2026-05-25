"use client";

import Link from "next/link";
import Typewriter from 'typewriter-effect';

export default function Home() {

    return (
        <div>
            <h2 className="text-white/50 font-mono text-[50px] text-center mt-30 font-bold border-t-2 border-b-2">Create an account {">"} Log in {">"} Start exploring</h2>
            <div className="text-white/70 font-mono text-[40px] ml-60 mt-23">
                <Typewriter onInit={(tw) => tw.typeString('What is flagcore ?').stop().start()} />
            </div>
            <p className="text-white/50 font-mono text-[30px] mx-60 mt-5">FlagCore is a free CTF platform dedicated to cybersecurity enthusiasts wishing to develop their skills in a fun and concrete way. Through a series of immersive and progressive challenges, users are immersed in realistic scenarios where they play real cybersecurity investigators.</p>

            <div className="flex items-center justify-center mb-20 mt-20">
                <Link href="/accounts/login" className="text-white/70 p-3 text-center text-xl text-[30px] font-mono border-t-2 border-b-2 border-white/40 font-bold transition duration-500 hover:bg-white/70 hover:text-[#1e1e2f]">Enter on Flagcore</Link>
            </div>
        </div>
    )
}