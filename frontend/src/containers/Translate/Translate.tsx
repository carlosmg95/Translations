import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import './Translate.css';
import Dashboard, {
  DashboardBody,
  DashboardHeader,
} from '../../components/Dashboard/Dashboard';
import Translations from '../../components/Translations/Translations';
import NewLiteralRow from '../../components/NewLiteralRow/NewLiteralRow';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Pagination from '../../components/Pagination/Pagination';
import {
  User,
  Translation,
  Literal,
  LiteralTranslation,
  Filter,
  Project,
  Language,
} from '../../types';
import {
  LiteralResponse,
  PagesResponse,
  ProjectResponse,
  TranslationResponse,
} from '../../types-res';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

interface TranslateProps {
  languageIso: string;
  user: User;
  projectName: string;
}

const Translate: React.FC<TranslateProps> = (props: TranslateProps) => {
  let pages: number = 0;

  const [errorState, setErrorState]: [
    // New literal error message
    string,
    Dispatch<SetStateAction<string>>,
  ] = useState('');

  const [pagesState, setPagesState]: [
    // Number of pages
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(pages);

  const [currentPageState, setCurrentPageState]: [
    // The current page
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(1);

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
      literalId: '-1',
      translationId: '-1',
      literal: '',
      as_in: '',
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

  const ADD_NEW_LITERAL = gql`
    mutation CreateTranslation($translation: TranslationCreateInput!) {
      createLiteralTranslation(data: $translation) ${TranslationResponse}
    }
  `;

  const [createTranslation] = useMutation(ADD_NEW_LITERAL);

  const GET_DATA = gql`{
    project(where: { name: "${props.projectName}" }) ${ProjectResponse}
    getLiteralsPages(where: { project: { name: "${props.projectName}" } }) ${PagesResponse}
  }`;

  const { loading, error, data } = useQuery(GET_DATA);

  if (loading) return <div>Loading...</div>;
  if (error) return <ErrorMessage code={500} message={error.message} />;

  pages = data.getLiteralsPages.pages;
  const project: Project = data.project;

  if (pagesState === 0) setPagesState(pages);

  // Set the current page
  const selectPage = (page: number): void => {
    setCurrentPageState(page);
  };

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
          page={currentPageState}
          selectLiterals={selectLiterals}
        />
        <Pagination
          numberPages={pagesState}
          currentPage={currentPageState}
          click={selectPage}
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
