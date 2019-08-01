import React from 'react';
import './Dashboard.css';
import DashboardBody from './Body/Body';
import DashboardHeader from './Header/Header';

interface DashboardProps {
  children: JSX.Element | JSX.Element[] | string;
}

const dashboard: React.FC<DashboardProps> = (props: DashboardProps) => {
  return <div className="Dashboard">{props.children}</div>;
};

export default dashboard;
export { DashboardBody, DashboardHeader };
