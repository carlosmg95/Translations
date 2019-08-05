import React from 'react';
import { Link } from 'react-router-dom';
import './ProjectDashboard.css';
import Dashboard, {
  DashboardBody,
  DashboardHeader,
} from '../../components/Dashboard/Dashboard';
import ProjectLanguageRow from '../../components/ProjectLanguageRow/ProjectLanguageRow';
import { Project, Language, User } from '../../types';
import UserContext from '../../context/user-context';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

interface ProjectDashboardProps {
  [propName: string]: any;
}

const projectDashboard: React.FC<ProjectDashboardProps> = (
  props: ProjectDashboardProps,
) => {
  const projectName: string = props.match.params.projectName;

  const PROJECT = gql`
    {
      project(where: { name: "${projectName}" }) {
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
        title={projectName}
        links={[{ to: '/dashboard', text: 'dashboard' }]}
      />
      <Query query={PROJECT}>
        {({ data, loading }) => {
          if (loading) {
            return <></>;
          } else {
            return (
              <UserContext.Consumer>
                {({ user }) => (
                  <DashboardBody>
                    {data.project.languages.map((language: Language) => {
                      const allowed: boolean =
                        user.allowLanguages.indexOf(language.id) !== -1;
                      return (
                        <ProjectLanguageRow
                          key={language.id}
                          language={language}
                          projectName={projectName}
                          allowed={allowed}
                        />
                      );
                    })}
                  </DashboardBody>
                )}
              </UserContext.Consumer>
            );
          }
        }}
      </Query>
    </Dashboard>
  );
};

export default projectDashboard;
