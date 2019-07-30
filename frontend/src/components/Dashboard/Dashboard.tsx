import React from 'react';
import './Dashboard.css';
import ProjectItem from './ProjectItem/ProjectItem';
import { Project } from '../../types';

interface DashboardProps {
  projects: Project[];
  selectProject(id: string): void;
}

const dashboard: React.FC<DashboardProps> = (props: DashboardProps) => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="projects-list">
        {props.projects.map(project => (
          <ProjectItem
            key={project.id}
            project={project}
            new={false}
            choose={props.selectProject}
          />
        ))}
        <ProjectItem key={0} new={true} choose={props.selectProject} />
      </div>
    </div>
  );
};

export default dashboard;
