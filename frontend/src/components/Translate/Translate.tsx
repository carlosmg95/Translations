import React, { Component } from 'react';
import './Translate.css';
import Row from './Row/Row';
import {
  User,
  Language,
  Translation,
  Literal,
  TranslateRow,
} from '../../types';

interface TranslateState {
  languageId: number;
  languageName: string;
  translateRows: TranslateRow[];
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
    this.state = { languageId: 0, languageName: '', translateRows: [] };
  }

  selectLanguage = (id: number, name: string): void => {
    const translations = this.props.translations.filter(
      (translation: Translation) => translation.lang_id === id,
    );

    let translateRows: TranslateRow[] = this.props.literals.map(
      (literal: Literal) => {
        let translateRow: TranslateRow = {
          literal: literal.literal,
          as_in: literal.as_in,
          translation: '',
        };
        let translation: Translation | undefined = translations.find(
          (translation: Translation) => translation.lit_id === literal.id,
        );
        translateRow.translation = translation ? translation.translation : '';
        return translateRow;
      },
    );

    this.setState({ languageId: id, languageName: name, translateRows });
  };

  changeValue = (event: any, literal: string): void => {
    let translateRows: TranslateRow[] = this.state.translateRows;
    let changedRow: TranslateRow | undefined = translateRows.find(
      row => row.literal === literal,
    );
    if (changedRow) changedRow.translation = event.target.value;

    this.setState({ translateRows });
  };

  render() {
    let languages: JSX.Element = (
      <>
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
      </>
    );

    let body: JSX.Element;
    if (this.state.languageId === 0) {
      body = languages;
    } else {
      body = (
        <>
          {this.state.translateRows.map((translateRow, index) => {
            return (
              <Row
                key={index}
                translateRow={translateRow}
                changed={this.changeValue}
              />
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
        <div>{body}</div>
      </div>
    );
  }
}

export default Translate;
