import { Link, Outlet } from 'react-router-dom';
import { useState } from 'react';

export const NavMobile = ({ links }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ userSelect: 'none' }}>
      <button
        className={`hamburger-btn btn ${
          isOpen ? 'hamburger-btn--close' : 'hamburger-btn--open'
        }`}
        onClick={toggleMenu}
      >
        {isOpen ? 'X' : '☰'}
      </button>
      <ul className={`navMobile ${isOpen ? 'navMobile--open' : ''}`}>
        {links.map((link, index) => (
          <li key={index} className="navMobile__item">
            <Link
              className={'navMobile-link'}
              to={link.to}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <Outlet />
    </div>
  );
};
