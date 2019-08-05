import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  title: string;
  links: { to: string; text: string }[];
}

const header: React.FC<HeaderProps> = (props: HeaderProps) => {
  return (
    <h1 className="HeaderDashboard__title">
      <small className="breadcrumb">
        {props.links.map((link, index) => (
          <Link key={index} to={link.to}>
            <span>{link.text}</span>/
          </Link>
        ))}
      </small>
      {props.title}
    </h1>
  );
};

export default header;
