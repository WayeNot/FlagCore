"use client";

import Navbar from "@/components/Navbar";

export default function Home() {
    return (
        <div>
            <Navbar/>
            <h2 className="text-white/70 text-xl text-[70px] mt-30 ml-20 font-mono text-center font-bold">Tools</h2>
            <div className="border-1 border-white/70 mt-5 ml-20 mr-20"></div>
            <h2 className="text-white/70 text-xl text-[40px] mt-5 ml-20 font-mono text-left">GEOINT</h2>
            <div className="border-1 border-white/70 mt-5 ml-20 mr-20"></div>
            <h2 className="text-white/70 text-xl text-[40px] mt-5 ml-20 font-mono text-left">SOCMINT</h2>
            <div className="border-1 border-white/70 mt-5 ml-20 mr-20"></div>
            <h2 className="text-white/70 text-xl text-[40px] mt-5 ml-20 font-mono text-left ">OPSEC</h2>

            <div>

            </div>
        </div>
    );
}