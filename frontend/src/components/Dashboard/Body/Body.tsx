import React from 'react';
import './Body.css';

interface BodyProps {
  children: JSX.Element | JSX.Element[] | string;
}

const body: React.FC<BodyProps> = (props: BodyProps) => {
  return <div className="items-list">{props.children}</div>;
};

export default body;
