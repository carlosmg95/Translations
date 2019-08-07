import React from 'react';
import { Link } from 'react-router-dom';
import './ProjectLanguageRow.css';
import PillButton from '../PillButton/PillButton';
import { Language } from '../../types';
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
        <PillButton text="+ Add literal" disabled={!props.allowed} />
      </div>
      <div className="translate">
        <Link
          to={
            props.allowed
              ? `${props.projectName}/translate/${props.language.iso}`
              : '#'
          }
        >
          <PillButton text="Translate" disabled={!props.allowed} />
        </Link>
      </div>
    </div>
  );
};

export default projectLanguageRow;
