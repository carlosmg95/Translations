import React from 'react';
import { Link } from 'react-router-dom';
import './MainHeader.css';
import { User } from '../../types';
import Logo from '../../images/favicon-bitbloq.svg';

interface HeaderProps {
  title: string;
  user: User;
}

const header: React.FC<HeaderProps> = (props: HeaderProps) => {
  return (
    <header className="main-header">
      <div className="logo">
        <img src={Logo} alt="logo" />
        <Link to="/" className="main-header__title">
          {props.title}
        </Link>
      </div>

      <nav className="main-nav">
        <ul className="main-nav__items">
          <li className="main-nav__item">
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className="main-nav__item">
            <Link to={props.user.admin ? '/admin' : ''}>{props.user.name}</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default header;
