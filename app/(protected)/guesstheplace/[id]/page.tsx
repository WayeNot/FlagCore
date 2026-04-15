"use client"
import Navbar from '@/components/Navbar'
import { useNotif } from '@/components/NotifProvider'
import { guessTheP } from '@/lib/types'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CiCircleCheck, CiCircleRemove } from 'react-icons/ci'
import { FaLightbulb } from 'react-icons/fa'
import { IoAlertCircleOutline, IoWarningSharp } from 'react-icons/io5'

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const { showNotif } = useNotif()
    const [guesstheplace, setGuessThePlace] = useState<guessTheP>()
    const [displayImage, setDisplayImage] = useState(false)
    const [currentFlag, setCurrentFlag] = useState("")
    const [displayHint, setDisplayHint] = useState(false)
    const [isFlagFind, setIsFlagFind] = useState(false)

    useEffect(() => {
        if (!params?.id) return;
        const getGTP = async () => {
            const req = await fetch(`/api/guessThePlace/${params.id}`, {
                method: "GET"
            })
            if (!req.ok) {
                const err = await req.json()
                showNotif(err.err, "error")
                router.push(`/challenges`)
                return
            }
            const data = await req.json()
            setGuessThePlace(data.data[0])
        }
        getGTP()
    }, [params.id])

    const backChallenges = () => {
        router.push(`/challenges`)
    }

    const handleHint = () => {
        setDisplayHint(true)
    }

    const handleValidate = async () => {
        if (currentFlag === `${guesstheplace?.title}{${guesstheplace?.flag}}`) {
            const req = await fetch("/api/guesstheplace")
            showNotif("GG ! Vous avez trouvé le flag !", "success")
            setCurrentFlag("")
            setIsFlagFind(true)
        }
    }

    return (
        <div className="flex flex-col bg-[#212529]">
            <Navbar />
            <div className="py-5 sm:py-15 px-4 bg-gray-800 flex flex-col items-center justify-center gap-5">
                {isFlagFind && (
                    <p className="w-fit px-4 py-2 rounded-lg bg-[#2a2a3d] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-3"><span className="text-green-600"><CiCircleCheck /></span>Vous avez déjà trouvé le flag ! ( {`${guesstheplace?.title}{${guesstheplace?.flag}}`} )</p>
                )}
                <div className='w-fit'>
                    <h2 className="text-white/60 text-xl sm:text-3xl italic text-center">GEOINT - {guesstheplace?.title}</h2>
                    <p className='text-center my-2 text-white/40'>Difficulté : {guesstheplace?.difficulty}</p>
                    <hr className="w-full text-white my-3" />
                </div>
                <p className="text-center w-full sm:w-2/3 lg:w-1/2 text-white/40 text-sm sm:text-base leading-relaxed">{guesstheplace?.description}</p>
                <button onClick={() => setDisplayImage(true)} className="border-2 px-4 py-2 rounded-lg text-white/60 hover:bg-white hover:text-black cursor-pointer hover:border-white transition duration-500 text-sm sm:text-base">Image de départ</button>
                <div className="w-full max-w-md bg-linear-to-br from-[#1e1e2f] to-[#181825] border border-gray-700 rounded-2xl shadow-2xl p-6">
                    <h2 className="text-xl font-semibold text-white">Trouve l'emplacement 📍</h2>
                    <p className="text-xs text-white/40 mb-4 mt-2">{`Format du flag : ${guesstheplace?.title}{flag}`}</p>
                    <div className="flex items-center gap-2 mb-4">
                        {isFlagFind ? (
                            <div className="flex-1 relative">
                                <input value={""} disabled type="text" placeholder="Vous avez déjà trouvé ce flag !" className="placeholder:text-red-500/40 w-full h-11 px-4 pr-10 rounded-lg bg-[#2a2a3d] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30">🔎</span>
                            </div>) : (
                            <div className="flex-1 relative">
                                <input value={currentFlag} onChange={(e) => setCurrentFlag(e.target.value)} type="text" placeholder={`${guesstheplace?.title}{flag}`} className="w-full h-11 px-4 pr-10 rounded-lg bg-[#2a2a3d] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30">🔎</span>
                            </div>
                        )}
                        {isFlagFind ? (
                            <div>
                                {guesstheplace?.hint && (
                                    <button disabled className="h-11 w-11 flex items-center justify-center rounded-lg bg-[#2a2a3d] border border-gray-600 text-yellow-300 hover:text-yellow-600 hover:border-yellow-600 transition duration-500 cursor-pointer"><FaLightbulb/></button>
                                )}
                            </div>
                        ) : (
                            <div>
                                {guesstheplace?.hint && (
                                    <button onClick={handleHint} className="h-11 w-11 flex items-center justify-center rounded-lg bg-[#2a2a3d] border border-gray-600 text-white hover:text-yellow-300 hover:border-yellow-400 transition duration-500 cursor-pointer"><FaLightbulb /></button>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {isFlagFind ? (
                            <button disabled className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition duration-500 active:scale-95 cursor-not-allowed">Valider</button>
                        ) : (
                            <button onClick={() => handleValidate()} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition duration-500 cursor-pointer active:scale-95">Valider</button>
                        )}
                        <button onClick={backChallenges} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-lg font-medium transition duration-500 cursor-pointer active:scale-95">Retour</button>
                    </div>
                    {!guesstheplace?.hint && (
                        <p className="w-full mt-4 px-4 py-2 rounded-lg bg-[#2a2a3d] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-3"><span className="text-yellow-300"><IoWarningSharp /></span>Aucun indice pour ce challenge !</p>
                    )}
                    {displayHint && (
                        <p className="w-full mt-4 px-4 py-2 rounded-lg bg-[#2a2a3d] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"><span className="text-yellow-300">Indice</span> : {guesstheplace?.hint}</p>
                    )}
                </div>
            </div>
            {displayImage && (
                <div onClick={() => setDisplayImage(false)} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
                    <div onClick={(e) => e.stopPropagation()} className="relative">
                        <img src={guesstheplace?.image} alt="Image de départ" className="w-[80vw] max-w-4xl h-auto rounded-lg" />
                        <button onClick={() => setDisplayImage(false)} className="absolute -top-4 -right-4 bg-white text-black rounded-full p-2 shadow-lg hover:scale-110 transition duration-500 cursor-pointer hover:text-red-600"><CiCircleRemove size={30} /></button>
                    </div>
                </div>
            )}
        </div >
    )
}