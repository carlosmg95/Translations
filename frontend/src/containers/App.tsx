import React, { useState, Dispatch, SetStateAction } from 'react';
import './App.css';
import { User, Language, Translation, Literal, Project } from '../types';
import Header from '../components/Header/Header';
import Main from '../components/Main/Main';
import Translate from '../components/Translate/Translate';
import NewProject from '../components/NewProject/NewProject';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

interface AppProps {
  user: User;
  users: User[];
  translations: Translation[];
  literals: Literal[];
  languages: Language[];
  projects: Project[];
}

const App: React.FC<AppProps> = (props: AppProps) => {
  const path: string = window.location.pathname.replace(/\/$/, '');

  const projects: Project[] = props.projects.filter(
    (project: Project) => props.user.allowProjects.indexOf(project.id) !== -1,
  );

  const [selectedProjectState, setSeletectedProjectState]: [
    Project,
    Dispatch<SetStateAction<Project>>,
  ] = useState(projects[0]);

  const selectProject = (event: any): void => {
    const projectId: string = event.target.value;
    const selectedProject: Project = props.projects.find(
      (project: Project) => project.id === projectId,
    ) as Project;

    setSeletectedProjectState(selectedProject);
  };

  const CREATE_PROJECT = gql`
    mutation CreateProject($project: ProjectCreateInput!) {
      createProject(data: $project) {
        name
        users {
          name
        }
        languages {
          name
        }
      }
    }
  `;

  const projectName: string = selectedProjectState
    ? selectedProjectState.name
    : '';
  const actions: [string, string][] = props.user.admin
    ? [
        ['translate/' + projectName, 'Translate'], // [id, text]
        ['project', 'Create a new project'],
        ['literal', 'Add new literals'],
        ['language', 'Add new languages'],
        ['user', 'Create a new user'],
      ]
    : [['translate/' + projectName, 'Translate']];

  let body: JSX.Element = <div></div>;
  if (path.match(/\/translate.*/)) {
    body = (
      <Translate
        user={props.user}
        translations={props.translations}
        literals={props.literals}
        languages={props.languages}
        projects={projects}
      />
    );
  } else if (path.match(/\/project.*/)) {
    body = (
      <Mutation mutation={CREATE_PROJECT}>
        {(createProject: any) => (
          <NewProject
            users={props.users}
            languages={props.languages}
            createProject={(
              name: string,
              users: string[],
              languages: string[],
            ) => {
              const connectUsers: { id: string }[] = users.map(
                (userId: string) => {
                  return { id: userId };
                },
              );
              const connectLanguages: { id: string }[] = languages.map(
                (languageId: string) => {
                  return { id: languageId };
                },
              );

              return createProject({
                variables: {
                  project: {
                    name: name,
                    users: {
                      connect: connectUsers,
                    },
                    languages: {
                      connect: connectLanguages,
                    },
                  },
                },
              });
            }}
          />
        )}
      </Mutation>
    );
  } else {
    body = (
      <Main
        actions={actions}
        projects={projects}
        selectProject={selectProject}
      />
    );
  }

  return (
    <div className="App">
      <Header title="Translations" user={props.user} />
      {body}
    </div>
  );
};

export default App;
