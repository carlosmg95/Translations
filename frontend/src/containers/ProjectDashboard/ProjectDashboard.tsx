import React from 'react';
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

const projectDashboard: React.FC<ProjectDashboardProps> = (
  props: ProjectDashboardProps,
) => {
  if (
    props.user.projects
      .map((project: Project) => project.id)
      .indexOf(props.project.id) === -1
  ) {
    return <ErrorMessage code={401} message="You shouldn't be here!" />;
  }

  return (
    <Dashboard>
      <DashboardHeader
        title={props.project.name}
        links={[{ to: '/dashboard', text: 'dashboard' }]}
      />
      <DashboardBody>
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
            />
          );
        })}
      </DashboardBody>
    </Dashboard>
  );
};

export default projectDashboard;
