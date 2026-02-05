import React from "react";
import {Outlet} from "react-router-dom";
import Navbar from "../components/Navbar";

export default function RootLayout() {
    return (
        <main className="min-h-screen bg-neutral-950 text-white">
            <Navbar/>
            <Outlet/>
        </main>
    );
}