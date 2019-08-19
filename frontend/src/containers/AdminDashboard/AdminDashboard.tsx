import React from 'react';
import './AdminDashboard.css';
import Dashboard, {
  DashboardBody,
  DashboardHeader,
} from '../../components/Dashboard/Dashboard';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import ProjectsOptions from '../../components/ProjectsOptions/ProjectsOptions';
import { User, Project } from '../../types';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

interface AdminDashboardProps {
  user: User;
  projects: Project[];
  updateProject(
    projectWhereKey: string,
    projectWhereValue: string,
    updatedProject: Project,
  ): void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = (
  props: AdminDashboardProps,
) => {
  const GET_DATA = gql`
    {
      users {
        id
        name
      }
      languages {
        id
        iso
        name
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_DATA);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <ErrorMessage code={500} message="Server error" />;
  }

  const { users, languages } = data;

  if (!props.user.admin)
    return <ErrorMessage code={401} message="You shouldn't be here!" />;
  return (
    <Dashboard>
      <DashboardHeader
        title={'admin'}
        links={[{ to: '/dashboard', text: 'dashboard' }]}
      />
      <DashboardBody>
        <ProjectsOptions
          users={users}
          languages={languages}
          projects={props.projects}
          updateProject={props.updateProject}
        />
      </DashboardBody>
    </Dashboard>
  );
};

export default AdminDashboard;
