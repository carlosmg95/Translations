import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import { User } from '../types';
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
}

const App: React.FC<AppProps> = (props: AppProps) => {
  return (
    <div className="App">
      <MainHeader title="Translations" user={props.user} />
      <Switch>
        <Route
          exact
          path="/"
          render={() => (
            <Suspense fallback={<div>Loading...</div>}>
              <MainDashboard user={props.user} />
            </Suspense>
          )}
        />
        <Route
          exact
          path="/dashboard"
          render={() => (
            <Suspense fallback={<div>Loading...</div>}>
              <MainDashboard user={props.user} />
            </Suspense>
          )}
        />
        <Route
          exact
          path="/newproject"
          render={() => {
            return (
              <Suspense fallback={<div>Loading...</div>}>
                <NewProject user={props.user} />
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
                <AdminDashboard user={props.user} />
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
            const query: string = routeProps.location.search;
            const { languageIso, projectName } = routeProps.match.params;
            const page: string =
              query.match(/page=(\d+)/) && query.match(/page=(\d+)/)[1];
            const filter: string =
              query.match(/filter=(\d+)/) && query.match(/filter=(\d+)/)[1];
            const search: string =
              query.match(/search=(\w+)/) && query.match(/search=(\w+)/)[1];
            const update: boolean =
              query.match(/update=(\d+)/) && !!+query.match(/update=(\d+)/)[1];
            return (
              <Suspense fallback={<div>Loading...</div>}>
                <Translate
                  user={props.user}
                  languageIso={languageIso}
                  projectName={projectName}
                  page={+page || 1}
                  filter={+filter || 0}
                  search={search || ''}
                  update={update || false}
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
