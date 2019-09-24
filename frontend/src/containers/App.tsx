import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import { User } from '../types';
import MainHeader from '../components/MainHeader/MainHeader';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import Loading from '../components/Loading/Loading';

const Login = React.lazy(() => import('./Login/Login'));
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
          render={() =>
            props.user ? <Redirect to="/dashboard" /> : <Redirect to="/login" />
          }
        />
        <Route
          exact
          path="/login"
          render={() =>
            props.user ? (
              <Redirect to="/dashboard" />
            ) : (
              <Suspense fallback={<Loading />}>
                <Login />
              </Suspense>
            )
          }
        />
        <Route
          exact
          path="/signup"
          render={() =>
            props.user ? (
              <Redirect to="/dashboard" />
            ) : (
              <Suspense fallback={<Loading />}>
                <Login signup={true} />
              </Suspense>
            )
          }
        />
        <Route
          exact
          path="/dashboard"
          render={() =>
            props.user ? (
              <Suspense fallback={<Loading />}>
                <MainDashboard user={props.user} />
              </Suspense>
            ) : (
              <Redirect to="/login" />
            )
          }
        />
        <Route
          exact
          path="/newproject"
          render={() =>
            props.user ? (
              props.user.admin ? (
                <Suspense fallback={<Loading />}>
                  <NewProject user={props.user} />
                </Suspense>
              ) : (
                <Redirect to="/dashboard" />
              )
            ) : (
              <Redirect to="/login" />
            )
          }
        />
        <Route
          exact
          path="/admin"
          render={() =>
            props.user ? (
              props.user.admin ? (
                <Suspense fallback={<Loading />}>
                  <AdminDashboard user={props.user} />
                </Suspense>
              ) : (
                <Redirect to="/dashboard" />
              )
            ) : (
              <Redirect to="/login" />
            )
          }
        />
        <Route
          exact
          path="/project/:projectName"
          render={routeProps => {
            const { projectName } = routeProps.match.params;
            return props.user ? (
              <Suspense fallback={<Loading />}>
                <ProjectDashboard user={props.user} projectName={projectName} />
              </Suspense>
            ) : (
              <Redirect to="/login" />
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
            return props.user ? (
              <Suspense fallback={<Loading />}>
                <Translate
                  user={props.user}
                  languageIso={languageIso}
                  projectName={projectName}
                  page={+page || 1}
                  filter={+filter || 0}
                  search={search || ''}
                />
              </Suspense>
            ) : (
              <Redirect to="/login" />
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
