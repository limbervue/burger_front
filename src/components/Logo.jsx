import React from 'react'
import { Link } from 'react-router-dom'

function Logo() {
    return (
        <header className="logo-content" style={{ userSelect: 'none' }}>
            <Link to="/">
                <img src="/logo_taco.png" alt="" />
            </Link>
        </header>
    )
}

export default Logo
