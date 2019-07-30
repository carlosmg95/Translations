import React from 'react';
import './ProjectLanguageRow.css';
import { Project, Language } from '../../../types';
import Flag from 'react-world-flags';

interface ProjectLanguageRowProps {
  language: Language;
}

const projectLanguageRow: React.FC<ProjectLanguageRowProps> = (
  props: ProjectLanguageRowProps,
) => {
  return (
    <div className="projectLanguageRow">
      <div className="language-project">
        <div>
          <Flag className="flag" code={props.language.code} height="18" />
          <small>{props.language.name}</small>
        </div>
      </div>
      <div className="add-literal">
        <button type="button">+ Add literal</button>
      </div>
      <div className="translate">
        <button type="button">Translate</button>
      </div>
    </div>
  );
};

export default projectLanguageRow;
