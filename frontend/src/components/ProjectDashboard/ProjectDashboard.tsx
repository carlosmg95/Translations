import React from 'react';
import './ProjectDashboard.css';
import ProjectLanguageRow from './ProjectLanguageRow/ProjectLanguageRow';
import { Project, Language } from '../../types';

interface ProjectDashboardProps {
  project: Project;
}

const projectDashboard: React.FC<ProjectDashboardProps> = (
  props: ProjectDashboardProps,
) => {
  return (
    <div className="projectDashboard">
      <h1>
        <small
          className="breadcrumb"
          onClick={() => {
            window.location.href = '/dashboard';
          }}
        >
          dashboard/
        </small>
        {props.project.name}
      </h1>
      <div className="languages-list">
        {props.project.languages.map((language: Language) => (
          <ProjectLanguageRow key={language.id} language={language} />
        ))}
      </div>
    </div>
  );
};

export default projectDashboard;
