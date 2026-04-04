"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa"

type NotifType = "success" | "error" | "warning"

interface NotifItem {
    id: number
    message: string
    type: NotifType
    duration?: number
}

interface NotifContextType {
    showNotif: (message: string, type?: NotifType, duration?: number) => void
}

const NotifContext = createContext<NotifContextType | undefined>(undefined)

let notifId = 0

export const NotifProvider = ({ children }: { children: ReactNode }) => {
    const [notifs, setNotifs] = useState<NotifItem[]>([])

    const showNotif = (message: string, type: NotifType = "success", duration = 4000) => {
        const id = ++notifId
        setNotifs(prev => [...prev, { id, message, type, duration }])
        setTimeout(() => setNotifs(prev => prev.filter(n => n.id !== id)), duration)
    }

    return (
        <NotifContext.Provider value={{ showNotif }}>
            {children}
            <div className="fixed top-4 right-4 z-500 flex flex-col gap-2">
                {notifs.map(n => (
                    <div key={n.id} className={`flex items-center gap-3 p-3 rounded-lg shadow-lg animate-slideDown ${n.type === "success" ? "bg-green-50 text-green-700" : n.type === "error" ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"}`}>
                        <div>{n.type === "success" ? <FaCheckCircle size={20} /> : n.type === "error" ? <FaTimesCircle size={20} /> : <FaExclamationTriangle size={20} />}</div>
                        <div className="flex-1 text-sm">{n.message}</div>
                        <button onClick={() => setNotifs(prev => prev.filter(x => x.id !== n.id))} className="font-bold hover:opacity-70 cursor-pointer transition duration-500">✕</button>
                    </div>
                ))}
            </div>
        </NotifContext.Provider>
    )
}

export const useNotif = () => {
    const context = useContext(NotifContext)
    if (!context) throw new Error("useNotif doit être utilisé avec un provider !")
    return context
}