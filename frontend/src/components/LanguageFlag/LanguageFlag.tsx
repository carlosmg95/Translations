import React from 'react';
import { Link } from 'react-router-dom';
import './LanguageFlag.css';
import Flag from 'react-world-flags';

interface LanguageFlagProps {
  allowed: boolean;
  link?: string;
  code: string;
  name: string;
}

const languageFlag: React.FC<LanguageFlagProps> = (
  props: LanguageFlagProps,
) => {
  return (
    <Link
      className={props.link ? 'linkeable' : 'no-linkeable'}
      to={props.allowed && props.link ? props.link : '#'}
    >
      <div
        className={'language-flag__item' + (props.allowed ? '' : ' disabled')}
      >
        <Flag className="flag" code={props.code} height="18" />
        <small>{props.name}</small>
      </div>
    </Link>
  );
};

export default languageFlag;
