"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useApi } from "@/hooks/useApi";

import { ctf, geoint } from "@/lib/types";

import CtfBuilder from "@/components/Builders/CtfBuilder";
import GeointBuilder from "@/components/Builders/GeointBuilder";

import HomeTabs from "@/components/challenges/home/HomeTabs";
import CreateButtons from "@/components/challenges/home/CreateButtons";
import { useNavData } from "@/stores/store"
import ChallengeGroups from "@/components/challenges/home/ChallengeGroups";
import Link from "next/link";
import { Permissions } from "@/lib/config";

export default function Home() {
    const { call } = useApi();
    const router = useRouter();

    const { isGuest, role, permissions } = useNavData()

    const [tab, setTab] = useState<0 | 1>(0);
    const [ctf, setCtf] = useState<ctf[]>([]);
    const [geoint, setGeoint] = useState<geoint[]>([]);
    const [openCtf, setOpenCtf] = useState(false);
    const [openGeo, setOpenGeo] = useState(false);
    const [currentDifficulty, setCurrentDifficulty] = useState("")

    useEffect(() => {
        (async () => {
            const data = await call(`/api/challenges?type=${tab === 0 ? "ctf" : "geoint"}`);
            tab === 0 ? setCtf(data || []) : setGeoint(data || []);
        })();
    }, [tab]);

    const open = (type: string, id: number) => router.push(`/challenges/${type}/${id}`);

    const groupedCtf = useMemo(() => {
        const f = (l: string) => ctf.filter(e => e.difficulty === l);
        return {
            Facile: f("Easy"),
            Intermédiaire: f("Intermediate"),
            Avancé: f("Advance"),
            Expert: f("Expert"),
        };
    }, [ctf]);

    const groupedGeoint = useMemo(() => {
        const f = (l: string) => geoint.filter(e => e.difficulty === l);
        return {
            Facile: f("Easy"),
            Intermédiaire: f("Intermediate"),
            Avancé: f("Advance"),
            Expert: f("Expert"),
        };
    }, [geoint]);

    return (
        <div>
            <div className="sm:hidden fixed inset-0 bg-black z-50 flex items-center justify-center">
                <h2 className="text-white text-xl text-center">
                    The mobile version is coming soon.
                </h2>
            </div>

            <div className="hidden lg:block"></div>

            <div className="text-white">

                <HomeTabs tab={tab} setTab={setTab} />

                {tab === 0 && (
                    <div className="px-6 space-y-10">
                        {permissions && Array.isArray(permissions) && (permissions.includes(Permissions.advanced.administrator) || permissions.includes(Permissions.contributor.canCreate.ctf)) && <CreateButtons type="ctf" role={role} onCtfOpen={() => setOpenCtf(true)} />}
                        <ChallengeGroups data={groupedCtf} currentDifficulty={currentDifficulty} open={open} type="ctf" />
                    </div>
                )}

                {tab === 1 && (
                    <div className="px-6 space-y-10">
                        {permissions && Array.isArray(permissions) && (permissions.includes(Permissions.advanced.administrator) || permissions.includes(Permissions.contributor.canCreate.geoint)) && <CreateButtons type="geoint" role={role} onGeoOpen={() => setOpenGeo(true)} />}
                        {isGuest ? (
                            <div className="relative mt-10">
                                <div className="blur-xs scale-[1.01] pointer-events-none select-none opacity-80">
                                    <ChallengeGroups data={groupedGeoint} open={open} type="geoint" />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-[#1e1e2f]/90 border border-white/10  p-8 text-center shadow-2xl backdrop-blur-md max-w-md w-full">
                                        <div className="text-4xl mb-3">🔒</div>
                                        <h2 className="text-white text-xl font-bold mb-2">GEOINT verrouillé</h2>
                                        <p className="text-white/60 text-sm mb-6">Connectez-vous pour accéder aux missions et suivre votre progression.</p>
                                        <Link href="/accounts/login" className="inline-flex items-center justify-center px-5 py-2 bg-orange-500 hover:bg-orange-600 transition duration-500 cursor-pointer text-white font-semibold">Se connecter</Link>
                                        <p className="text-white/30 text-xs mt-4"> Aperçu disponible — accès complet après connexion</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <ChallengeGroups data={groupedGeoint} open={open} type="geoint" />
                        )}
                    </div>
                )}
                {openCtf && permissions && Array.isArray(permissions) && ( permissions.includes(Permissions.advanced.administrator) || permissions.includes(Permissions.contributor.canCreate.ctf) ) && <CtfBuilder onClose={() => setOpenCtf(false)} />}
                {openGeo && permissions && Array.isArray(permissions) && ( permissions.includes(Permissions.advanced.administrator) || permissions.includes(Permissions.contributor.canCreate.geoint) ) && <GeointBuilder onClose={() => setOpenGeo(false)} />}
            </div>
        </div>
    );
}