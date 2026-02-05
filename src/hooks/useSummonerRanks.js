import {api} from "@/lib/api";

export async function getSummonerEntries(puuid, region) {
    if (!puuid || !region) {
        throw new Error("puuid and region are required");
    }

    try {
        const res = await api.get("summoners/ranked", {
            params: {puuid, region},
        });

        return res.data;
    } catch (err) {
        throw new Error(
            err.response?.data?.detail ||
            err.response?.data?.status?.message ||
            err.message ||
            "Unknown error"
        );
    }
}
