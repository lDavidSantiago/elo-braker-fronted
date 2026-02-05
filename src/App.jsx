import React from "react";
import {Routes, Route} from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Hero from "./components/Hero";
import SummonerPage from "./pages/SummonersPage.jsx";
import Playground from "./pages/Playground";

export default function App() {
    return (
        <Routes>
            <Route element={<RootLayout/>}>
                <Route path="/" element={<Hero/>}/>
                <Route path="/summoner/:region/:gameName/:tagLine" element={<SummonerPage/>}/>
                <Route path="/playground" element={<Playground/>}/>
            </Route>
        </Routes>
    );
}