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
import PillButton from '../../components/PillButton/PillButton';
import { Language, User, Project } from '../../types';
import { ProjectResponse } from '../../types-res';
import { useMutation, useQuery } from '@apollo/react-hooks';
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

  const [updateState, setUpdateState]: [
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ] = useState(false);

  const pushTranslations = (pushResult: Promise<any>): void => {
    setBlockedState(true);
    pushResult
      .then(() => setBlockedState(false))
      .catch(e => {
        setBlockedState(false);
        console.error(e.message.replace(/.+:\s/, ''));
      });
  };

  const PUSH_TRANSLATIONS = gql`
    mutation PushTranslations($project: ProjectWhereUniqueInput!) {
      pushTranslations(project: $project)
    }
  `;

  const GET_PROJECT = gql`{
    project(where: { name: "${props.projectName}" }) ${ProjectResponse}
  }`;

  const { loading, error, data, refetch } = useQuery(GET_PROJECT);
  const [push] = useMutation(PUSH_TRANSLATIONS);

  if (loading || error) {
    return <Loading errorMessage={error && error.message} errorCode={500} />;
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

  return (
    <Dashboard>
      <DashboardHeader
        title={props.projectName}
        links={[{ to: '/dashboard', text: 'dashboard' }]}
      />
      <DashboardBody>
        <>
          {props.user.admin ? (
            <PillButton
              text="Push All Translations"
              className="push-all-button"
              onClick={() => {
                pushTranslations(
                  push({
                    variables: {
                      project: {
                        name: props.projectName,
                      },
                    },
                  }),
                );
              }}
            />
          ) : (
            ''
          )}
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
                user={props.user}
                language={language}
                project={project}
                allowed={allowed}
                pushFunction={pushTranslations}
                updateAllLanguages={() => {
                  setBlockedState(true);
                  setUpdateState(true);
                  refetch().then(() => {
                    setBlockedState(false);
                    setUpdateState(false);
                  });
                }}
                update={updateState}
              />
            );
          })}
        </>
      </DashboardBody>
    </Dashboard>
  );
};

export default ProjectDashboard;
