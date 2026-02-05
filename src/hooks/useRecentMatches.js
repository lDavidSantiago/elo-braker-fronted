import {useCallback, useEffect, useRef, useState} from "react";

async function mapPool(arr, limit, fn) {
    const ret = [];
    const executing = [];

    for (const item of arr) {
        const p = Promise.resolve().then(() => fn(item));
        ret.push(p);

        const e = p.finally(() => {
            const i = executing.indexOf(e);
            if (i >= 0) executing.splice(i, 1);
        });

        executing.push(e);

        if (executing.length >= limit) {
            await Promise.race(executing);
        }
    }

    return Promise.all(ret);
}

export function useRecentMatches(
    puuid,
    {take = 25, concurrency = 3, routingRegion = "AMERICAS", numMatches = 25} = {}
) {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const API = import.meta.env.VITE_API_BASE;
    // para ignorar respuestas viejas si cambias de summoner rápido
    const reqIdRef = useRef(0);

    const fetchRecent = useCallback(async () => {
        if (!puuid) return;

        const myReqId = ++reqIdRef.current;

        setLoading(true);
        setErr("");

        try {
            const idsUrl = `${API}/summoners/${encodeURIComponent(
                puuid
            )}/matches?region=${encodeURIComponent(routingRegion)}&num_matches=${encodeURIComponent(
                numMatches
            )}`;


            const idsRes = await fetch(idsUrl);
            if (!idsRes.ok) throw new Error(`IDs HTTP ${idsRes.status}`);

            const ids = await idsRes.json();
            const topIds = (Array.isArray(ids) ? ids : []).slice(0, take);

            console.log("[matches] got ids:", topIds.length, "concurrency:", concurrency);

            const details = await mapPool(topIds, concurrency, async (matchId) => {
                const matchUrl = `${API}/matches/${encodeURIComponent(
                    matchId
                )}?routingRegion=${encodeURIComponent(routingRegion)}`;


                const r = await fetch(matchUrl);
                if (!r.ok) throw new Error(`Match ${matchId} HTTP ${r.status}`);
                return r.json();
            });

            // si ya cambió el summoner o se disparó otro fetch, ignora
            if (reqIdRef.current !== myReqId) return;

            setMatches(details);
        } catch (e) {
            if (reqIdRef.current !== myReqId) return;

            setErr(e?.message || "Unknown error");
            setMatches([]);
        } finally {
            if (reqIdRef.current === myReqId) setLoading(false);
        }
    }, [puuid, take, concurrency, routingRegion, numMatches]);

    useEffect(() => {
        fetchRecent();
    }, [fetchRecent]);

    return {matches, loading, err, refresh: fetchRecent};
}