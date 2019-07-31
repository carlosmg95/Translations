import React from 'react';
import './ProjectLanguageRow.css';
import { Project, Language } from '../../../types';
import Flag from 'react-world-flags';

interface ProjectLanguageRowProps {
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
        <button type="button" disabled={!props.allowed}>
          Translate
        </button>
      </div>
    </div>
  );
};

export default projectLanguageRow;
