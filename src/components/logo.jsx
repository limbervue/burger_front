import React from 'react';
import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <header className="logo-content" style={{ userSelect: 'none' }}>
      <Link to="/home">
        <img src="/logo_taco.png" alt="" />
      </Link>
    </header>
  );
}
