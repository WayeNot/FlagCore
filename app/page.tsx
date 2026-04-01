"use client";
import { useEffect, useState } from "react";

type NotifType = "success" | "error" | "warning";

interface Notif {
    display: boolean;
    message: string;
    type: NotifType;
}

interface Flag {
    nbr: number;
    name: string;
    flag: string;
    flag_format: string;
    description: string;
}

export default function Home() {
    const notifStyles = {
        success: { bg: "bg-green-500/20", text: "text-green-400", icon: "✔" },
        error: { bg: "bg-red-500/20", text: "text-red-400", icon: "✖" },
        warning: { bg: "bg-yellow-500/20", text: "text-yellow-400", icon: "⚠" },
    };

    const [notif, setNotif] = useState<Notif>({
        display: false,
        message: "",
        type: "success",
    });

    const current = notifStyles[notif.type];

    const flags: Flag[] = [
        { nbr: 1, name: "Nom de l'image", flag: "free-criquet.png", flag_format: "x", description: "Une image intéressante est caché dans le container. Quel est son nom exact ( avec extension )." },
        { nbr: 2, name: "Nom du compte", flag: "criquet_sauvage4", flag_format: "x", description: "Un nom de compte est dissimulé" },
        { nbr: 3, name: "Identité de la prochaine victime", flag: "Edvard_Doris", flag_format: "x_x", description: "Format du flag : Nom_Prénom" },
        { nbr: 4, name: "Ou habite t'elle ?", flag: "le-puy-en-velay", flag_format: "x", description: "" },
    ];
    
    const [isFind, setIsFind] = useState<Record<number, boolean>>({ 1: false, 2: false, 3: false, 4: false });

    const [selectedFlag, setSelectedFlag] = useState<Flag | null>(null);
    const [currentFlag, setCurrentFlag] = useState("");

    useEffect(() => {
        if (notif.display) {
            const timer = setTimeout(() => setNotif({ ...notif, display: false }), 5000);
            return () => clearTimeout(timer);
        }
    }, [notif.display]);

    const handleValidate = (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentFlag) {
            setNotif({ display: true, message: "Aucun flag donné", type: "error" });
            return;
        }

        if (selectedFlag) {
            if (currentFlag === `phishout{${selectedFlag.flag}}`) {
                setNotif({ display: true, message: "Vous avez réussi ce flag", type: "success" });
                setIsFind({ ...isFind, [selectedFlag.nbr]: true });
                setSelectedFlag(null);
                setCurrentFlag("");
            } else {
                setNotif({ display: true, message: "Mauvais flag", type: "error" });
                setCurrentFlag("");
            }
        }
    };

    return (
        <div className="w-screen bg-[#212529] h-screen">
            <div className="py-15 bg-gray-800 flex flex-col items-center justify-center gap-5">
                <h1 className="text-center text-[30px] font-bold">CTF projet Ydays - CyberLab</h1>
                <p className="text-center w-1/2 m-auto text-white/40">
                    Un réseau de hackers spécialisé dans la vente de starter packs de phishing. À sa tête, Gérard, 34 ans, ancien développeur full stack reconverti dans le développement d’API le jour, et chef du réseau la nuit. À ses côtés, Marin, 19 ans, passionné d’informatique depuis tout petit, et Rémy, 20 ans, également passionné d’informatique. À eux trois, ils forment un groupe très dangereux : ils mettent entre les mains de personnes non compétentes des kits clés en main automatisés pour créer et déployer des sites de phishing, ainsi que des listes de cibles récupérées lors de fuites de données sur le dark web.
                </p>
                <a target="_blank" className="border-2 p-2 rounded-[8px] hover:bg-white hover:text-black hover:border-white transition duration-500" href="informations.rar">Ressource de départ</a>
            </div>

            <div className="py-15 flex items-center justify-center gap-5">
                {flags.map((item) => (
                    <div
                        key={item.nbr}
                        onClick={() => setSelectedFlag(item)}
                        className={`px-5 py-7 w-1/5 text-center rounded-[8px] ${!isFind[item.nbr] ? "bg-red-500 hover:bg-red-800" : "bg-green-600 hover:bg-green-800"} transition duration-500 cursor-pointer font-bold`}
                    >
                        <p>{item.name}</p>
                    </div>
                ))}
            </div>

            {notif.display && (
                <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-slideIn">
                    <div className="w-full max-w-sm bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-5 flex items-center justify-center gap-4 backdrop-blur-md">
                        <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${current.bg}`}>
                            <span className={`${current.text} text-xl`}>
                                {current.icon}
                            </span>
                        </div>
                        <div className="flex-1">
                            <p className={`text-sm ${current.text} leading-relaxed`}>{notif.message}</p>
                        </div>
                        <button onClick={() => setNotif({ ...notif, display: false })} className="text-gray-400 hover:text-white transition cursor-pointer">✕</button>
                    </div>
                </div>
            )}

            {selectedFlag && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6 animate-fadeIn">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">{selectedFlag.name}</h2>
                            <button onClick={() => setSelectedFlag(null)} className="text-gray-400 hover:text-white transition cursor-pointer">✕</button>
                        </div>
                        <p className="text-gray-300 text-[17px] mb-6 leading-relaxed">{selectedFlag.description}</p>
                        <input
                            value={currentFlag}
                            onChange={(e) => setCurrentFlag(e.target.value)}
                            type="text"
                            placeholder={"phishout{" + selectedFlag.flag_format + "}"}
                            className="w-full mb-4 px-4 py-2 rounded-lg bg-[#2a2a3d] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex gap-3">
                            <button onClick={handleValidate} className="flex-1 bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-lg font-medium cursor-pointer">Valider</button>
                            <button onClick={() => setSelectedFlag(null)} className="flex-1 bg-gray-700 hover:bg-gray-600 transition text-white py-2 rounded-lg font-medium cursor-pointer">Fermer</button>
                        </div>
                    </div>
                </div>
            )}

            <footer className="w-full flex items-center justify-center gap-5 fixed bottom-3">
                <a target="_blank" href="https://www.linkedin.com/in/tim%C3%A9o-baffreau-le-roux-511a1a353/">Timéo</a>
                <a target="_blank" href="https://www.linkedin.com/in/romain-guibert-2851a52bb/">Romain</a>
                <a target="_blank" href="https://www.linkedin.com/in/aymeric-beaune-9b81b0364/">Aymeric</a>
            </footer>
        </div>
    );
}