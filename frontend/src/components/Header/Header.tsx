import React from 'react';
import './Header.css';

interface HeaderProps {
  title: string
}

const header: React.FC<HeaderProps> = (props: HeaderProps) => {
    return (
        <header className="main-header">
          <div>
            <a href="../../" className="main-header__title">{props.title}</a>
          </div>

          <nav className="main-nav">
            <ul className="main-nav__items">
              <li className="main-nav__item">
                <a href="">Logout</a>
              </li>
              <li className="main-nav__item main-nav__item-push">
                <a href="">PUSH</a>
              </li>
            </ul>
          </nav>
        </header>
    );
}

export default header;