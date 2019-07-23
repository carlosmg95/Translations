import React, { useState, Dispatch, SetStateAction, useEffect } from 'react';
import './Translate.css';
import TranslateRow from './TranslateRow/TranslateRow';
import {
  User,
  Language,
  Translation,
  Literal,
  Row,
  Project,
} from '../../types';

interface TranslateProps {
  user: User;
  translations: Translation[];
  literals: Literal[];
  languages: Language[];
  projects: Project[];
}

const Translate: React.FC<TranslateProps> = (props: TranslateProps) => {
  const projectName: string = window.location.pathname.replace(
    /^\/translate\/(.*)$/,
    '$1',
  );
  const project: Project = props.projects.find(
    (project: Project) => project.name === projectName,
  ) as Project;
  const languages: Language[] = props.languages.filter((language: Language) => {
    if (project) return project.languages.indexOf(language.id) !== -1;
    return false;
  });

  const translations: Translation[] = props.translations.filter(
    (translation: Translation) => {
      if (project) return translation.project_id === project.id;
      return false;
    },
  );

  const literals: Literal[] = props.literals.filter((literal: Literal) => {
    if (project) return literal.project_id === project.id;
    return false;
  });

  const [languageIdState, setLanguageIdState]: [
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(0);

  const [languageNameState, setLanguageNameState]: [
    string,
    Dispatch<SetStateAction<string>>,
  ] = useState('');

  const [rowsState, setRowsState]: [
    Row[],
    Dispatch<SetStateAction<Row[]>>,
  ] = useState([{ literal: '', as_in: '', translation: '' }]);

  const selectLanguage = (id: number, name: string): void => {
    const languageTranslations = translations.filter(
      (translation: Translation) => translation.lang_id === id,
    );

    let rows: Row[] = literals.map((literal: Literal) => {
      let row: Row = {
        literal: literal.literal,
        as_in: literal.as_in,
        translation: '',
      };
      let translation: Translation = languageTranslations.find(
        (translation: Translation) => translation.lit_id === literal.id,
      ) as Translation;
      row.translation = translation ? translation.translation : '';
      return row;
    });

    setLanguageIdState(id);
    setLanguageNameState(name);
    setRowsState(rows);
  };

  const changeValue = (event: any, literal: string): void => {
    let rows: Row[] = rowsState;

    rows = rows.map((row: Row) => {
      if (row.literal === literal) row.translation = event.target.value;
      return row;
    });

    setRowsState(rows);
  };

  let languagesBody: JSX.Element = ( // List of the languages
    <>
      {languages
        .filter(
          (language: Language) =>
            props.user.allowLanguages.indexOf(language.id) !== -1,
        )
        .map(
          (language: Language): JSX.Element => {
            return (
              <div
                className="language"
                key={language.id}
                onClick={() => selectLanguage(language.id, language.name)}
              >
                <p>{language.name}</p>
              </div>
            );
          },
        )}
    </>
  );

  let body: JSX.Element;
  if (languageIdState === 0) {
    // Show when there isn't a selected language
    body = languagesBody;
  } else {
    body = (
      <>
        {rowsState.map((row: Row, index: number) => {
          return <TranslateRow key={index} row={row} changed={changeValue} />;
        })}
      </>
    );

    body = (
      <>
        <table className="literals__table">
          <thead>
            <tr>
              <th>Literal</th>
              <th>As in</th>
              <th>Translate</th>
            </tr>
          </thead>
          <tbody>{body}</tbody>
        </table>
        <button className="btn-cancel" onClick={() => selectLanguage(0, '')}>
          Cancel
        </button>
        <button className="btn-save">Save</button>
      </>
    );
  }

  return (
    <div className="languages">
      <h1>{languageNameState}</h1>
      <div>{body}</div>
    </div>
  );
};

export default Translate;
