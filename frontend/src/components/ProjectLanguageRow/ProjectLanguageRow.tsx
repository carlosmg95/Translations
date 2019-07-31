import React from 'react';
import { Link } from 'react-router-dom';
import './ProjectLanguageRow.css';
import { Project, Language } from '../../types';
import Flag from 'react-world-flags';

interface ProjectLanguageRowProps {
  projectName: string;
  language: Language;
  allowed: boolean;
}

const projectLanguageRow: React.FC<ProjectLanguageRowProps> = (
  props: ProjectLanguageRowProps,
) => {
  return (
    <div className={'projectLanguageRow ' + (props.allowed ? '' : 'disabled')}>
      <div className="language-project">
        <div>
          <Flag className="flag" code={props.language.code} height="18" />
          <small>{props.language.name}</small>
        </div>
      </div>
      <div className="add-literal">
        <button type="button" disabled={!props.allowed}>
          + Add literal
        </button>
      </div>
      <div className="translate">
        <Link
          to={
            props.allowed
              ? `${props.projectName}/translate/${props.language.iso}`
              : '#'
          }
        >
          <button type="button" disabled={!props.allowed}>
            Translate
          </button>
        </Link>
      </div>
    </div>
  );
};

export default projectLanguageRow;
