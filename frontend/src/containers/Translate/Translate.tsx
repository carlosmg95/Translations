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
  Language,
} from '../../types';
import { LiteralResponse, ProjectResponse } from '../../types-res';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

interface TranslateProps {
  languageIso: string;
  user: User;
  projectName: string;
}

const Translate: React.FC<TranslateProps> = (props: TranslateProps) => {
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
  ] = useState([]);

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

  const ADD_NEW_LITERAL = gql`
    mutation CreateTranslation($translation: TranslationCreateInput!) {
      createLiteralTranslation(data: $translation) ${LiteralResponse}
    }
  `;

  const [createTranslation] = useMutation(ADD_NEW_LITERAL);

  const GET_PROJECT = gql`{
    project(where: { name: "${props.projectName}" }) ${ProjectResponse}
  }`;

  const { loading, error, data } = useQuery(GET_PROJECT);

  if (loading) return <div>Loading...</div>;
  if (error) return <ErrorMessage code={500} message={error.message} />;

  const project: Project = data.project;

  if (translationsState.length === 0)
    setTranslationsState(
      project
        ? project.literals.map((literal: Literal) => {
            const translation: Translation = project.translations.find(
              translation =>
                translation.literal.id === literal.id &&
                translation.language.iso === props.languageIso,
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
          })
        : [],
    );

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

  // Add a translation when it doesn't exist
  const addTranslation = (
    project: Project,
    id: string,
    literalId: string,
    translationText: string,
  ): Project => {
    project.translations = [
      ...project.translations,
      {
        id,
        language: project.languages.find(
          (lang: Language) => lang.iso === props.languageIso,
        ),
        literal: project.literals.find((lit: Literal) => lit.id === literalId),
        project: project,
        translation: translationText,
      } as Translation,
    ];
    return project;
  };

  // Update a translation when it exists
  const updateTranslation = (
    project: Project,
    literalId: string,
    translationText: string,
  ): Project => {
    project.translations = project.translations.map(
      (translation: Translation) => {
        if (
          translation.literal.id === literalId &&
          translation.language.iso === props.languageIso
        )
          translation.translation = translationText;
        return translation;
      },
    );

    return project;
  };

  // Save data when onBlur
  const upsertTranslations = (
    translationId: string,
    literalId: string,
    languageId: string,
    translationText: string,
    upsert,
  ): void => {
    const originalTranslation: Translation = project.translations.find(
      (t: Translation) =>
        t.literal.id === literalId && t.language.iso === props.languageIso,
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
              name: project.name,
            },
          },
          update: {
            translation: translationText,
          },
        },
      }).then(result => {
        // Update the state of the translations
        let translations: LiteralTranslation[] = translationsState.map(
          (t: LiteralTranslation) => {
            if (t.literalId === literalId) {
              t.state = translationText
                ? Filter.TRANSLATED
                : Filter.NO_TRANSLATED;
              t.translation = translationText;
            }
            return t;
          },
        );
        setTranslationsState(translations);

        // Update the list of projects in App
        let myProject: Project = project;
        if (
          myProject.translations.find(
            (trans: Translation) =>
              trans.literal.id === literalId &&
              trans.language.iso === props.languageIso,
          )
        ) {
          myProject = updateTranslation(myProject, literalId, translationText); // Update a translation when it exists
        } else {
          myProject = addTranslation(
            // Add a new translation when it doesn't exist
            myProject,
            result.data.upsertTranslation.id,
            literalId,
            translationText,
          );
        }
      });
    }
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
              name: project.name,
            },
            language: {
              iso: props.languageIso,
            },
            literal: {
              literal: literal,
              as_in: as_in,
              project: {
                name: project.name,
              },
            },
          },
        },
      })
        .then(result => {
          const data = result.data.createLiteralTranslation;

          const translation: LiteralTranslation = {
            // Create the new object
            translationId: data.id,
            literalId: data.literal.id,
            translation: data.translation,
            as_in: data.literal.as_in,
            literal: data.literal.literal,
            state: data.translation ? Filter.TRANSLATED : Filter.NO_TRANSLATED,
          };
          const translations: LiteralTranslation[] = [
            // Save the object
            ...translationsState,
            translation,
          ];
          setTranslationsState(translations);

          const literalState: LiteralTranslation = {
            // Reset the new literal row
            translationId: '0',
            literalId: '0',
            translation: '',
            as_in: '',
            literal: '',
          };
          setNewLiteralState(literalState);
          setErrorState(''); // Remove errors
        })
        .catch(e => {
          const errorMessage: string = e.message.replace(/^.+:\s(.+)$/, '$1');
          setErrorState(errorMessage);
        });
    } else {
      setErrorState('Empty or wrong literal.');
    }
  };

  const language: Language =
    project &&
    project.languages.find((lang: Language) => lang.iso === props.languageIso);

  if (
    !project ||
    props.user.languages
      .map((lang: Language) => lang.id)
      .indexOf(language.id) === -1 ||
    props.user.projects
      .map((project: Project) => project.id)
      .indexOf(project.id) === -1
  ) {
    return <ErrorMessage code={401} message="You shouldn't be here!" />;
  }

  return (
    <Dashboard>
      <DashboardHeader
        title={language.name}
        links={[
          { to: '/dashboard', text: 'dashboard' },
          {
            to: `/project/${project.name}`,
            text: project.name,
          },
        ]}
      />
      <DashboardBody>
        <Translations
          projectName={project.name}
          languageId={language.id}
          translations={translationsState.filter(
            (translation: LiteralTranslation) =>
              filterState === Filter.ALL || filterState === translation.state,
          )}
          changeValue={changeTranslationValue}
          upsertTranslations={upsertTranslations}
          selectLiterals={selectLiterals}
        />
        <NewLiteralRow
          addNewLiteral={() => addNewLiteral(createTranslation)}
          changeLiteral={changeLiteral}
          errorMessage={errorState}
          literal={newLiteralState.literal}
          translation={newLiteralState.translation}
          as_in={newLiteralState.as_in}
        />
      </DashboardBody>
    </Dashboard>
  );
};

export default Translate;
