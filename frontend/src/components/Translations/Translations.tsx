import React, { useState, Dispatch, SetStateAction } from 'react';
import './Translations.css';
import TranslationRow from './TranslationRow/TranslationRow';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Pagination from '../../components/Pagination/Pagination';
import { Filter, Literal, LiteralTranslation, Translation } from '../../types';
import {
  LiteralResponse,
  PagesResponse,
  TranslationResponse,
} from '../../types-res';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

interface TranslationsProps {
  projectName: string;
  languageId: string;
  page: number;
  filter: Filter;
  selectLiterals(event: any): void;
  selectPage(page: number): void;
}

const equalTranslations = (
  lt1: LiteralTranslation[],
  lt2: LiteralTranslation[],
): boolean => {
  let equals: boolean = true;
  if (lt1.length !== lt2.length) {
    equals = false;
  }
  lt1.forEach((value: LiteralTranslation, index: number) => {
    if (!lt2[index] || value.literalId !== lt2[index].literalId) {
      equals = false;
    }
  });
  return equals;
};

const Translations: React.FC<TranslationsProps> = (
  props: TranslationsProps,
) => {
  const [translationsState, setTranslationsState]: [
    // The most current values
    LiteralTranslation[],
    Dispatch<SetStateAction<LiteralTranslation[]>>,
  ] = useState([
    {
      literalId: '-1',
      translationId: '-1',
      literal: '',
      as_in: '',
      translation: '',
    },
  ]);

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

  const [upsert] = useMutation(UPSERT_TRANSLATIONS);

  const GET_DATA = gql`{
    literals(
      where: {
        project: { name: "${props.projectName}" },
        language: { id: "${props.languageId}" }
      },
      page: ${props.page},
      filter: ${props.filter}
    ) ${LiteralResponse}
    translations(
      where: {
        project: { name: "${props.projectName}" },
        language: { id: "${props.languageId}" }
      }
    ) ${TranslationResponse}
    getLiteralsPages(
      where: {
        project: { name: "${props.projectName}" },
        language: { id: "${props.languageId}" }
      },
      filter: ${props.filter}
    ) ${PagesResponse}
  }`;

  const { loading, error, data } = useQuery(GET_DATA);

  if (loading) return <div>Loading...</div>;
  if (error) return <ErrorMessage code={500} message={error.message} />;

  const pages = data.getLiteralsPages.pages;
  const literals: Literal[] = data.literals;
  const translations: Translation[] = data.translations;
  const lt: LiteralTranslation[] = literals.map((literal: Literal) => {
    const translation: Translation = translations.find(
      (translation: Translation) =>
        translation.literal.id === literal.id &&
        translation.language.id === props.languageId,
    );
    const translationText = translation ? translation.translation : '';
    const translationId = translation ? translation.id : '0';
    return {
      translationId,
      literalId: literal.id,
      translation: translationText,
      as_in: literal.as_in,
      literal: literal.literal,
      state: translationText ? Filter.TRANSLATED : Filter.NO_TRANSLATED,
    };
  });

  if (!equalTranslations(lt, translationsState)) {
    setTranslationsState(lt);
  }

  // Change the current value of a translation when onChange
  const changeTranslationValue = (event: any, literalId: string): void => {
    const translations: LiteralTranslation[] = translationsState.map(
      (translation: LiteralTranslation) => {
        if (translation.literalId === literalId)
          translation.translation = event.target.value;
        return translation;
      },
    );
    setTranslationsState(translations);
  };

  // Save data when onBlur
  const upsertTranslations = (
    translationId: string,
    literalId: string,
    languageId: string,
    translationText: string,
  ): void => {
    const originalTranslation: Translation = translations.find(
      (t: Translation) =>
        t.literal.id === literalId && t.language.id === props.languageId,
    );
    const originalTranslationText: string = originalTranslation
      ? originalTranslation.translation
      : '';
    if (
      translationText && // If there is text
      translationText !== originalTranslationText // and the text is different to the saved data
    ) {
      upsert({
        variables: {
          where: {
            id: translationId,
          },
          create: {
            translation: translationText,
            language: {
              id: languageId,
            },
            literal: {
              id: literalId,
            },
            project: {
              name: props.projectName,
            },
          },
          update: {
            translation: translationText,
          },
        },
      });
    }
  };

  return (
    <div className="Translations">
      <select
        className="select-filter"
        onChange={props.selectLiterals}
        defaultValue={`${props.filter}`}
      >
        <option value={Filter.ALL}>All</option>
        <option value={Filter.TRANSLATED}>Translated</option>
        <option value={Filter.NO_TRANSLATED}>No translated</option>
      </select>
      <div className="translation-row header">
        <p className="translation-row__item literal">Literal</p>
        <p className="translation-row__item as-in">As in</p>
        <p className="translation-row__item translation-text">Translation</p>
      </div>
      {translationsState.map((translation: LiteralTranslation) => (
        <TranslationRow
          key={translation.literalId}
          literalId={translation.literalId}
          translationId={translation.translationId}
          literal={translation.literal}
          as_in={translation.as_in}
          translation={translation.translation}
          change={changeTranslationValue}
          blur={(translationId, literalId, translationText) => {
            upsertTranslations(
              translationId,
              literalId,
              props.languageId,
              translationText,
            );
          }}
        />
      ))}
      <Pagination
        numberPages={pages}
        currentPage={props.page}
        click={props.selectPage}
      />
    </div>
  );
};

export default Translations;
