import React from 'react';
import { Link } from 'react-router-dom';
import './ProjectItem.css';
import { Project, Language, User } from '../../types';
import Flag from 'react-world-flags';

interface ProjectItemProps {
  project?: Project;
  new: boolean;
  user: User;
}

const project: React.FC<ProjectItemProps> = (props: ProjectItemProps) => {
  return (
    <div className={'project__item' + (props.new ? ' new' : '')}>
      {!props.new && props.project ? (
        <>
          <Link
            className="project__item-title"
            to={`/project/${props.project && props.project.name}`}
          >
            <h3>{props.project.name}</h3>
          </Link>
          <small>It has {props.project.literals.length} literals.</small>
          <p>Languages:</p>
          <ul className="languages-flag__list">
            {props.project.languages.map((language: Language) => {
              const allowed: boolean =
                props.user.languages
                  .map((lang: Language) => lang.id)
                  .indexOf(language.id) !== -1;
              return (
                <Link
                  key={project.name + language.iso}
                  to={
                    allowed
                      ? `/project/${props.project &&
                          props.project.name}/translate/${language.iso}`
                      : '#'
                  }
                >
                  <li
                    className={
                      'language-flag__item ' + (allowed ? '' : 'disabled')
                    }
                  >
                    <Flag className="flag" code={language.code} height="18" />
                    <small>{language.name}</small>
                  </li>
                </Link>
              );
            })}
          </ul>
        </>
      ) : (
        <>
          <p className="plus">+</p>
          <Link to="/newproject">
            <h3 className="create-project">Create new project</h3>
          </Link>
        </>
      )}
    </div>
  );
};

export default project;
