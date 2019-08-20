import React from 'react';
import './ProjectsOptions.css';
import ProjectOptionsItem from './ProjectOptionsItem/ProjectOptionsItem';
import { User, Project, Language } from '../../types';
import { ProjectResponse } from '../../types-res';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

interface ProjectsOptionsProps {
  users: User[];
  projects: Project[];
  languages: Language[];
  updateProject(
    projectWhereKey: string,
    projectWhereValue: string,
    updatedProject: Project,
  ): void;
}

const ProjectsOptions: React.FC<ProjectsOptionsProps> = (
  props: ProjectsOptionsProps,
) => {
  const createMutation = (mutationName: string, item: 'language' | 'user') => {
    const upperName =
      mutationName.charAt(0).toUpperCase() + mutationName.slice(1);
    const upperItem = item.charAt(0).toUpperCase() + item.slice(1);

    const MUTATION = gql`
      mutation ${upperName}(
        $project: ProjectWhereUniqueInput!
        $${item}: ${upperItem}WhereUniqueInput!
      ) {
        ${mutationName}(project: $project, ${item}: $${item}) ${ProjectResponse}
      }
    `;

    return MUTATION;
  };

  const [addUserToProject] = useMutation(
    createMutation('addUserToProject', 'user'),
  );
  const [addLanguageToProject] = useMutation(
    createMutation('addLanguageToProject', 'language'),
  );
  const [removeUserFromProject] = useMutation(
    createMutation('removeUserFromProject', 'user'),
  );
  const [removeLanguageFromProject] = useMutation(
    createMutation('removeLanguageFromProject', 'language'),
  );

  return (
    <div className="ProjectsOptions">
      <ProjectOptionsItem header={true} />
      {props.projects.map((project: Project) => (
        <ProjectOptionsItem
          key={project.id}
          project={project}
          languages={props.languages}
          users={props.users}
          addUser={(userId: string) => {
            addUserToProject({
              variables: {
                project: {
                  name: project.name,
                },
                user: {
                  id: userId,
                },
              },
            }).then(result => {
              const project: Project = result.data.addUserToProject;
              props.updateProject('id', project.id, project);
            });
          }}
          addLanguage={(languageId: string) => {
            addLanguageToProject({
              variables: {
                project: {
                  name: project.name,
                },
                language: {
                  id: languageId,
                },
              },
            }).then(result => {
              const project: Project = result.data.addLanguageToProject;
              props.updateProject('id', project.id, project);
            });
          }}
          removeUser={(userId: string) => {
            removeUserFromProject({
              variables: {
                project: {
                  name: project.name,
                },
                user: {
                  id: userId,
                },
              },
            }).then(result => {
              const project: Project = result.data.removeUserFromProject;
              props.updateProject('id', project.id, project);
            });
          }}
          removeLanguage={(languageId: string) => {
            removeLanguageFromProject({
              variables: {
                project: {
                  name: project.name,
                },
                language: {
                  id: languageId,
                },
              },
            }).then(result => {
              const project: Project = result.data.removeLanguageFromProject;
              props.updateProject('id', project.id, project);
            });
          }}
        />
      ))}
    </div>
  );
};

export default ProjectsOptions;
