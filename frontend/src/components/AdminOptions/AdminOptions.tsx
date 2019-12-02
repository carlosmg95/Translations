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

const ADD_MAIN_LANGUAGE = gql`
  mutation AddMainLanguage(
    $project: ProjectWhereUniqueInput!
    $main_language: String!
  ) {
    addMainLanguage(
      project: $project
      main_language: $main_language
    ) ${ProjectResponse}
  }
`;

const SET_ADMIN_USER = gql`
  mutation SetAdminUser(
    $admin: Boolean!
    $userId: String!
  ) {
    setAdminUser(
      admin: $admin
      userId: $userId
    ) ${UserResponse}
  }
`;

const AdminOptions: React.FC<AdminOptionsProps> = (
  props: AdminOptionsProps,
) => {
  const [addMainLanguage] = useMutation(ADD_MAIN_LANGUAGE);
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
  const [setAdminUser] = useMutation(SET_ADMIN_USER);

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
            });
          }}
          selectMainLanguage={(mainLanguageId: string) => {
            addMainLanguage({
              variables: {
                project: {
                  name: project.name,
                },
                main_language: mainLanguageId,
              },
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
            });
          }}
          setAdmin={(userId: string, admin: boolean) => {
            setAdminUser({
              variables: {
                admin,
                userId
              }
            })
          }}
        />
      ))}
    </div>
  );
};

export default AdminOptions;
