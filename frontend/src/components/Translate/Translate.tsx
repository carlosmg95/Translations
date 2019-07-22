import React, { Component } from 'react';
import './Translate.css';
import TranslateRow from './TranslateRow/TranslateRow';
import { User, Language, Translation, Literal, Row } from '../../types';

interface TranslateState {
  languageId: number;
  languageName: string;
  rows: Row[];
}

interface TranslateProps {
  user: User;
  translations: Translation[];
  literals: Literal[];
  languages: Language[];
}

class Translate extends Component<TranslateProps, TranslateState> {
  constructor(props: TranslateProps) {
    super(props);
    this.state = { languageId: 0, languageName: '', rows: [] };
  }

  selectLanguage = (id: number, name: string): void => {
    const translations = this.props.translations.filter(
      (translation: Translation) => translation.lang_id === id,
    );

    let rows: Row[] = this.props.literals.map((literal: Literal) => {
      let row: Row = {
        literal: literal.literal,
        as_in: literal.as_in,
        translation: '',
      };
      let translation: Translation | undefined = translations.find(
        (translation: Translation) => translation.lit_id === literal.id,
      );
      row.translation = translation ? translation.translation : '';
      return row;
    });

    this.setState({ languageId: id, languageName: name, rows });
  };

  changeValue = (event: any, literal: string): void => {
    let rows: Row[] = this.state.rows;
    let changedRow: Row | undefined = rows.find(row => row.literal === literal);
    if (changedRow) changedRow.translation = event.target.value;

    this.setState({ rows });
  };

  render() {
    let languages: JSX.Element = (
      <div className="languages__list">
        {this.props.languages
          .filter(
            (language: Language) =>
              this.props.user.allowLanguages.indexOf(language.id) !== -1,
          )
          .map(
            (language: Language): JSX.Element => {
              return (
                <div
                  className="language"
                  key={language.id}
                  onClick={() =>
                    this.selectLanguage(language.id, language.name)
                  }
                >
                  <p>{language.name}</p>
                </div>
              );
            },
          )}
      </div>
    );

    let body: JSX.Element;
    if (this.state.languageId === 0) {
      body = languages;
    } else {
      body = (
        <>
          {this.state.rows.map((row, index) => {
            return (
              <TranslateRow key={index} row={row} changed={this.changeValue} />
            );
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
          <button
            className="btn-cancel"
            onClick={() => this.selectLanguage(0, '')}
          >
            Cancel
          </button>
          <button className="btn-save">Save</button>
        </>
      );
    }

    return (
      <div className="languages">
        <h1>{this.state.languageName}</h1>
        {body}
      </div>
    );
  }
}

export default Translate;
