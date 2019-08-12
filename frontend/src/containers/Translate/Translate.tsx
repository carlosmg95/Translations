import React, { useState, Dispatch, SetStateAction } from 'react';
import './Translate.css';
import Dashboard, {
  DashboardBody,
  DashboardHeader,
} from '../../components/Dashboard/Dashboard';
import Translations from '../../components/Translations/Translations';
import NewLiteralRow from '../../components/NewLiteralRow/NewLiteralRow';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import {
  User,
  Translation,
  Literal,
  LiteralTranslation,
  Filter,
  Project,
} from '../../types';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

interface TranslateProps {
  languageIso: string;
  projectName: string;
  user: User;
  addValueToProjectProperty(
    projectWhereKey: string,
    projectWhereValue: string,
    projectSetKey: string,
    projectSetValue: any,
  ): void;
}

const Translate: React.FC<TranslateProps> = (props: TranslateProps) => {
  let lt: LiteralTranslation[];

  const [errorState, setErrorState]: [
    // New literal error message
    string,
    Dispatch<SetStateAction<string>>,
  ] = useState('');

  const [filterState, setFilterState]: [
    // Filter the translations
    Filter,
    Dispatch<SetStateAction<Filter>>,
  ] = useState(Filter.ALL);

  const [translationsState, setTranslationsState]: [
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

  const [newLiteralState, setNewLiteralState]: [
    // Current value of a new literal
    LiteralTranslation,
    Dispatch<SetStateAction<LiteralTranslation>>,
  ] = useState({
    literalId: '',
    translationId: '',
    literal: '',
    as_in: '',
    translation: '',
  });

  // Show all, translated or no translated
  const selectLiterals = (event: any) => {
    const { value } = event.target;
    switch (value) {
      case 'translated':
        setFilterState(Filter.TRANSLATED);
        break;
      case 'no-translated':
        setFilterState(Filter.NO_TRANSLATED);
        break;
      case 'all':
      default:
        setFilterState(Filter.ALL);
        break;
    }
  };

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
        if (t.literalId === literalId) {
          t.state = translationText ? Filter.TRANSLATED : Filter.NO_TRANSLATED;
          t.translation = translationText;
        }
        return t;
      },
    );
    setTranslationsState(translations);
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

  // Save the current value of the new literal
  const changeLiteral = (event: any, key: string): void => {
    const literalState: LiteralTranslation = { ...newLiteralState };
    literalState[key] = event.target.value;
    setNewLiteralState(literalState);
  };

  // Create a new literal
  const addNewLiteral = (createTranslation): void => {
    let { literal, as_in, translation } = newLiteralState;

    as_in = as_in || literal;

    if (literal && !literal.match(/\s|\.|\//gi)) {
      createTranslation({
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
                iso: props.languageIso,
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
      })
        .then(result => {
          const data = result.data.createLiteralTranslation;
          const translation: LiteralTranslation = {
            translationId: data.id,
            literalId: data.literal.id,
            translation: data.translation,
            as_in: data.literal.as_in,
            literal: data.literal.literal,
            state: data.translation ? Filter.TRANSLATED : Filter.NO_TRANSLATED,
          };
          const translations: LiteralTranslation[] = [
            ...translationsState,
            translation,
          ];
          const literalState: LiteralTranslation = {
            translationId: '0',
            literalId: '0',
            translation: '',
            as_in: '',
            literal: '',
          };
          props.addValueToProjectProperty('name', props.projectName, 'literals', { id: data.literal.id });
          setNewLiteralState(literalState);
          setTranslationsState(translations);
          setErrorState('');
        })
        .catch(e => {
          const errorMessage: string = e.message.replace(/^.+:\s(.+)$/, '$1');
          setErrorState(errorMessage);
        });
    } else {
      setErrorState('Empty or wrong literal.');
    }
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

  const ADD_NEW_LITERAL = gql`
    mutation CreateTranslation($translation: TranslationCreateInput!) {
      createLiteralTranslation(data: $translation) {
        id
        translation
        literal {
          id
          as_in
          literal
        }
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
              state: translationText ? Filter.TRANSLATED : Filter.NO_TRANSLATED,
            };
          });
          if (translationsState[0] && translationsState[0].literalId === '0') {
            setTranslationsState(lt);
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
                  translations={translationsState.filter(
                    (translation: LiteralTranslation) =>
                      filterState === Filter.ALL ||
                      filterState === translation.state,
                  )}
                  changeValue={changeTranslationValue}
                  upsertTranslations={upsertTranslations}
                  selectLiterals={selectLiterals}
                />
                <Mutation mutation={ADD_NEW_LITERAL}>
                  {createTranslation => {
                    return (
                      <NewLiteralRow
                        addNewLiteral={() => addNewLiteral(createTranslation)}
                        changeLiteral={changeLiteral}
                        errorMessage={errorState}
                        literal={newLiteralState.literal}
                        translation={newLiteralState.translation}
                        as_in={newLiteralState.as_in}
                      />
                    );
                  }}
                </Mutation>
              </DashboardBody>
            </Dashboard>
          );
        }
      }}
    </Query>
  );
};

export default Translate;
