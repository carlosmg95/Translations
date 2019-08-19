import React from 'react';
import './ProjectOptionsItem.css';
import { User, Project, Language } from '../../../types';

interface ProjectOptionsItemProps {
  project?: Project;
  languages?: Language[];
  users?: User[];
  header?: boolean;
}

const projectOptionsItem: React.FC<ProjectOptionsItemProps> = (
  props: ProjectOptionsItemProps,
) => {
  let projectLanguages: Language[];
  let otherLanguages: Language[];
  let projectUsers: User[];
  let otherUsers: User[];

  if (!props.header) {
    projectLanguages = props.project.languages;
    otherLanguages = props.languages.filter(
      (lang: Language) =>
        projectLanguages.map((pLang: Language) => pLang.id).indexOf(lang.id) ===
        -1,
    );
    projectUsers = props.project.users;
    otherUsers = props.users.filter(
      (user: User) =>
        projectUsers.map((pUser: User) => pUser.id).indexOf(user.id) === -1,
    );
  }
  return (
    <div className={'ProjectOptionsItem' + (props.header ? ' header' : '')}>
      <div className="column">
        {props.header ? 'Project name' : props.project.name}
      </div>
      <div className="column project-in">
        {props.header
          ? 'Project languages'
          : projectLanguages.map((lang: Language) => (
              <p key={lang.id} className="item-name">
                {lang.name}
              </p>
            ))}
      </div>
      <div className="column project-out">
        {props.header
          ? 'All languages'
          : otherLanguages.map((lang: Language) => (
              <p key={lang.id} className="item-name">
                {lang.name}
              </p>
            ))}
      </div>
      <div className="column project-in">
        {props.header
          ? 'Project users'
          : projectUsers.map((user: User) => (
              <p key={user.id} className="item-name">
                {user.name}
              </p>
            ))}
      </div>
      <div className="column project-out">
        {props.header
          ? 'All users'
          : otherUsers.map((user: User) => (
              <p key={user.id} className="item-name">
                {user.name}
              </p>
            ))}
      </div>
    </div>
  );
};

export default projectOptionsItem;