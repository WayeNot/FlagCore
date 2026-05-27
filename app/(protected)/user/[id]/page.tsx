"use client"

import { useApi } from "@/hooks/useApi";
import { default_pp, statusColor } from "@/lib/config";
import { socialMedias, User } from "@/lib/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    const { call } = useApi()
    const params = useParams<{ id: string }>();

    const [userData, setUserData] = useState<User>(); // user_id | username | bio | email | role | created_at | coins | points | pp_url | status | is_online | is_anonymous | banner

    const getUserData = async () => {
        console.log(params.id);
        
        const data = await call(`/api/user/${params.id}`)
        setUserData(data.data)
    }

    useEffect(() => {
        getUserData()
    }, [params])
    return (
        <div className="m-auto w-1/2 mt-2">
            <div>
                <img className="w-full bg-cover bg-center bg-no-repeat h-100 " src={userData?.banner} alt="" />
                <div className="flex items-end relative">
                    <div className="absolute bottom-5 left-5 flex items-center gap-3 text-[18px] hover:text-white/70 transition font-mono duration-500"><img src={userData?.pp_url || default_pp} alt="Logo de l'utilisateur" className={`w-35 bg-center bg-cover bg-no-repeat ${statusColor[userData?.status ?? "offline"]}`} /></div>
                    <div className="pl-45 bg-white/30 text-[#212529] w-full p-5 flex items-start justify-between">
                        <div className="w-3/4 flex flex-col gap-2">
                            <p className="font-semibold italic text-white/40 text-[22px]">@{userData?.username}</p>
                            <p className="font-semibold italic text-white/30 text-[14px] wrap-break-word border p-1 scrollbar-thumb-white/40 w-full max-h-[10vh] overflow-y-auto whitespace-pre-line">{userData?.bio ? userData?.bio : "Aucune bio pour le moment !"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {socialMedias.map(social => {
                                if (!userData?.social_media[social.key]) return;

                                return (
                                    <Link key={social.key} className="flex items-center gap-2 w-full" href={userData?.social_media[social.key] || ""}><social.icon className="text-white/30 hover:text-white/70 transition duration-500 text-[19px]" /></Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}