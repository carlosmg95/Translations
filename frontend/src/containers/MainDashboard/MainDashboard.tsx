import React from 'react';
import './MainDashboard.css';
import ProjectItem from '../../components/ProjectItem/ProjectItem';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { User, Project } from '../../types';
import { ProjectResponse } from '../../types-res';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = (props: DashboardProps) => {
  const GET_PROJECTS = gql`{
    projects(where: { users_some: { name: "${props.user.name}" } }) ${ProjectResponse}
  }`;

  const { loading, error, data, refetch } = useQuery(GET_PROJECTS);

  if (loading) return <div>Loading...</div>;
  if (error) return <ErrorMessage code={500} message="Server error" />;

  let projects: Project[] = data.projects;

  refetch().then(result => {
    projects = result.data.projects;
  });

  return (
    <div className="MainDashboard">
      <h1>Dashboard</h1>
      <div className="projects-list">
        {projects.map(project => (
          <ProjectItem
            key={project.id}
            project={project}
            new={false}
            user={props.user}
          />
        ))}
        {props.user.admin ? <ProjectItem key={0} new={true} user={null} /> : ''}
      </div>
    </div>
  );
};

export default Dashboard;
