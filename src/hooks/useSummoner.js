import {useCallback, useEffect, useState} from "react";

export function useSummoner(gameName, tagLine, region) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const API = import.meta.env.VITE_API_BASE;

    const fetchSummoner = useCallback(async () => {
        if (!gameName || !tagLine || !region) return;

        setLoading(true);
        setErr("");

        try {
            const params = new URLSearchParams({gameName, tagLine, region});


            const res = await fetch(
                `${API}/summoners/?${params.toString()}`,
                {method: "POST"}
            );

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(text || `HTTP ${res.status}`);
            }

            const json = await res.json();
            setData(json);
        } catch (e) {
            setErr(e?.message || "Unknown error");
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [gameName, tagLine, region]);

    useEffect(() => {
        fetchSummoner();
    }, [fetchSummoner]);

    return {data, loading, err, refresh: fetchSummoner};
}