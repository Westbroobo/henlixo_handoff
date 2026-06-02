import { Menu, MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Catalog', to: '/catalog' },
  { label: 'Cases', to: '/cases' },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <Link className="brand-link" to="/" aria-label="Henlixo home">
        <span className="brand-mark">H</span>
        <span>
          <strong>Henlixo</strong>
          <small>Outdoor Structures</small>
        </span>
      </Link>

      <button
        className="icon-button mobile-toggle"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Toggle navigation"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <nav className={open ? 'site-nav open' : 'site-nav'} aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            {item.label}
          </NavLink>
        ))}
        <a
          className="header-whatsapp"
          href="https://api.whatsapp.com/send?phone=8615925638060&text=Hello,%20I%20am%20interested%20in%20Henlixo%20outdoor%20structures"
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={16} />
          WhatsApp
        </a>
      </nav>
    </header>
  );
}
