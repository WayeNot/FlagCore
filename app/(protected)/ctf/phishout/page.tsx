"use client";

import { useNotif } from "@/components/NotifProvider"
import { Flag } from "@/lib/types";
import { useEffect, useState } from "react";
import { FaLightbulb } from "react-icons/fa";

export default function Home() {
    const { showNotif } = useNotif()
    
    const flags: Flag[] = [
        { nbr: 1, name: "Nom de l'image ?", flag: "free-criquet.png", flag_format: "x", description: "Un fichier intéressante est cachée dans le container. Quel est son nom exact (avec l'extension) ?", hint: "Parfois, un mot de passe faible n'est pas suffisant.", isHintShow: false },
        { nbr: 2, name: "Nom du compte ?", flag: "criquet_sauvage4", flag_format: "x", description: "Un nom de compte est dissimulé dans une image. Parviendrez-vous à le retrouver ?", hint: "L'équipe qui a saisi le serveur à découvert la présence d'un logiciel de stéganographie.", isHintShow: false },
        { nbr: 3, name: "Nom de l'audio ?", flag: "", flag_format: "x", description: "Un audio suspect a été identifié, a vous de le retrouver.", hint: "Concentrez vos recherches sur la plateforme SoundCloud", isHintShow: false },
        { nbr: 4, name: "Identité de la prochaine victime ?", flag: "Edvard_Doris", flag_format: "Nom_Prénom", description: "Arriverez-vous à retrouver l'identité de la prochaine victime avant qu'il ne soit trop tard ?", hint: "Concentrez vos recherches sur la plateformes Reddit", isHintShow: false },
        { nbr: 5, name: "Où habite-t-elle ?", flag: "le-puy-en-velay", flag_format: "x", description: "Arriverez-vous à retrouver la ville où habite cette victime ?", hint: "", isHintShow: false },
    ];

    const [isFind, setIsFind] = useState<Record<number, boolean>>({ 1: false, 2: false, 3: false, 4: false });
    const [selectedFlag, setSelectedFlag] = useState<Flag | null>(null);
    const [currentFlag, setCurrentFlag] = useState("");
    const [hintsShown, setHintsShown] = useState<Record<number, boolean>>({});
    const [hasGetHint, setHasGetHint] = useState(false);
    const [hintTime, setHintTime] = useState(0);

    useEffect(() => {
        if (!hasGetHint) return;

        const interval = setInterval(() => {
            setHintTime(prev => {
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
        if (!selectedFlag) return;

        if (hintTime > 0) return showNotif(`Vous devez attendre ${hintTime} minute(s) avant de redemander !`, "error", 6000);

        setHintsShown({ ...hintsShown, [selectedFlag.nbr]: true });
        setHintTime(15);
        setHasGetHint(true);
        showNotif("Indice affiché !", "success", 4000);
    };

    const handleValidate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentFlag) {
            showNotif("Aucun flag donné", "error");
            return;
        }

        if (selectedFlag) {
            if (currentFlag === `phishout{${selectedFlag.flag}}`) {
                showNotif("Vous avez réussi ce flag", "success");
                setIsFind({ ...isFind, [selectedFlag.nbr]: true });
                setSelectedFlag(null);
                setCurrentFlag("");
            } else {
                showNotif("Mauvais flag", "error");
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#212529]">
            <div className="py-10 sm:py-15 px-4 bg-gray-800 flex flex-col items-center justify-center gap-5">
                <h2 className="text-white/60 text-xl sm:text-3xl italic text-center">CTF PhishOut</h2>
                <hr className="w-2/4 text-white" />
                <p className="text-center w-full sm:w-2/3 lg:w-1/2 text-white/40 text-sm sm:text-base leading-relaxed">
                    Vous faites partie du groupe spécial d’investigation de la gendarmerie. Depuis plusieurs jours, un réseau de hackers spécialisé dans la vente de kits clés en main automatisés pour créer et déployer des sites de phishing revendique de nombreuses attaques sur le sol français. Grâce au travail des équipes, vous avez réussi à identifier les têtes du réseau : Gérard, 34 ans, ancien développeur full stack reconverti dans le développement d’API le jour et chef du réseau la nuit. À ses côtés, Marin, 19 ans, passionné d’informatique depuis tout petit, et Rémy, 20 ans, également passionné d’informatique. À eux trois, ils forment un groupe très dangereux. D’après des fichiers récupérés sur l’un de leurs serveurs, ils préparent une attaque contre le responsable informatique d’une entreprise d’hébergement française.<br />
                    Votre mission : récupérer les fichiers compromis et identifier quelle sera leur prochaine cible.
                </p>
                <a target="_blank" className="border-2 px-4 py-2 rounded-lg text-white/60 hover:bg-white hover:text-black hover:border-white transition duration-500 text-sm sm:text-base" href="../../Files.zip">Ressource de départ</a>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 w-full sm:w-[90%] lg:w-[65%] m-auto mt-10 sm:mt-20 px-4">
                {flags.map((item) => (
                    <div key={item.nbr} onClick={() => setSelectedFlag(item)} className={`w-full flex items-center justify-center sm:w-[48%] lg:w-[18%] py-5 sm:py-6 text-center rounded-lg ${!isFind[item.nbr] ? "bg-red-500 hover:bg-red-800" : "bg-green-600 hover:bg-green-800"} transition duration-500 cursor-pointer font-bold`}>
                        <p className="text-white/70 text-sm sm:text-base">{item.name}</p>
                    </div>
                ))}
            </div>

            {selectedFlag && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6 animate-fadeIn">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">{selectedFlag.name}</h2>
                            <button onClick={() => { setSelectedFlag(null); setCurrentFlag("")}} className="text-gray-400 hover:text-white transition duration-500 cursor-pointer">✕</button>
                        </div>
                        <div className="my-5 flex flex-col gap-3 text-white/40">
                            <p className="text-gray-300 text-[17px] leading-relaxed">{selectedFlag.description}</p>
                            <p>{"Format du flag : phishout{" + selectedFlag.flag_format + "}"}</p>
                        </div>
                        <div className="flex items-center gap-3 mb-5">
                            <input value={currentFlag} onChange={(e) => setCurrentFlag(e.target.value)} type="text" placeholder={"phishout{" + selectedFlag.flag_format + "}"} className="flex-1 h-10 px-4 rounded-lg bg-[#2a2a3d] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" />
                            {selectedFlag.hint && (
                                <button onClick={handleHint} className="h-10 px-3 rounded-lg bg-[#2a2a3d] border border-gray-600 text-white hover:text-yellow-300 transition duration-500 cursor-pointer"><FaLightbulb /></button>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button onClick={(e) => handleValidate(e)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium cursor-pointer transition duration-500">Valider</button>
                            <button onClick={() => setSelectedFlag(null)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium cursor-pointer duration-500">Fermer</button>
                        </div>
                        {hintsShown[selectedFlag.nbr] && (
                            <div>
                                <p className="w-full mt-4 px-4 py-2 rounded-lg bg-[#2a2a3d] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"><span className="text-yellow-300">Indice</span> : {selectedFlag.hint}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}