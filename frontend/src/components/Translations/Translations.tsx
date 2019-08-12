import React from 'react';
import './Translations.css';
import TranslationRow from './TranslationRow/TranslationRow';
import { LiteralTranslation } from '../../types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

interface TranslationsProps {
  projectName: string;
  languageId: string;
  translations: LiteralTranslation[];
  changeValue(event: any, literalId: string): void;
  upsertTranslations(
    translationId: string,
    literalId: string,
    languageId: string,
    translationText: string,
    upsert,
  ): void;
  selectLiterals(event: any): void;
}

const Translations: React.FC<TranslationsProps> = (
  props: TranslationsProps,
) => {
  const UPSERT_TRANSLATIONS = gql`
    mutation UpsertTranslation(
      $where: TranslationWhereUniqueInput!
      $create: TranslationCreateInput!
      $update: TranslationUpdateInput!
    ) {
      upsertTranslation(where: $where, create: $create, update: $update) {
        id
      }
    }
  `;

  return (
    <div className="Translations">
      <select className="select-filter" onChange={props.selectLiterals}>
        <option value="all">All</option>
        <option value="translated">Translated</option>
        <option value="no-translated">No translated</option>
      </select>
      <div className="translation-row header">
        <p className="translation-row__item literal">Literal</p>
        <p className="translation-row__item as-in">As in</p>
        <p className="translation-row__item translation-text">Translation</p>
      </div>
      {props.translations.map((translation: LiteralTranslation) => (
        <Mutation key={translation.literalId} mutation={UPSERT_TRANSLATIONS}>
          {upsert => (
            <TranslationRow
              literalId={translation.literalId}
              translationId={translation.translationId}
              literal={translation.literal}
              as_in={translation.as_in}
              translation={translation.translation}
              change={props.changeValue}
              blur={(translationId, literalId, translationText) => {
                props.upsertTranslations(
                  translationId,
                  literalId,
                  props.languageId,
                  translationText,
                  upsert,
                );
              }}
            />
          )}
        </Mutation>
      ))}
    </div>
  );
};

export default Translations;
