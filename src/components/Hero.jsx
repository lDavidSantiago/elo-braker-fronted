import React, {useEffect, useMemo, useRef, useState} from "react";
import ParticlesComponent from "./particles.jsx";
import {useNavigate} from "react-router-dom";


const regions = [
    {id: "LAN", label: "LAN"},
    {id: "LAS", label: "LAS"},
    {id: "NA", label: "NA"},
    {id: "EUW", label: "EUW"},
    {id: "EUNE", label: "EUNE"},
    {id: "BR", label: "BR"},
    {id: "KR", label: "KR"},
    {id: "JP", label: "JP"},
    {id: "OCE", label: "OCE"},
];

export default function Hero() {
    const [gameName, setGameName] = useState("");
    const [tagLine, setTagLine] = useState("");
    const navigate = useNavigate();
    const [region, setRegion] = useState(regions[0]);
    const [regionQuery, setRegionQuery] = useState("");
    const [isRegionOpen, setIsRegionOpen] = useState(false);

    const regionBoxRef = useRef(null);

    // cerrar al click afuera
    useEffect(() => {
        const onDown = (e) => {
            if (!regionBoxRef.current) return;
            if (!regionBoxRef.current.contains(e.target)) {
                setIsRegionOpen(false);
                setRegionQuery("");
            }
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, []);

    const filteredRegions = useMemo(() => {
        const q = regionQuery.trim().toLowerCase();
        if (!q) return regions;
        return regions.filter((r) => r.label.toLowerCase().includes(q));
    }, [regionQuery]);

    return (
        <section
            className="relative min-h-screen flex items-center justify-center pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <ParticlesComponent id="particles"/>

            {/* tus glows */}
            <div
                className="absolute top-20 left-4 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-slate-200/8 rounded-full blur-3xl animate-pulse [animation-duration:6s] pointer-events-none"/>
            <div
                className="absolute bottom-20 right-4 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-slate-300/6 rounded-full blur-3xl animate-pulse [animation-duration:6s] pointer-events-none"/>

            <div className="relative z-10 w-full max-w-3xl text-center">
                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white">
                    Elo-Breaker: Turn your games into rank gains. </h1>
                <p className="mt-4 text-base sm:text-lg text-white/60">
                    Master your progress, track your LP, and expose what’s holding you back — no noise, no excuses, just
                    climb 📈
                </p>

                <form className="mt-8 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center">
                    <input
                        value={gameName}
                        onChange={(e) => setGameName(e.target.value)}
                        placeholder="GameName (ej: OverLimits)"
                        className="h-11 w-full sm:w-64 rounded-md bg-white/5 border border-white/10 px-3 text-white placeholder:text-white/40 outline-none focus:border-white/20"
                    />

                    <input
                        value={tagLine}
                        onChange={(e) => setTagLine(e.target.value)}
                        placeholder="#TAG (ej: COL)"
                        className="h-11 w-full sm:w-40 rounded-md bg-white/5 border border-white/10 px-3 text-white placeholder:text-white/40 outline-none focus:border-white/20"
                    />

                    {/* ✅ Combobox fijo: abre/cierra correcto */}
                    <div ref={regionBoxRef} className="relative w-full sm:w-36">
                        <button
                            type="button"
                            onClick={() => setIsRegionOpen((v) => !v)}
                            className="h-11 w-full rounded-md bg-white/5 border border-white/10 px-3 pr-9 text-left text-white outline-none hover:bg-white/10"
                        >
                            {region.label}
                            <span className="absolute inset-y-0 right-3 flex items-center text-white/50">
                ▾
              </span>
                        </button>

                        {isRegionOpen && (
                            <div
                                className="absolute mt-2 w-full rounded-md border border-white/10 bg-black/80 backdrop-blur-md overflow-hidden">
                                {/* búsqueda opcional */}
                                <div className="p-2 border-b border-white/10">
                                    <input
                                        value={regionQuery}
                                        onChange={(e) => setRegionQuery(e.target.value)}
                                        placeholder="Buscar..."
                                        className="h-9 w-full rounded-md bg-white/5 border border-white/10 px-2 text-white placeholder:text-white/40 outline-none focus:border-white/20"
                                    />
                                </div>

                                <div className="max-h-56 overflow-auto">
                                    {filteredRegions.map((r) => (
                                        <button
                                            key={r.id}
                                            type="button"
                                            onClick={() => {
                                                setRegion(r);       // ✅ solo asigna el valor
                                                setIsRegionOpen(false); // ✅ cierra
                                                setRegionQuery(""); // ✅ limpia búsqueda

                                            }}
                                            className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 ${
                                                region.id === r.id ? "text-white" : "text-white/70"
                                            }`}
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        className="h-11 rounded-md px-5 bg-white text-black font-medium hover:opacity-90 cursor-pointer"
                        onClick={() => {
                            if (!gameName.trim() || !tagLine.trim()) return;


                            navigate(
                                `/summoner/${region.id}/${encodeURIComponent(gameName.trim())}/${encodeURIComponent(tagLine.trim())}`
                            );
                        }}
                    >
                        Buscar
                    </button>
                </form>
            </div>
        </section>
    );
}