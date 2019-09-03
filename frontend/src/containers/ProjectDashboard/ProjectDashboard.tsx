import React, { useState, Dispatch, SetStateAction } from 'react';
import HashLoader from 'react-spinners/HashLoader';
import './ProjectDashboard.css';
import Dashboard, {
  DashboardBody,
  DashboardHeader,
} from '../../components/Dashboard/Dashboard';
import ProjectLanguageRow from '../../components/ProjectLanguageRow/ProjectLanguageRow';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Loading from '../../components/Loading/Loading';
import { Language, User, Project } from '../../types';
import { ProjectResponse } from '../../types-res';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

interface ProjectDashboardProps {
  projectName: string;
  user: User;
}

const ProjectDashboard: React.FC<ProjectDashboardProps> = (
  props: ProjectDashboardProps,
) => {
  const [blockedState, setBlockedState]: [
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ] = useState(false);

  const [errorMessageState, setErrorMessageState]: [
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ] = useState(false);

  const pushTranslations = (pushResult: Promise<any>): void => {
    setBlockedState(true);
    pushResult
      .then(result => setBlockedState(!result.data.pushTranslations))
      .catch(e => setErrorMessageState(true));
  };

  const GET_PROJECT = gql`{
    project(where: { name: "${props.projectName}" }) ${ProjectResponse}
  }`;

  const { loading, error, data } = useQuery(GET_PROJECT);

  if (loading || error) {
    return <Loading errorMessage={error && error.message} errorCode={500} />
  }

  const project: Project = data.project;

  if (
    !props.projectName ||
    props.user.projects
      .map((project: Project) => project.name)
      .indexOf(props.projectName) === -1
  ) {
    return <ErrorMessage code={401} message="You shouldn't be here!" />;
  }

  if (errorMessageState) {
    return <ErrorMessage code={500} message="Server error" />;
  }

  return (
    <>
      <Dashboard>
        <DashboardHeader
          title={props.projectName}
          links={[{ to: '/dashboard', text: 'dashboard' }]}
        />
        <DashboardBody>
          <>
            {blockedState ? (
              <div className="blocked">
                <HashLoader size={50} color={'#36d7b7'} />
              </div>
            ) : (
              ''
            )}
            {project.languages.map((language: Language) => {
              const allowed: boolean =
                props.user.languages
                  .map((lang: Language) => lang.id)
                  .indexOf(language.id) !== -1;
              return (
                <ProjectLanguageRow
                  key={language.id}
                  language={language}
                  project={project}
                  allowed={allowed}
                  pushFunction={pushTranslations}
                />
              );
            })}
          </>
        </DashboardBody>
      </Dashboard>
    </>
  );
};

export default ProjectDashboard;
