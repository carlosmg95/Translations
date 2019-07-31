import React from 'react';
import { Link } from 'react-router-dom';
import './ProjectDashboard.css';
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
    <Query query={PROJECT}>
      {({ data, loading }) => {
        if (loading) {
          return <></>;
        } else {
          return (
            <div className="projectDashboard">
              <h1>
                <small className="breadcrumb">
                  <Link to="/dashboard">dashboard/</Link>
                </small>
                {data.project.name}
              </h1>
              <UserContext.Consumer>
                {({ user }) => (
                  <div className="languages-list">
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
                  </div>
                )}
              </UserContext.Consumer>
            </div>
          );
        }
      }}
    </Query>
  );
};

export default projectDashboard;
