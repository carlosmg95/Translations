import React from 'react';
import './ProjectDashboard.css';
import Dashboard, {
  DashboardBody,
  DashboardHeader,
} from '../../components/Dashboard/Dashboard';
import ProjectLanguageRow from '../../components/ProjectLanguageRow/ProjectLanguageRow';
import { Language, User } from '../../types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

interface ProjectDashboardProps {
  projectName: string;
  user: User;
}

const projectDashboard: React.FC<ProjectDashboardProps> = (
  props: ProjectDashboardProps,
) => {
  const PROJECT = gql`
    {
      project(where: { name: "${props.projectName}" }) {
        id
        name
        languages {
          id
          name
          iso
          code
        }
        literals {
          id
        }
      }
    }
  `;

  return (
    <Dashboard>
      <DashboardHeader
        title={props.projectName}
        links={[{ to: '/dashboard', text: 'dashboard' }]}
      />
      <Query query={PROJECT}>
        {({ data, loading }) => {
          if (loading) {
            return <></>;
          } else {
            return (
              <DashboardBody>
                {data.project.languages.map((language: Language) => {
                  const allowed: boolean =
                    props.user.allowLanguages.indexOf(language.id) !== -1;
                  return (
                    <ProjectLanguageRow
                      key={language.id}
                      language={language}
                      projectName={props.projectName}
                      allowed={allowed}
                    />
                  );
                })}
              </DashboardBody>
            );
          }
        }}
      </Query>
    </Dashboard>
  );
};

export default projectDashboard;
