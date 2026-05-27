"use client"

import { useNotif } from "@/components/NotifProvider";
import { useApi } from "@/hooks/useApi";
import { Room } from "@/lib/types";
import { data } from "framer-motion/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    const { call } = useApi()
    const { showNotif } = useNotif()
    const params = useParams<{ id: string }>();

    const [room, setRoom] = useState<Room>()

    useEffect(() => {
        const getRoom = async () => {
            const data = await call(`/api/room/${params.id}`)
            setRoom(data.data)
        }
        getRoom()
    }, [])

    return (
        <div className="m-auto w-1/2 mt-2">
            <div>
                <h2>Nouvelle room ! {room?.name}</h2>
            </div>
        </div>
    )
}