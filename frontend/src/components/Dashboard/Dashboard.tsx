import React from 'react';
import './Dashboard.css';
import ProjectItem from './ProjectItem/ProjectItem';
import { Project } from '../../types';

interface DashboardProps {
  projects: Project[];
}

const dashboard: React.FC<DashboardProps> = (props: DashboardProps) => {
  return (
    <div className="dashboard">
      <h1>Projects</h1>
      <div className="projects-list">
        {props.projects.map(project => (
          <ProjectItem key={project.id} project={project} new={false} />
        ))}
        <ProjectItem key={0} new={true} />
      </div>
    </div>
  );
};

export default dashboard;
