import { Link, Outlet } from 'react-router-dom';

export const Nav = ({ links }) => {
  return (
    <div style={{ userSelect: 'none' }}>
      <ul className="nav">
        {links.map((link, index) => (
          <li key={index} className="nav__item">
            <Link className={'nav-link'} to={link.to}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <Outlet />
    </div>
  );
};
