import React from 'react';
import './ProjectsOptions.css';
import ProjectOptionsItem from './ProjectOptionsItem/ProjectOptionsItem';
import { User, Project, Language } from '../../types';

interface ProjectsOptionsProps {
  users: User[];
  projects: Project[];
  languages: Language[];
}

const projectsOptions: React.FC<ProjectsOptionsProps> = (
  props: ProjectsOptionsProps,
) => {
  return (
    <div className="ProjectsOptions">
      <ProjectOptionsItem header={true} />
      {props.projects.map((project: Project) => (
        <ProjectOptionsItem
          key={project.id}
          project={project}
          languages={props.languages}
          users={props.users}
        />
      ))}
    </div>
  );
};

export default projectsOptions;
