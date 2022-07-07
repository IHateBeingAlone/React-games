import React from "react";
import { Link } from 'react-router-dom'

export function Header () {
    return (
        <header className="header">
            <Link className="header-link" to="/">Главная</Link>
            <Link className="header-link" to="/sapper">Сапёр</Link>
            <Link className="header-link" to="/twentyfortyeight">2048</Link>
            <Link className="header-link" to="/matchthree">Три в ряд</Link>
        </header>
    )
}