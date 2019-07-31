import React from 'react';
import './Dashboard.css';
import ProjectItem from '../../components/ProjectItem/ProjectItem';
import { Project, User, Language } from '../../types';
import UserContext from '../../context/user-context';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

interface DashboardProps {}

const dashboard: React.FC<DashboardProps> = (props: DashboardProps) => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="projects-list">
        <UserContext.Consumer>
          {({ user }) => {
            const PROJECTS = gql`
              {
                projects(where: { users_every: { name: "${user.name}" } }) {
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
              <Query query={PROJECTS}>
                {result => {
                  if (result.loading) {
                    return <div></div>;
                  } else {
                    let { projects } = result.data;
                    return projects.map(project => (
                      <ProjectItem
                        key={project.id}
                        project={project}
                        new={false}
                        user={user}
                      />
                    ));
                  }
                }}
              </Query>
            );
          }}
        </UserContext.Consumer>
        <ProjectItem key={0} new={true} user={null} />
      </div>
    </div>
  );
};

export default dashboard;
