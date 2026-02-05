import React from "react";
import {navLiks} from "../constants/index.js";

const Navbar = () => {
    return (
        <header>
            <nav>
                <ul>
                    {navLiks.map(({label}) => (
                        <li key={label}>
                            <a href={label}>{label}</a>
                        </li>
                    ))}
                </ul>
                <div className="flex-center gap-3">
                    <button>
                        <img src={"/search.svg"} alt="Search"/>
                    </button>
                    <button>
                        <img src={"/cart.svg"} alt="Search"/>
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
