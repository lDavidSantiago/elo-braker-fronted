export const navLiks = [
    {label: "Summoners"},
    {label: "Champions"},
    {label: "Matches"},
    {label: "Meta"},
    {label: "Pro"},
]
export const PLATFORM_TO_ROUTING = {
    // AMERICAS
    la1: "americas", // LAN
    la2: "americas", // LAS
    na1: "americas", // North America
    br1: "americas", // Brazil
    oc1: "americas", // Oceania

    // EUROPE
    euw1: "europe", // EU West
    eun1: "europe", // EU Nordic & East
    tr1: "europe", // Turkey
    ru: "europe",   // Russia

    // ASIA
    kr: "asia",     // Korea
    jp1: "asia",    // Japan
};

export function platformToRouting(platformId) {
    return PLATFORM_TO_ROUTING[platformId?.toLowerCase()] ?? null;
}

export function rankIconSrc(tier) {
    const t = (tier || "UNRANKED").toLowerCase();

    const map = {
        iron: "Iron",
        bronze: "Bronze",
        silver: "Silver",
        gold: "Gold",
        platinum: "Platinum",
        emerald: "Emerald",
        diamond: "Diamond",
        master: "Master",
        grandmaster: "Grandmaster",
        challenger: "Challenger",
        unranked: "Iron", // pick whatever you want as fallback
    };

    const fileTier = map[t] ?? "Iron";
    return `/Ranked Emblems Latest/Rank=${fileTier}.png`;
}
