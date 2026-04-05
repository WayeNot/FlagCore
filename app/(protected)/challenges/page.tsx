"use client";

import Navbar from "@/components/Navbar";
import { useRouter } from 'next/navigation'

export default function Home() {
    const router = useRouter();
    
    const challenges = [
        { title: "Phishout", link: "/phishout" }
    ]
    
    return (
        <div>
            <Navbar />
            {challenges.map((el, i) => (
                <div key={i} onClick={() => router.push(`/ctf${el.link}`)} className="p-4 m-8 border border-gray-600 text-white/40 rounded-[7px] w-1/10 hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center">
                    <p>{el.title}</p>
                </div>
            ))}
        </div>
    );
}