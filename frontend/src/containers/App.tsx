import React, { useState, Dispatch, SetStateAction } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import { User, Language, Translation, Literal, Project } from '../types';
import Header from '../components/Header/Header';
import Dashboard from './Dashboard/Dashboard';
import ProjectDashboard from './ProjectDashboard/ProjectDashboard';
import Translate from '../components/Translate/Translate';
import NewProject from './NewProject/NewProject';
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

  let body: JSX.Element = <div></div>;
  if (path.match(/^\/translate.*/)) {
    body = (
      <Translate
        user={props.user}
        translations={props.translations}
        literals={props.literals}
        languages={props.languages}
        projects={projects}
      />
    );
  } else if (path.match(/^\/newproject.*/)) {
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
  }

  return (
    <div className="App">
      <Header title="Translations" user={props.user} />
      <Switch>
        <Route exact path="/" render={Dashboard} />
        <Route path="/dashboard" render={Dashboard} />
        <Route path="/project/:projectName" render={ProjectDashboard} />
      </Switch>
    </div>
  );
};

export default App;
