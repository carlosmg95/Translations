import React from 'react';
import './UserOptionsItem.css';
import { User, Language } from '../../../types';

interface UserOptionsItemProps {
  user?: User;
  languages?: Language[];
  header?: boolean;
  addLanguage?(languageId: string): void;
  removeLanguage?(languageId: string): void;
  setAdmin?(userId: string, admin: boolean);
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
        {props.header
          ? (
            'User name'
          ) : ( 
            <>
              <h2>{props.user.name}</h2>
              <p>Admin:
                <input
                  className="select_set-admin"
                  type="checkbox"
                  checked={props.user.admin as boolean}
                  onChange={() => {
                    props.setAdmin(props.user.id, !props.user.admin);
                  }}
                />
              </p>
            </>
          )}
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
