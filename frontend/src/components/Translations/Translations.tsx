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
  type newLiteral = {
    literal: string;
    as_in: string;
    translation: string;
  };

  const [newLiteralState, setNewLiteralState]: [
    newLiteral,
    Dispatch<SetStateAction<newLiteral>>,
  ] = useState({ literal: '', as_in: '', translation: '' });

  const changeLiteral = (event: any, key: string): void => {
    newLiteralState[key] = event.target.value;
    setNewLiteralState(newLiteralState);
  };

  const addNewLiteral = (createTranslation): Promise<string> => {
    let { literal, as_in, translation } = newLiteralState;

    as_in = as_in || literal;

    if (literal && !literal.match(/\s|\.|\//gi)) {
      return createTranslation({
        variables: {
          translation: {
            translation: translation,
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
                literal: literal,
                as_in: as_in,
                project: {
                  connect: {
                    name: props.projectName,
                  },
                },
              },
            },
          },
        },
      });
    } else {
      return new Promise((resolve, reject) => {
        reject({ message: 'Empty literal.' });
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
      createLiteralTranslation(data: $translation) {
        id
        translation
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
      <Mutation mutation={CREATE_TRANSLATION}>
        {createTranslation => {
          return (
            <NewLiteralRow
              addNewLiteral={() => addNewLiteral(createTranslation)}
              changeLiteral={changeLiteral}
            />
          );
        }}
      </Mutation>
    </div>
  );
};

export default Translations;
