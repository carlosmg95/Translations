import React from 'react';
import { Link } from 'react-router-dom';
import './ProjectLanguageRow.css';
import PillButton from '../PillButton/PillButton';
import LanguageFlag from '../LanguageFlag/LanguageFlag';
import { Language, Project } from '../../types';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

interface ProjectLanguageRowProps {
  project: Project;
  language: Language;
  allowed: boolean;
  pushFunction(pushResult: Promise<any>): void;
}

const ProjectLanguageRow: React.FC<ProjectLanguageRowProps> = (
  props: ProjectLanguageRowProps,
) => {
  const PUSH_TRANSLATIONS = gql`
    mutation PushTranslations(
      $project: ProjectWhereUniqueInput!
      $language: LanguageWhereUniqueInput!
    ) {
      pushTranslations(project: $project, language: $language)
    }
  `;

  const [push] = useMutation(PUSH_TRANSLATIONS);

  return (
    <div className={'projectLanguageRow ' + (props.allowed ? '' : 'disabled')}>
      <div className="language-project">
        <LanguageFlag
          key={props.language.id}
          allowed={props.allowed}
          code={props.language.code}
          name={props.language.name}
        />
      </div>
      <div className="push-json">
        <PillButton
          text="Push translations"
          disabled={!props.allowed}
          onClick={() => {
            props.pushFunction(
              push({
                variables: {
                  project: { name: props.project.name },
                  language: { iso: props.language.iso },
                },
              }),
            );
          }}
        />
      </div>
      <div className="translate">
        <Link
          to={
            props.allowed
              ? `${props.project.name}/translate/${props.language.iso}`
              : '#'
          }
        >
          <PillButton text="Translate" disabled={!props.allowed} />
        </Link>
      </div>
    </div>
  );
};

export default ProjectLanguageRow;
