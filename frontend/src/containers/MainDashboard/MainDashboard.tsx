import React from 'react';
import './MainDashboard.css';
import ProjectItem from '../../components/ProjectItem/ProjectItem';
import { User, Project } from '../../types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

interface DashboardProps {
  user: User;
  projects: Project[];
  setNewProjects(projects: Project[]): void;
}

const dashboard: React.FC<DashboardProps> = (props: DashboardProps) => {
  const PROJECTS = gql`
    {
      projects(where: { users_every: { name: "${props.user.name}" } }) {
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
    <div className="MainDashboard">
      <h1>Dashboard</h1>
      <div className="projects-list">
        <Query query={PROJECTS}>
          {result => {
            if (result.loading) {
              return <div></div>;
            } else {
              let { projects } = result.data;
              if (props.projects.length === 0) props.setNewProjects(projects);
              return props.projects.map(project => (
                <ProjectItem
                  key={project.id}
                  project={project}
                  new={false}
                  user={props.user}
                />
              ));
            }
          }}
        </Query>
        <ProjectItem key={0} new={true} user={null} />
      </div>
    </div>
  );
};

export default dashboard;
