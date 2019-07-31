import React from 'react';
import './ProjectItem.css';
import { Project, Language, User } from '../../../types';
import Flag from 'react-world-flags';

interface ProjectItemProps {
  project?: Project;
  new: boolean;
  user: User;
  choose(id: string): void;
}

const project: React.FC<ProjectItemProps> = (props: ProjectItemProps) => {
  return (
    <div className={'project__item ' + (props.new ? 'new' : '')}>
      {!props.new && props.project ? (
        <>
          <h3
            className="project__item-title"
            onClick={() => {
              window.location.href = `/project/${props.project &&
                props.project.name}`;
            }}
          >
            {props.project.name}
          </h3>
          <small>It has {props.project.literals.length} literals.</small>
          <p>Languages:</p>
          <ul className="languages-flag__list">
            {props.project.languages.map((language: Language) => {
              const allowed: boolean =
                props.user.allowLanguages.indexOf(language.id) !== -1;
              return (
                <li
                  key={project.name + language.iso}
                  className={
                    'language-flag__item ' + (allowed ? '' : 'disabled')
                  }
                  onClick={() => {
                    window.location.href = `/project/${props.project &&
                      props.project.name}/translate/${language.iso}`;
                  }}
                >
                  <Flag className="flag" code={language.code} height="18" />
                  <small>{language.name}</small>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <>
          <p className="plus">+</p>
          <h3
            className="create-project"
            onClick={() => {
              window.location.href = '/newproject';
            }}
          >
            Create new project
          </h3>
        </>
      )}
    </div>
  );
};

export default project;
