import React, { useState, Dispatch, SetStateAction, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import { User, Project } from '../types';
import MainHeader from '../components/MainHeader/MainHeader';
import NewProject from './NewProject/NewProject';

const MainDashboard = React.lazy(() => import('./MainDashboard/MainDashboard'));
const ProjectDashboard = React.lazy(() =>
  import('./ProjectDashboard/ProjectDashboard'),
);
const Translate = React.lazy(() => import('./Translate/Translate'));

interface AppProps {
  user: User;
}

const App: React.FC<AppProps> = (props: AppProps) => {
  const [projectsState, setProjectsState]: [
    Project[],
    Dispatch<SetStateAction<Project[]>>
  ] = useState([]);

  const setNewProjects = (projects: Project[]): void => {
    setProjectsState(projects);
  };

  const addNewProject = (project: Project): void => {
    const projects = [ ...projectsState, project ];
    setProjectsState(projects);
  };

  return (
    <div className="App">
      <MainHeader title="Translations" user={props.user} />
      <Switch>
        <Route
          exact
          path="/"
          render={routeProps => (
            <Suspense fallback={<div>Loading...</div>}>
              <MainDashboard user={props.user} projects={projectsState} setNewProjects={setNewProjects} />
            </Suspense>
          )}
        />
        <Route
          exact
          path="/dashboard"
          render={routeProps => (
            <Suspense fallback={<div>Loading...</div>}>
              <MainDashboard user={props.user} projects={projectsState} setNewProjects={setNewProjects} />
            </Suspense>
          )}
        />
        <Route
          exact
          path="/newproject"
          render={() => {
            return (
              <Suspense fallback={<div>Loading...</div>}>
                <NewProject user={props.user} addNewProject={addNewProject} />
              </Suspense>
            );
          }}
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
