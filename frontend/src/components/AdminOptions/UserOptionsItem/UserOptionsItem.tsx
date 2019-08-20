import React from 'react';
import './UserOptionsItem.css';
import { User, Language } from '../../../types';

interface UserOptionsItemProps {
  user?: User;
  languages?: Language[];
  header?: boolean;
  addLanguage?(languageId: string): void;
  removeLanguage?(languageId: string): void;
}

const userOptionsItem: React.FC<UserOptionsItemProps> = (
  props: UserOptionsItemProps,
) => {
  let userLanguages: Language[];
  let otherLanguages: Language[];

  if (!props.header) {
    userLanguages = props.user.languages;
    otherLanguages = props.languages.filter(
      (lang: Language) =>
        userLanguages.map((pLang: Language) => pLang.id).indexOf(lang.id) ===
        -1,
    );
  }
  return (
    <div className={'UserOptionsItem' + (props.header ? ' header' : '')}>
      <div className="column">
        {props.header ? 'User name' : <h2>{props.user.name}</h2>}
      </div>
      <div className="column project-in">
        {props.header
          ? 'User languages'
          : userLanguages.map((lang: Language) => (
              <p
                key={lang.id}
                className="item-name"
                onClick={() => {
                  props.removeLanguage(lang.id);
                }}
              >
                {lang.name}
              </p>
            ))}
      </div>
      <div className="column project-out">
        {props.header
          ? 'All languages'
          : otherLanguages.map((lang: Language) => (
              <p
                key={lang.id}
                className="item-name"
                onClick={() => {
                  props.addLanguage(lang.id);
                }}
              >
                {lang.name}
              </p>
            ))}
      </div>
    </div>
  );
};

export default userOptionsItem;
