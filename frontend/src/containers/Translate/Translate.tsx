import React, { useState, Dispatch, SetStateAction } from 'react';
import './Translate.css';
import Dashboard, {
  DashboardBody,
  DashboardHeader,
} from '../../components/Dashboard/Dashboard';
import Translations from '../../components/Translations/Translations';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { User, Translation, Literal, LiteralTranslation } from '../../types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

interface TranslateProps {
  languageIso: string;
  projectName: string;
  user: User;
}

const Translate: React.FC<TranslateProps> = (props: TranslateProps) => {
  let lt: LiteralTranslation[];

  const [translationsState, setTranslationState]: [
    // The most current values
    LiteralTranslation[],
    Dispatch<SetStateAction<LiteralTranslation[]>>,
  ] = useState([
    {
      translationId: '0',
      literalId: '0',
      translation: '',
      as_in: '',
      literal: '',
    },
  ]);

  const [savedTranslationsState, setSavedTranslationState]: [
    // The values saved in DB
    Translation[],
    Dispatch<SetStateAction<Translation[]>>,
  ] = useState([
    {
      id: '0',
      lang_id: '0',
      lit_id: '0',
      project_id: '0',
      translation: '',
    },
  ]);

  // Show all, translated or no translated
  const selectLiterals = (event: any) => {
    const { value } = event.target;
    let translations: LiteralTranslation[] = translationsState;
    if (value === 'all') translations = lt;
    else if (value === 'translated')
      translations = lt.filter((literal: LiteralTranslation) => {
        return literal.translation !== '';
      });
    else if (value === 'no-translated')
      translations = lt.filter((literal: LiteralTranslation) => {
        return literal.translation === '';
      });
    else translations = [];
    setTranslationState(translations);
  };

  // Change the current value when onChange
  const changeValue = (event: any, literalId: string): void => {
    const translations: LiteralTranslation[] = translationsState.map(
      (translation: LiteralTranslation) => {
        if (translation.literalId === literalId)
          translation.translation = event.target.value;
        return translation;
      },
    );
    setTranslationState(translations);
  };

  // Save data when onBlur
  const upsertTranslations = (
    translationId: string,
    literalId: string,
    languageId: string,
    translationText: string,
    upsert,
  ): void => {
    if (
      translationText &&
      translationText !==
        savedTranslationsState.find((t: Translation) => t.lit_id === literalId)
          .translation
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
                id: languageId,
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
    let translations: LiteralTranslation[] = translationsState.map(
      (t: LiteralTranslation) => {
        if (t.literalId === literalId) t.translation = translationText;
        return t;
      },
    );
    setTranslationState(translations);
    setSavedTranslationState(
      translations.map((translation: LiteralTranslation) => ({
        id: translation.translationId,
        lang_id: props.languageIso,
        lit_id: translation.literalId,
        project_id: props.projectName,
        translation: translation.translation,
      })),
    );
  };

  const PROJECT = gql`
    {
      project(where: {
        name:"${props.projectName}"
      }) {
        id
        name
        translations(where: {
          language: {
            iso:"${props.languageIso}"
          }
        }) {
          id
          translation
          language {
            id
            name
          }
          literal {
            id
            literal
          }
        }
        literals {
          id
          literal
          as_in
        }
      }
      language(where: {
        iso:"${props.languageIso}"
      }) {
        id
        name
      }
    }
  `;

  return (
    <Query query={PROJECT}>
      {({ data, loading }) => {
        if (loading) {
          return <div></div>;
        } else {
          if (
            props.user.allowLanguages.indexOf(data.language.id) === -1 ||
            props.user.allowProjects.indexOf(data.project.id) === -1
          ) {
            return <ErrorMessage code={401} message="You shouldn't be here!" />;
          }
          const { literals, translations } = data.project;
          lt = literals.map((literal: Literal) => {
            const translation: Translation = translations.find(
              translation => translation.literal.id === literal.id,
            );
            const translationText = translation ? translation.translation : '';
            const translationId = translation ? translation.id : '0';
            return {
              translationId,
              literalId: literal.id,
              translation: translationText,
              as_in: literal.as_in,
              literal: literal.literal,
            };
          });
          if (translationsState[0] && translationsState[0].literalId === '0') {
            setTranslationState(lt);
            setSavedTranslationState(
              lt.map((translation: LiteralTranslation) => ({
                id: translation.translationId,
                lang_id: props.languageIso,
                lit_id: translation.literalId,
                project_id: props.projectName,
                translation: translation.translation,
              })),
            );
          }
          return (
            <Dashboard>
              <DashboardHeader
                title={data.language.name}
                links={[
                  { to: '/dashboard', text: 'dashboard' },
                  {
                    to: `/project/${props.projectName}`,
                    text: props.projectName,
                  },
                ]}
              />
              <DashboardBody>
                <Translations
                  projectName={props.projectName}
                  languageId={data.language.id}
                  translations={translationsState}
                  changeValue={changeValue}
                  upsertTranslations={upsertTranslations}
                  selectLiterals={selectLiterals}
                />
              </DashboardBody>
            </Dashboard>
          );
        }
      }}
    </Query>
  );
};

export default Translate;
