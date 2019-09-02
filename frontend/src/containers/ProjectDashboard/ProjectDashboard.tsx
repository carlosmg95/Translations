import React, { useState, Dispatch, SetStateAction } from 'react';
import HashLoader from 'react-spinners/HashLoader';
import './ProjectDashboard.css';
import Dashboard, {
  DashboardBody,
  DashboardHeader,
} from '../../components/Dashboard/Dashboard';
import ProjectLanguageRow from '../../components/ProjectLanguageRow/ProjectLanguageRow';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { Language, User, Project } from '../../types';

interface ProjectDashboardProps {
  project: Project;
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

  if (
    !props.project ||
    props.user.projects
      .map((project: Project) => project.id)
      .indexOf(props.project.id) === -1
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
          title={props.project.name}
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
            {props.project.languages.map((language: Language) => {
              const allowed: boolean =
                props.user.languages
                  .map((lang: Language) => lang.id)
                  .indexOf(language.id) !== -1;
              return (
                <ProjectLanguageRow
                  key={language.id}
                  language={language}
                  project={props.project}
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
