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
          {props.user ? (
            <>
              <li className="main-nav__item">
                <Link to="/dashboard">Dashboard</Link>
              </li>
              {props.user.admin ? (
                <li className="main-nav__item">
                  <Link to="/admin">Admin panel</Link>
                </li>
              ) : (
                ''
              )}
              <li className="main-nav__item">
                <p>{props.user.name}</p>
              </li>
              <li
                className="main-nav__item"
                onClick={() => {
                  window.localStorage.removeItem('authToken');
                  window.location.reload();
                }}
              >
                <Link to="">Logout</Link>
              </li>
            </>
          ) : (
            <>
              <li className="main-nav__item">
                <Link to="signup">Create new user</Link>
              </li>
              <li className="main-nav__item">
                <Link to="login">Login</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default header;
