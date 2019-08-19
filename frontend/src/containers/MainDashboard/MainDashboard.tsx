import React from 'react';
import './MainDashboard.css';
import ProjectItem from '../../components/ProjectItem/ProjectItem';
import { User, Project } from '../../types';

interface DashboardProps {
  user: User;
  projects: Project[];
}

const dashboard: React.FC<DashboardProps> = (props: DashboardProps) => {
  return (
    <div className="MainDashboard">
      <h1>Dashboard</h1>
      <div className="projects-list">
        {props.projects.map(project => (
          <ProjectItem
            key={project.id}
            project={project}
            new={false}
            user={props.user}
          />
        ))}
        {props.user.admin ? <ProjectItem key={0} new={true} user={null} /> : ''}
      </div>
    </div>
  );
};

export default dashboard;
