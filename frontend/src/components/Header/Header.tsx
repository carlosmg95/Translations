import React from 'react';
import './Header.css';
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
        <a href="../../" className="main-header__title">
          {props.title}
        </a>
      </div>

      <nav className="main-nav">
        <ul className="main-nav__items">
          <li className="main-nav__item">
            <a href="/dashboard">Dashboard</a>
          </li>
          <li className="main-nav__item">
            <a href="">{props.user.name}</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default header;
