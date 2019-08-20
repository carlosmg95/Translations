import React, { useState, Dispatch, SetStateAction, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import { Language, Project, User } from '../types';
import MainHeader from '../components/MainHeader/MainHeader';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';

const NewProject = React.lazy(() => import('./NewProject/NewProject'));
const MainDashboard = React.lazy(() => import('./MainDashboard/MainDashboard'));
const ProjectDashboard = React.lazy(() =>
  import('./ProjectDashboard/ProjectDashboard'),
);
const Translate = React.lazy(() => import('./Translate/Translate'));
const AdminDashboard = React.lazy(() =>
  import('./AdminDashboard/AdminDashboard'),
);

interface AppProps {
  user: User;
  projects: Project[];
}

const App: React.FC<AppProps> = (props: AppProps) => {
  const [userState, setUserState]: [
    // The logged user
    User,
    Dispatch<SetStateAction<User>>,
  ] = useState(props.user);

  const [projectsState, setProjectsState]: [
    // The list of logged user's projects
    Project[],
    Dispatch<SetStateAction<Project[]>>,
  ] = useState(props.projects);

  // Add a new project to the list
  const addNewProject = (project: Project): void => {
    if (
      project.users.map((user: User) => user.id).indexOf(props.user.id) !== -1
    ) {
      const projects = [...projectsState, project];
      let user: User = userState;
      user.projects = [...user.projects, project];

      setProjectsState(projects);
      setUserState(user);
    }
  };

  // Update a project in the list
  const updateProject = (
    projectWhereKey: string,
    projectWhereValue: string,
    updatedProject: Project,
  ): void => {
    let projects: Project[] = projectsState;
    projects = projects.map((project: Project) => {
      if (project[projectWhereKey] === projectWhereValue) return updatedProject;
      return project;
    });
    setProjectsState(projects);
  };

  // Update the languages of the logged user
  const updateUserLanguages = (languages: Language[]): void => {
    let user: User = userState;
    user.languages = languages;
    //let languages: Language[] = user.languages;
    /*let projects: Project[] = projectsState;
    projects = projects.map((project: Project) => {
      if (project[projectWhereKey] === projectWhereValue) return updatedProject;
      return project;
    });
    setProjectsState(projects);*/
    setUserState(user);
  };

  // Add a value to property array of a project in the list
  const addValueToProjectProperty = (
    projectWhereKey: string,
    projectWhereValue: string,
    projectSetKey: string,
    projectSetValue: any,
  ): void => {
    let projects: Project[] = projectsState;
    projects = projects.map((project: Project) => {
      if (project[projectWhereKey] === projectWhereValue)
        project[projectSetKey] = [...project[projectSetKey], projectSetValue];
      return project;
    });
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
              <MainDashboard user={props.user} projects={projectsState} />
            </Suspense>
          )}
        />
        <Route
          exact
          path="/dashboard"
          render={routeProps => (
            <Suspense fallback={<div>Loading...</div>}>
              <MainDashboard user={props.user} projects={projectsState} />
            </Suspense>
          )}
        />
        <Route
          exact
          path="/newproject"
          render={routeProps => {
            return (
              <Suspense fallback={<div>Loading...</div>}>
                <NewProject
                  user={props.user}
                  addNewProject={addNewProject}
                  history={routeProps.history}
                />
              </Suspense>
            );
          }}
        />
        <Route
          exact
          path="/admin"
          render={() => {
            return (
              <Suspense fallback={<div>Loading...</div>}>
                <AdminDashboard
                  user={props.user}
                  projects={projectsState}
                  updateProject={updateProject}
                  updateUserLanguages={updateUserLanguages}
                />
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
                <ProjectDashboard
                  user={props.user}
                  project={projectsState.find(
                    (project: Project) => project.name === projectName,
                  )}
                />
              </Suspense>
            );
          }}
        />
        <Route
          exact
          path="/project/:projectName/translate/:languageIso"
          render={routeProps => {
            const { languageIso, projectName } = routeProps.match.params;
            let project: Project = projectsState.find(
              (project: Project) => project.name === projectName,
            );
            return (
              <Suspense fallback={<div>Loading...</div>}>
                <Translate
                  user={props.user}
                  languageIso={languageIso}
                  addValueToProjectProperty={addValueToProjectProperty}
                  updateProject={updateProject}
                  project={project}
                />
              </Suspense>
            );
          }}
        />
        <Route
          exact
          path=""
          render={() => {
            return <ErrorMessage code={404} message="NOT FOUND" />;
          }}
        />
      </Switch>
    </div>
  );
};

export default App;
