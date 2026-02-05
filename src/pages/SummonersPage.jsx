import React, {useMemo, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {useSummoner} from "../hooks/useSummoner";
import {useRecentMatches} from "../hooks/useRecentMatches";
import {useDdragonChampions, championIconUrl, itemIconUrl, itemsUrl} from "../hooks/useDdragon";
import {getSummonerEntries} from "../hooks/useSummonerRanks.js"
import timeago from 'epoch-timeago';
import {rankIconSrc} from "/src/constants/index.js"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card"

export default function SummonerPage() {
    const {region, gameName, tagLine} = useParams();
    const [itemsData, setItemsData] = useState(null);
    const locale = navigator.language
    const {data, loading, err, refresh} = useSummoner(
        gameName,
        tagLine,
        "americas"
    );
    const {
        matches,
        loading: matchesLoading,
        err: matchesErr,
        refresh: refreshMatches,
    } = useRecentMatches(data?.puuid, {take: 25, concurrency: 3});
    const ddVersion = useMemo(() => {
        const gv = matches?.[0]?.match?.gameVersion; //
        if (!gv) return "16.2.1"; // fallback por si aún no llegan matches
        const [major, minor] = gv.split(".");
        return `${major}.${minor}.1`; // "16.1.1"
    }, [matches]);
    const {byKey: champByKey} = useDdragonChampions(ddVersion);
    useEffect(() => {
        if (!ddVersion) return;

        itemsUrl(ddVersion, locale).then(data => {
            setItemsData(data);

        });
    }, [ddVersion, locale]);

    const [rankData, setRankData] = useState(null);

    useEffect(() => {
        if (!data?.puuid || !data?.region) return;

        getSummonerEntries(data.puuid, data.region)
            .then(res => {
                console.log(res);
                setRankData(res)

            })
            .catch(console.error);
    }, [data?.puuid, data?.region]);
    const soloQ = rankData?.find(
        r => r.queueType === "RANKED_SOLO_5x5"
    );

    const flexQ = rankData?.find(
        r => r.queueType === "RANKED_FLEX_SR"
    );
    return (
        <div className="w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
                <div className="flex items-center justify-between">
                    <Link to="/" className="text-white/60 hover:text-white">
                        ← Back
                    </Link>

                    <button
                        onClick={() => {
                            refresh();
                            refreshMatches();

                        }}
                        disabled={loading || matchesLoading}
                        className="rounded-md bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-2 text-sm disabled:opacity-50"
                    >
                        {loading || matchesLoading ? "Refreshing..." : "Refresh"}
                    </button>
                </div>

                {/* Header card */}
                <div
                    className="mt-6 rounded-2xl border border-white/10 bg-linear-to-tr from-zinc-900 to-white/10 backdrop-blur-md overflow-hidden">
                    <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                        {/* icon */}
                        <div className="flex items-start gap-4">
                            <div
                                className="h-20 w-20 rounded-2xl bg-white/10 border border-white/10 grid place-items-center text-white/60 overflow-hidden">
                                {data?.profileIcon ? (
                                    <img
                                        src={`https://ddragon.leagueoflegends.com/cdn/${ddVersion}/img/profileicon/${data.profileIcon}.png`}
                                        alt="Profile Icon"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    "ICON"
                                )}
                            </div>

                            {/* mobile header */}
                            <div className="sm:hidden">
                                <div className="text-xs text-white/40">{data?.region ?? region ?? "—"}</div>
                                <div className="text-xl font-semibold text-white">
                                    {data?.gameName ?? gameName ?? "—"}{" "}
                                    <span className="text-white/50">#{data?.tagLine ?? tagLine ?? "—"}</span>
                                </div>
                                <div className="mt-1 text-sm text-white/50">
                                    Level {data?.summonerLevel ?? "—"}
                                </div>
                                <div className="mt-1 text-xs text-white/40">
                                    Last updated: {data?.lastUpdated ?? "—"}
                                </div>
                            </div>
                        </div>

                        {/* desktop header */}
                        <div className="hidden sm:block flex-1">
                            <div className="text-xs text-white/40">{data?.region ?? region ?? "—"}</div>

                            <div className="mt-1 text-2xl sm:text-3xl font-semibold text-white">
                                {data?.gameName ?? gameName ?? "—"}{" "}
                                <span className="text-white/50">#{data?.tagLine ?? tagLine ?? "—"}</span>
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60">
                  Level {data?.summonerLevel ?? "—"}
                </span>
                                <span
                                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60">
                  Last updated: {data?.lastUpdated ?? "—"}
                </span>
                            </div>
                        </div>

                        {/* quick rank card */}
                        <div className="sm:w-[320px] rounded-xl border border-white/10 bg-black/30 p-4">
                            <div className="text-xs text-white/50">Rank</div>
                            <div className="mt-2 flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-semibold text-white">Solo Queue</div>
                                    <div className="text-lg font-semibold text-white">{soloQ?.tier} </div>

                                    <div className="text-sm text-white/60">{soloQ?.leaguePoints} LP</div>
                                </div>
                                <div
                                    className="h-10 w-10 rounded-lg bg-white/10 border border-white/10 grid place-items-center text-white/60">
                                    <img
                                        src={rankIconSrc(soloQ?.tier)}
                                        alt={soloQ?.tier ?? "UNRANKED"}
                                        className="h-8 w-8"
                                    />
                                </div>
                            </div>
                            <div className="mt-3 text-sm text-white/60 pb-1.5">
                                W/L: <span className="text-white">{soloQ?.wins}</span> / <span
                                className="text-white">{soloQ?.losses}</span>
                            </div>
                            <div className=" h-1.5 w-full rounded bg-white/10 overflow-hidden">
                                <div
                                    className="h-full bg-emerald-400 transition-all"
                                    style={{width: `${soloQ?.leaguePoints ?? 0}%`}} //League points goes from 0 to 100 so this creates a progress bar for user
                                />
                            </div>
                        </div>
                        <div className="sm:w-[320px] rounded-xl border border-white/10 bg-black/30 p-4">
                            <div className="text-xs text-white/50">Rank</div>
                            <div className="mt-2 flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-semibold text-white">Flex Queue</div>
                                    <div className="text-lg font-semibold text-white">{flexQ?.tier} </div>

                                    <div className="text-sm text-white/60">{flexQ?.leaguePoints} LP</div>
                                </div>
                                <div
                                    className="h-10 w-10 rounded-lg bg-white/10 border border-white/10 grid place-items-center text-white/60">
                                    <img
                                        src={rankIconSrc(flexQ?.tier)}
                                        alt={flexQ?.tier ?? "UNRANKED"}
                                        className="h-8 w-8"
                                    />
                                </div>
                            </div>
                            <div className="mt-3 text-sm text-white/60 pb-1.5">
                                W/L: <span className="text-white">{flexQ?.wins}</span> / <span
                                className="text-white">{flexQ?.losses}</span>
                            </div>
                            <div className=" h-1.5 w-full rounded bg-white/10 overflow-hidden">
                                <div
                                    className="h-full bg-emerald-400 transition-all"
                                    style={{width: `${flexQ?.leaguePoints ?? 0}%`}} //League points goes from 0 to 100 so this creates a progress bar for user
                                />
                            </div>
                        </div>
                    </div>


                </div>

                {/* Body grid */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <aside className="lg:col-span-4 space-y-6">
                        <Card className="border-white/10 bg-linear-to-tr from-zinc-800 to-white/10 text-white">
                            <CardHeader>
                                <CardTitle>Ranked Overview</CardTitle>
                                <CardDescription>SoloQ Ranked Only</CardDescription>
                            </CardHeader>

                            <CardContent className="grid grid-cols-2 gap-4">
                                <Stat label="Winrate" value="54.76%"/>
                                <Stat label="Games" value="126"/>
                            </CardContent>
                        </Card>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <div className="text-sm font-semibold text-white">Top Champions This is a place holder at
                                the time
                            </div>
                            <div className="mt-4 space-y-3">
                                <ChampionRow name="—" sub="— games · —% WR"/>
                                <ChampionRow name="—" sub="— games · —% WR"/>
                                <ChampionRow name="—" sub="— games · —% WR"/>
                            </div>
                        </div>


                    </aside>

                    <section className="lg:col-span-8">
                        <div
                            className="rounded-2xl border border-white/10 bg-linear-to-tr from-zinc-900 to-white/10 p-5">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                    <p className="text-xs text-white/40">
                                        puuid: {data?.puuid ? "OK" : "no"} | matches: {matches.length} | loading:{" "}
                                        {String(matchesLoading)} | err: {matchesErr || "none"}
                                    </p>
                                    <div className="text-sm font-semibold text-white">Recent Matches</div>
                                    <div className="text-sm text-white/60">
                                        Last Matches.
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <select
                                        className="h-10 rounded-md bg-black/30 border border-white/10 px-3 text-sm text-white/70">
                                        <option>Ranked Solo</option>
                                        <option>Flex</option>
                                        <option>Normal</option>
                                    </select>

                                    <input
                                        placeholder="Search champion"
                                        className="h-10 w-full sm:w-56 rounded-md bg-black/30 border border-white/10 px-3 text-sm text-white placeholder:text-white/40 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="mt-5 space-y-3">
                                {matches.map((m) => {
                                    //Search player in json
                                    const me = m.players.find((p) => p.puuid === data?.puuid);
                                    if (!me) return null;

                                    const win = me.win;
                                    const result = win ? "Win" : "Lose";
                                    const kda = `${me.kills} / ${me.deaths} / ${me.assists}`;
                                    const cs =
                                        (me.total_minions_killed ?? 0) +
                                        (me.neutral_minions_killed ?? 0);

                                    const duration = formatDuration(m.match.gameDuration);
                                    const queue = queueLabel(m.match.queueId);
                                    const gameStartDate = m.match?.gameStartTimestamp
                                        ? timeago(m.match.gameStartTimestamp)
                                        : "—"

                                    const champId = me.champion_id ?? me.championId;
                                    const champName = champByKey?.[String(champId)];
                                    const champIcon = championIconUrl(champName, ddVersion);

                                    // intenta detectar items en distintos formatos
                                    const items =
                                        me.items ??
                                        [me.item0, me.item1, me.item2, me.item3, me.item4, me.item5, me.item6].filter(
                                            (x) => x !== undefined
                                        );

                                    return (
                                        <MatchRow
                                            key={m.match.matchId}
                                            timeago={gameStartDate}
                                            result={result}
                                            queue={queue}
                                            kda={kda}
                                            cs={cs}
                                            duration={duration}
                                            champName={champName}
                                            champIcon={champIcon}
                                            items={items}
                                            itemsData={itemsData}
                                            version={ddVersion}
                                        />
                                    );
                                })}

                                {matchesLoading && (
                                    <p className="text-white/60">Loading matches…</p>
                                )}

                                {matchesErr && (
                                    <p className="text-red-400">Error loading matches: {matchesErr}</p>
                                )}
                            </div>
                        </div>

                        {/* Loading / Error / Debug */}
                        {loading && <p className="mt-6 text-white/60">Loading summoner…</p>}
                        {err && <p className="mt-6 text-red-400">Error: {err}</p>}

                        {data && (
                            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                                <div className="text-sm font-semibold text-white">Raw JSON (temporal)</div>
                                <pre className="mt-3 text-xs text-white/70 overflow-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}

function Stat({label, value}) {
    return (
        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <div className="text-xs text-white/50">{label}</div>
            <div className="mt-1 text-lg font-semibold text-white">{value}</div>
        </div>
    );
}

function ChampionRow({name, sub}) {
    return (
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/10"/>
            <div className="flex-1">
                <div className="text-sm text-white">{name}</div>
                <div className="text-xs text-white/50">{sub}</div>

            </div>
            <button className="text-xs text-white/60 hover:text-white">View</button>
        </div>
    );
}

function MatchRow({
                      timeago,
                      result,
                      queue,
                      kda,
                      cs,
                      duration,
                      champName,
                      champIcon,
                      items = [],
                      version,
                      itemsData = {}
                  }) {
    const win = result.toLowerCase() === "win";

    return (
        <div
            className={`relative rounded-xl border border-white/10 p-4 flex flex-col sm:flex-row sm:items-center gap-3 ${
                win ? "bg-emerald-500/10" : "bg-rose-500/10"
            }`}
        >
            {timeago && (
                <div className="absolute top-2 right-2 text-xs text-white/60">
                    {timeago}
                </div>
            )}
            {/* Left: champ + result */}
            <div className="flex items-center gap-3 min-w-[220px]">
                <div
                    className="h-12 w-12 rounded-xl overflow-hidden  border-white/10 bg-white/5 grid place-items-center">
                    {champIcon ? (
                        <img src={champIcon} alt={champName || "Champion"}
                             className="h-full w-full object-cover scale-125 "/>
                    ) : (
                        <span className="text-xs text-white/50">?</span>
                    )}
                </div>

                <div className="flex flex-col">
                    <div className={`text-xs font-semibold ${win ? "text-emerald-300" : "text-rose-300"}`}>
                        {result}
                    </div>
                    <div className="text-sm text-white/80">{queue}</div>
                    <div className="text-xs text-white/50">{champName || (champIcon ? "—" : "No champ data")}</div>
                </div>
            </div>

            {/* Middle: items */}
            <div className="flex items-center gap-1 flex-wrap">
                {items.length > 0 ? (
                    items.slice(0, 7).map((id, idx) => {
                        const url = itemIconUrl(id, version);
                        const tooltipId = `tooltip-${id}-${idx}`;
                        const itemName = itemsData?.[id]?.name ?? `Item ${id}`;

                        return (
                            <div key={tooltipId} className="relative group">
                                <div
                                    className="h-8 w-8 rounded-md overflow-hidden border border-white/10 bg-white/5 grid place-items-center"
                                >
                                    {url ? (
                                        <img
                                            src={url}
                                            alt={itemName}
                                            className="h-full w-full object-cover"
                                            aria-describedby={tooltipId}
                                        />
                                    ) : (
                                        <span className="text-[10px] text-white/40">—</span>
                                    )}
                                </div>

                                {/* Tooltip */}
                                {url && (
                                    <div
                                        id={tooltipId}
                                        role="tooltip"
                                        className="
                                        absolute z-10
                                        -top-10 left-1/2 -translate-x-1/2
                                        invisible opacity-0
                                        inline-block px-3 py-2 text-xs font-medium text-white
                                        transition-opacity duration-300
                                        bg-black/90 rounded-md shadow
                                        group-hover:visible group-hover:opacity-100
                                        whitespace-nowrap
                                        pointer-events-none
                                        "
                                    >
                                        {itemName}

                                        {/* Arrow */}
                                        <div
                                            className="
                                            absolute left-1/2 top-full -translate-x-1/2
                                            w-2 h-2 bg-black/90 rotate-45
                                           "
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <span className="text-xs text-white/50">No items in payload</span>
                )}
            </div>


            {/* Right: stats */}
            <div className="sm:ml-auto flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/70">
        <span>
          KDA: <span className="text-white">{kda}</span>
        </span>
                <span>
          CS: <span className="text-white">{cs}</span>
        </span>
                <span>
          Time: <span className="text-white">{duration}</span>
        </span>
            </div>
        </div>
    );
}

function formatDuration(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
}

function queueLabel(queueId) {
    switch (queueId) {
        case 420:
            return "Ranked Solo";
        case 900:
            return "ARURF"
        case 440:
            return "Flex";
        case 400:
            return "Normal Draft";
        case 450:
            return "ARAM";
        case 700:
            return "Clash";
        default:
            return `Queue ${queueId}`;
    }
}