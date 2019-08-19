import React from 'react';
import './ProjectsOptions.css';
import ProjectOptionsItem from './ProjectOptionsItem/ProjectOptionsItem';
import { User, Project, Language } from '../../types';
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
  const ADD_NEW_USER = gql`
    mutation AddUserToProject(
      $project: ProjectWhereUniqueInput!
      $user: UserWhereUniqueInput!
    ) {
      addUserToProject(project: $project, user: $user) {
        id
        name
        languages {
          id
          name
          iso
          code
        }
        literals {
          id
        }
        users {
          id
          name
        }
        translations {
          id
        }
      }
    }
  `;

  const ADD_NEW_LANGUAGE = gql`
    mutation AddLanguageToProject(
      $project: ProjectWhereUniqueInput!
      $language: LanguageWhereUniqueInput!
    ) {
      addLanguageToProject(project: $project, language: $language) {
        id
        name
        languages {
          id
          name
          iso
          code
        }
        literals {
          id
        }
        users {
          id
          name
        }
        translations {
          id
        }
      }
    }
  `;

  const REMOVE_USER = gql`
    mutation RemoveUserFromProject(
      $project: ProjectWhereUniqueInput!
      $user: UserWhereUniqueInput!
    ) {
      removeUserFromProject(project: $project, user: $user) {
        id
        name
        languages {
          id
          name
          iso
          code
        }
        literals {
          id
        }
        users {
          id
          name
        }
        translations {
          id
        }
      }
    }
  `;

  const [addUserToProject] = useMutation(ADD_NEW_USER);
  const [addLanguageToProject] = useMutation(ADD_NEW_LANGUAGE);
  const [removeUserFromProject] = useMutation(REMOVE_USER);

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
        />
      ))}
    </div>
  );
};

export default ProjectsOptions;
