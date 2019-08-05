import React, { useState, Dispatch, SetStateAction } from 'react';
import './Translations.css';
import TranslationRow from './TranslationRow/TranslationRow';
import { LiteralTranslation } from '../../types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

interface TranslationsProps {
  projectName: string;
  languageId: string;
  translations: LiteralTranslation[];
}

const Translations: React.FC<TranslationsProps> = (
  props: TranslationsProps,
) => {
  const translationsMap: Map<string, string> = new Map();
  props.translations.forEach((translation: LiteralTranslation) => {
    translationsMap.set(translation.translationId, translation.translation);
  });
  const [rowsState, setRowsState]: [
    Map<string, string>,
    Dispatch<SetStateAction<Map<string, string>>>,
  ] = useState(translationsMap);

  const [lastSavedDataState, setLastSavedDataState]: [
    Map<string, string>,
    Dispatch<SetStateAction<Map<string, string>>>,
  ] = useState(translationsMap);

  const changeValue = (event: any, translationId: string): void => {
    let rows: Map<string, string> = new Map(rowsState);
    rows.set(translationId, event.target.value);
    setRowsState(rows);
  };

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

  const upsertTranslations = (
    translationId,
    literalId,
    translationText,
    upsert,
  ): void => {
    if (
      translationText &&
      translationText !== lastSavedDataState.get(translationId)
    ) {
      upsert({
        variables: {
          where: {
            id: translationId,
          },
          create: {
            translation: translationText,
            language: {
              connect: {
                id: props.languageId,
              },
            },
            literal: {
              connect: {
                id: literalId,
              },
            },
            project: {
              connect: {
                name: props.projectName,
              },
            },
          },
          update: {
            translation: translationText,
          },
        },
      });
    }
    let rows: Map<string, string> = new Map(lastSavedDataState);
    rows.set(translationId, translationText);
    setLastSavedDataState(rows);
  };

  return (
    <div className="Translations">
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
              translation={rowsState.get(translation.translationId)}
              change={changeValue}
              blur={(translationId, literalId, translationText) => {
                upsertTranslations(
                  translationId,
                  literalId,
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