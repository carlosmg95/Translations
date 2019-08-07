import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import { User } from '../types';
import MainHeader from '../components/MainHeader/MainHeader';
//import NewProject from './NewProject/NewProject';

const MainDashboard = React.lazy(() => import('./MainDashboard/MainDashboard'));
const ProjectDashboard = React.lazy(() =>
  import('./ProjectDashboard/ProjectDashboard'),
);
const Translate = React.lazy(() => import('./Translate/Translate'));

interface AppProps {
  user: User;
}

const App: React.FC<AppProps> = (props: AppProps) => {
  //const path: string = window.location.pathname.replace(/\/$/, '');

  /*const projects: Project[] = props.projects.filter(
    (project: Project) => props.user.allowProjects.indexOf(project.id) !== -1,
  );*/

  /*const CREATE_PROJECT = gql`
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
  `;*/

  /*let body: JSX.Element = <div></div>;
  if (path.match(/^\/translate.*)) {
    /*body = (
      <Translate
        user={props.user}
        translations={props.translations}
        literals={props.literals}
        languages={props.languages}
        projects={projects}
      />
    );*
  } else if (path.match(/^\/newproject.*)) {
    /*body = (
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
    );*
  }*/

  return (
    <div className="App">
      <MainHeader title="Translations" user={props.user} />
      <Switch>
        <Route
          exact
          path="/"
          render={routeProps => (
            <Suspense fallback={<div>Loading...</div>}>
              <MainDashboard user={props.user} />
            </Suspense>
          )}
        />
        <Route
          exact
          path="/dashboard"
          render={routeProps => (
            <Suspense fallback={<div>Loading...</div>}>
              <MainDashboard user={props.user} />
            </Suspense>
          )}
        />
        <Route
          exact
          path="/project/:projectName"
          render={routeProps => {
            const { projectName } = routeProps.match.params;
            return (
              <Suspense fallback={<div>Loading...</div>}>
                <ProjectDashboard user={props.user} projectName={projectName} />
              </Suspense>
            );
          }}
        />
        <Route
          exact
          path="/project/:projectName/translate/:languageIso"
          render={routeProps => {
            const { languageIso, projectName } = routeProps.match.params;
            return (
              <Suspense fallback={<div>Loading...</div>}>
                <Translate
                  user={props.user}
                  languageIso={languageIso}
                  projectName={projectName}
                />
              </Suspense>
            );
          }}
        />
      </Switch>
    </div>
  );
};

export default App;
