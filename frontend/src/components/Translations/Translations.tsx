import React, { useState, Dispatch, SetStateAction } from 'react';
import './Translations.css';
import TranslationRow from './TranslationRow/TranslationRow';
import NewLiteralRow from './NewLiteralRow/NewLiteralRow';
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
    translationsMap.set(translation.literalId, translation.translation);
  });

  type newLiteral = {
    literal: string;
    as_in: string;
    translation: string;
  };

  const [rowsState, setRowsState]: [
    Map<string, string>,
    Dispatch<SetStateAction<Map<string, string>>>,
  ] = useState(translationsMap);

  const [lastSavedDataState, setLastSavedDataState]: [
    Map<string, string>,
    Dispatch<SetStateAction<Map<string, string>>>,
  ] = useState(translationsMap);

  const [newLiteralState, setNewLiteralState]: [
    newLiteral,
    Dispatch<SetStateAction<newLiteral>>,
  ] = useState({ literal: '', as_in: '', translation: '' });

  const changeValue = (event: any, literalId: string): void => {
    let rows: Map<string, string> = new Map(rowsState);
    rows.set(literalId, event.target.value);
    setRowsState(rows);
  };

  const changeLiteral = (event: any, key: string): void => {
    newLiteralState[key] = event.target.value;
    setNewLiteralState(newLiteralState);
  };

  const addNewLiteral = (createTranslation): void => {
    const { literal, as_in, translation } = newLiteralState;

    if (literal && as_in && !literal.match(/\s|\.|\//gi)) {
      createTranslation({
        variables: {
          translation: {
            translation: newLiteralState.translation,
            project: {
              connect: {
                name: props.projectName,
              },
            },
            language: {
              connect: {
                id: props.languageId,
              },
            },
            literal: {
              create: {
                literal: newLiteralState.literal,
                as_in: newLiteralState.as_in,
                project: {
                  connect: {
                    name: props.projectName,
                  },
                },
              },
            },
          },
        },
      }).then(() => {
        window.location.reload();
      });
    }
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

  const CREATE_TRANSLATION = gql`
    mutation CreateTranslation($translation: TranslationCreateInput!) {
      createTranslation(data: $translation) {
        id
        translation
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
      translationText !== lastSavedDataState.get(literalId)
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
    rows.set(literalId, translationText);
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
              translation={rowsState.get(translation.literalId)}
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
      <Mutation mutation={CREATE_TRANSLATION}>
        {createTranslation => {
          return (
            <NewLiteralRow
              addNewLiteral={() => {
                addNewLiteral(createTranslation)
              }}
              changeLiteral={changeLiteral}
            />
          );
        }}
      </Mutation>
    </div>
  );
};

export default Translations;
