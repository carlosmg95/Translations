import React from 'react';
import './AdminDashboard.css';
import Dashboard, {
  DashboardBody,
  DashboardHeader,
} from '../../components/Dashboard/Dashboard';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import AdminOptions from '../../components/AdminOptions/AdminOptions';
import { User } from '../../types';
import { ProjectResponse, UserResponse } from '../../types-res';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

interface AdminDashboardProps {
  user: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = (
  props: AdminDashboardProps,
) => {
  const GET_DATA = gql`{
    users ${UserResponse}
    languages {
      id
      iso
      name
    }
    projects(where: { users_some: { name: "${props.user.name}" } }) ${ProjectResponse}
  }`;

  const { loading, error, data } = useQuery(GET_DATA);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <ErrorMessage code={500} message="Server error" />;
  }

  const { languages, projects, users } = data;

  if (!props.user.admin)
    return <ErrorMessage code={401} message="You shouldn't be here!" />;
  return (
    <Dashboard>
      <DashboardHeader
        title={'admin panel'}
        links={[{ to: '/dashboard', text: 'dashboard' }]}
      />
      <DashboardBody>
        <AdminOptions users={users} languages={languages} projects={projects} />
      </DashboardBody>
    </Dashboard>
  );
};

export default AdminDashboard;
