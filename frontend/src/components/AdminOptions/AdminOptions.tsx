import React from 'react';
import './AdminOptions.css';
import ProjectOptionsItem from './ProjectOptionsItem/ProjectOptionsItem';
import UserOptionsItem from './UserOptionsItem/UserOptionsItem';
import { User, Project, Language } from '../../types';
import { ProjectResponse, UserResponse } from '../../types-res';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

interface AdminOptionsProps {
  users: User[];
  projects: Project[];
  languages: Language[];
}

const AdminOptions: React.FC<AdminOptionsProps> = (
  props: AdminOptionsProps,
) => {
  const createMutation = (
    mutationName: string,
    containerItem: 'project' | 'user',
    contentItem: 'language' | 'user',
  ) => {
    const upperName =
      mutationName.charAt(0).toUpperCase() + mutationName.slice(1);
    const upperContentItem =
      contentItem.charAt(0).toUpperCase() + contentItem.slice(1);
    const upperContainerItem =
      containerItem.charAt(0).toUpperCase() + containerItem.slice(1);

    const MUTATION = gql`
      mutation ${upperName}(
        $${containerItem}: ${upperContainerItem}WhereUniqueInput!
        $${contentItem}: ${upperContentItem}WhereUniqueInput!
      ) {
        ${mutationName}(${containerItem}: $${containerItem}, ${contentItem}: $${contentItem}) ${
      containerItem === 'project' ? ProjectResponse : UserResponse
    }
      }
    `;

    return MUTATION;
  };

  const [addUserToProject] = useMutation(
    createMutation('addUserToProject', 'project', 'user'),
  );
  const [addLanguageToProject] = useMutation(
    createMutation('addLanguageToProject', 'project', 'language'),
  );
  const [removeUserFromProject] = useMutation(
    createMutation('removeUserFromProject', 'project', 'user'),
  );
  const [removeLanguageFromProject] = useMutation(
    createMutation('removeLanguageFromProject', 'project', 'language'),
  );
  const [addLanguageToUser] = useMutation(
    createMutation('addLanguageToUser', 'user', 'language'),
  );
  const [removeLanguageFromUser] = useMutation(
    createMutation('removeLanguageFromUser', 'user', 'language'),
  );

  return (
    <div className="AdminOptions">
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
              /*const project: Project = result.data.addUserToProject;
              props.updateProject('id', project.id, project);*/
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
              /*const project: Project = result.data.addLanguageToProject;
              props.updateProject('id', project.id, project);*/
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
              /*const project: Project = result.data.removeUserFromProject;
              props.updateProject('id', project.id, project);*/
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
              /*const project: Project = result.data.removeLanguageFromProject;
              props.updateProject('id', project.id, project);*/
            });
          }}
        />
      ))}
      <UserOptionsItem header={true} />
      <UserOptionsItem header={true} />
      {props.users.map((user: User) => (
        <UserOptionsItem
          key={user.id}
          languages={props.languages}
          user={user}
          addLanguage={(languageId: string) => {
            addLanguageToUser({
              variables: {
                user: {
                  name: user.name,
                },
                language: {
                  id: languageId,
                },
              },
            }).then(result => {
              /*const user: User = result.data.addLanguageToUser;
              props.updateUserLanguages(user.languages);*/
            });
          }}
          removeLanguage={(languageId: string) => {
            removeLanguageFromUser({
              variables: {
                user: {
                  name: user.name,
                },
                language: {
                  id: languageId,
                },
              },
            }).then(result => {
              /*const user: User = result.data.removeLanguageFromUser;
              props.updateUserLanguages(user.languages);*/
            });
          }}
        />
      ))}
    </div>
  );
};

export default AdminOptions;
