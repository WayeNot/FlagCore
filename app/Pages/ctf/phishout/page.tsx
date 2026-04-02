"use client";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaLightbulb } from "react-icons/fa";
import { MdExitToApp } from "react-icons/md";

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
    hint: string;
    isHintShow: boolean;
}

export default function Home() {
    const notifStyles = {
        success: { bg: "bg-green-500/20", text: "text-green-400", icon: <FaCheckCircle size={28} /> },
        error: { bg: "bg-red-500/20", text: "text-red-400", icon: <FaTimesCircle size={28} /> },
        warning: { bg: "bg-yellow-500/20", text: "text-yellow-400", icon: <FaExclamationTriangle size={28} /> },
    };

    const [notif, setNotif] = useState<Notif>({
        display: false,
        message: "",
        type: "success",
    });

    const current = notifStyles[notif.type];

    const flags: Flag[] = [
        { nbr: 1, name: "Nom de l'image ?", flag: "free-criquet.png", flag_format: "x", description: "Un fichier intéressante est cachée dans le container. Quel est son nom exact (avec l'extension) ?", hint: "Parfois, un mot de passe faible n'est pas suffisant.", isHintShow: false },
        { nbr: 2, name: "Nom du compte ?", flag: "criquet_sauvage4", flag_format: "x", description: "Un nom de compte est dissimulé dans une image. Parviendrez-vous à le retrouver ?", hint: "L'équipe qui a saisi le serveur à découvert la présence d'un logiciel de stéganographie.", isHintShow: false },
        { nbr: 3, name: "Nom de l'audio ?", flag: "", flag_format: "x", description: "Un audio suspect a été identifié, a vous de le retrouver.", hint: "Concentrez vos recherches sur la plateforme SoundCloud", isHintShow: false },
        { nbr: 4, name: "Identité de la prochaine victime ?", flag: "Edvard_Doris", flag_format: "Nom_Prénom", description: "Arriverez-vous à retrouver l'identité de la prochaine victime avant qu'il ne soit trop tard ?", hint: "Concentrez vos recherches sur la plateformes Reddit", isHintShow: false },
        { nbr: 5, name: "Où habite-t-elle ?", flag: "le-puy-en-velay", flag_format: "x", description: "Arriverez-vous à retrouver la ville où habite cette victime ?", hint: "", isHintShow: false },
    ];

    const owners = [
        { name: "Timéo", linkedin: "https://www.linkedin.com/in/tim%C3%A9o-baffreau-le-roux-511a1a353/" },
        { name: "Romain", linkedin: "https://www.linkedin.com/in/romain-guibert-2851a52bb/" },
        { name: "Aymeric", linkedin: "https://www.linkedin.com/in/aymeric-beaune-9b81b0364/" },
    ];

    const [isFind, setIsFind] = useState<Record<number, boolean>>({ 1: false, 2: false, 3: false, 4: false });

    const [selectedFlag, setSelectedFlag] = useState<Flag | null>(null);
    const [currentFlag, setCurrentFlag] = useState("");

    const [hintsShown, setHintsShown] = useState<Record<number, boolean>>({});

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

    const [hasGetHint, setHasGetHint] = useState(false)
    const [hintTime, setHintTime] = useState(0)

    useEffect(() => {
        if (!hasGetHint) return;

        setHintTime(15);

        const interval = setInterval(() => {
            setHintTime((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setHasGetHint(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 60000);

        return () => clearInterval(interval);

    }, [hasGetHint]);

    const handleHint = () => {
        if (hintTime !== 0) return setNotif({ display: true, message: `Vous devez attendre ${hintTime} minutes avant de pouvoir redemander un indice !`, type: "error" });
        setHintsShown({ ...hintsShown, [selectedFlag!.nbr]: !hintsShown[selectedFlag!.nbr] });
        setHasGetHint(true)
    }

    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-[#212529]">
            <nav className="flex items-center justify-between p-4 mx-3 sm:mx-5">
                <h1 className="text-xl sm:text-2xl text-white/60 font-bold">CTF CyberLab</h1>

                <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden text-white text-2xl">☰</button>

                <div className="hidden sm:flex items-center gap-5 text-white/40">
                    <a href="/" className="hover:text-white/70 cursor-pointer">Accueil</a>
                    <a href="/Pages/challenges" className="hover:text-white/70 cursor-pointer">Nos challenges</a>
                    <p className="hover:text-white/70 cursor-pointer">Mon compte</p>
                    <MdExitToApp className="hover:text-white/70 cursor-pointer text-xl"/>
                </div>
            </nav>
            {menuOpen && (
                <div className="sm:hidden px-4 pb-4 animate-fadeIn">
                    <div className="flex flex-col gap-3">
                        <button className="w-full text-left px-4 py-3 rounded-lg bg-[#2a2a3d] text-white/70 hover:bg-[#3a3a4d] transition">Nos challenges</button>
                        <button className="w-full text-left px-4 py-3 rounded-lg bg-[#2a2a3d] text-white/70 hover:bg-[#3a3a4d] transition">Mon compte</button>
                        <button className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"><MdExitToApp/>Déconnexion</button>
                    </div>
                </div>
            )}
            <div className="py-10 sm:py-15 px-4 bg-gray-800 flex flex-col items-center justify-center gap-5">
                <h2 className="text-white/60 text-xl sm:text-3xl italic text-center">CTF PhishOut - CyberLab</h2>
                <p className="text-center w-full sm:w-2/3 lg:w-1/2 text-white/40 text-sm sm:text-base leading-relaxed">Vous faites partie du groupe spécial d’investigation de la gendarmerie. Depuis plusieurs jours, un réseau de hackers spécialisé dans la vente de kits clés en main automatisés pour créer et déployer des sites de phishing revendique de nombreuses attaques sur le sol français. Grâce au travail des équipes, vous avez réussi à identifier les têtes du réseau : Gérard, 34 ans, ancien développeur full stack reconverti dans le développement d’API le jour et chef du réseau la nuit. À ses côtés, Marin, 19 ans, passionné d’informatique depuis tout petit, et Rémy, 20 ans, également passionné d’informatique. À eux trois, ils forment un groupe très dangereux. D’après des fichiers récupérés sur l’un de leurs serveurs, ils préparent une attaque contre le responsable informatique d’une entreprise d’hébergement française.<br />Votre mission : récupérer les fichiers compromis et identifier quelle sera leur prochaine cible.</p>
                <a target="_blank" className="border-2 px-4 py-2 rounded-lg text-white/60 hover:bg-white hover:text-black hover:border-white transition duration-500 text-sm sm:text-base" href="Files.zip">Ressource de départ</a>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 w-full sm:w-[90%] lg:w-[65%] m-auto mt-10 sm:mt-20 px-4">
                {flags.map((item) => (
                    <div key={item.nbr} onClick={() => setSelectedFlag(item)} className={`w-full flex items-center justify-center sm:w-[48%] lg:w-[18%] py-5 sm:py-6 text-center rounded-lg ${!isFind[item.nbr] ? "bg-red-500 hover:bg-red-800" : "bg-green-600 hover:bg-green-800" } transition duration-500 cursor-pointer font-bold`}><p className="text-white/70 text-sm sm:text-base">{item.name}</p></div>
                ))}
            </div>

            {notif.display && (
                <div className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full sm:w-auto">
                    <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-3xl border border-gray-600 bg-gradient-to-r from-[#1e1e2f]/90 to-[#2a2a3d]/80 shadow-2xl backdrop-blur-xl">
                        <div className={`w-14 h-14 flex items-center justify-center rounded-full ${current.bg} text-white shadow-lg hover:scale-110 transition-transform duration-300`}>{current.icon}</div>
                        <div className="flex-1">
                            <p className={`text-sm sm:text-base ${current.text} font-semibold leading-relaxed`}>{notif.message}</p>
                        </div>
                        <button onClick={() => setNotif({ ...notif, display: false })} className="text-gray-400 hover:text-white transition-colors text-lg font-bold">✕</button>
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
                        <div className="my-5 flex flex-col gap-3 text-white/40">
                            <p className="text-gray-300 text-[17px] leading-relaxed">{selectedFlag.description}</p>
                            <p>{"Format du flag : phishout{" + selectedFlag.flag_format + "}"}</p>
                        </div>
                        <div className="flex items-center gap-3 mb-5">
                            <input value={currentFlag} onChange={(e) => setCurrentFlag(e.target.value)} type="text" placeholder={"phishout{" + selectedFlag.flag_format + "}"} className="flex-1 h-[40px] px-4 rounded-lg bg-[#2a2a3d] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"/>
                            {selectedFlag.hint && (
                                <button onClick={handleHint} className="h-[40px] px-3 rounded-lg bg-[#2a2a3d] border border-gray-600 text-white hover:text-yellow-300 transition"><FaLightbulb /></button>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button onClick={handleValidate} className="flex-1 bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-lg font-medium cursor-pointer">Valider</button>
                            <button onClick={() => setSelectedFlag(null)} className="flex-1 bg-gray-700 hover:bg-gray-600 transition text-white py-2 rounded-lg font-medium cursor-pointer">Fermer</button>
                        </div>
                        {hintsShown[selectedFlag.nbr] && (
                            <div>
                                <p className="w-full mt-4 px-4 py-2 rounded-lg bg-[#2a2a3d] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"><span className="text-yellow-300">Indice</span> : {selectedFlag.hint}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <footer className="w-full flex flex-col items-center justify-center gap-3 sm:gap-5 text-white/40 text-xs sm:text-sm px-4 py-5 border-t border-gray-700/50 bg-[#1e1e2f]/50 backdrop-blur-md mt-auto">
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
                    {owners.map((el) => (
                        <a key={el.name} className="hover:text-white/80 transition duration-300 hover:underline" target="_blank" href={el.linkedin}>{el.name}</a>
                    ))}
                </div>
                <p className="w-full text-center text-white/30 text-xs mt-2">
                    © 2026 CyberLab - Tous droits réservés
                </p>
            </footer>
            <script>history.replaceState("", "", "CTF-PhishOut");</script>
        </div>
    );
}