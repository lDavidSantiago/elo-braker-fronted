import {useEffect, useState} from "react";

export function useDdragonChampions(version) {
    const [byKey, setByKey] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!version) return;

        let alive = true;

        async function run() {
            try {
                setLoading(true);
                const res = await fetch(
                    `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`
                );
                const json = await res.json();

                const map = {};
                Object.values(json.data).forEach((c) => {
                    map[c.key] = c.id;
                });

                if (alive) setByKey(map);
            } finally {
                if (alive) setLoading(false);
            }
        }

        run();
        return () => {
            alive = false;
        };
    }, [version]);

    return {byKey, loading};
}

export function championIconUrl(champName, version) {
    if (!champName || !version) return null;
    return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champName}.png`;
}

export function itemIconUrl(itemId, version) {
    if (!itemId || itemId === 0 || !version) return null;
    return `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png`;
}

export async function itemsUrl(version, locale = "es_ES") {
    if (!version) return null;
    const map = {
        "es-ES": "es_ES",
        "es-CO": "es_ES",
        "es-MX": "es_MX",
        "en-US": "en_US",
        "en-GB": "en_GB",
    };

    const res = await fetch(
        `https://ddragon.leagueoflegends.com/cdn/${version}/data/${map[locale]}/item.json`
    );
    const json = await res.json();
    return json.data;
}