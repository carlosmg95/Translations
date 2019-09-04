import React, { useState, Dispatch, SetStateAction } from 'react';
import './Translate.css';
import Dashboard, {
  DashboardBody,
  DashboardHeader,
} from '../../components/Dashboard/Dashboard';
import Translations from '../../components/Translations/Translations';
import NewLiteralRow from '../../components/NewLiteralRow/NewLiteralRow';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Loading from '../../components/Loading/Loading';
import {
  User,
  LiteralTranslation,
  Filter,
  Project,
  Language,
} from '../../types';
import { ProjectResponse, TranslationResponse } from '../../types-res';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

interface TranslateProps {
  languageIso: string;
  user: User;
  projectName: string;
  page?: number;
  filter?: Filter;
  search?: string;
}

// Changes the values of the query in the URL
const changeQueryValues = (
  query: string,
  key: string,
  newValue: string | number,
): string => {
  let newQuery: string = query.replace(
    new RegExp(`${key}=\\w*`),
    `${key}=${newValue}`,
  );
  return newQuery;
};

const Translate: React.FC<TranslateProps> = (props: TranslateProps) => {
  const [errorState, setErrorState]: [
    // New literal error message
    string,
    Dispatch<SetStateAction<string>>,
  ] = useState('');

  const [currentPageState, setCurrentPageState]: [
    // The current page
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(props.page || 1);

  const [filterState, setFilterState]: [
    // Filter the translations
    Filter,
    Dispatch<SetStateAction<Filter>>,
  ] = useState(props.filter || Filter.ALL);

  const [searchInputState, setSearchInputState]: [
    // The text to search
    string,
    Dispatch<SetStateAction<string>>,
  ] = useState(props.search || '');

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

  const [isThereNewLiteral, setIsThereNewLiteral]: [
    // True when there is a new literal but it isn't on the display and false when it has been displayed
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ] = useState(false);

  const ADD_NEW_LITERAL = gql`
    mutation CreateTranslation($translation: TranslationCreateInput!) {
      createLiteralTranslation(data: $translation) ${TranslationResponse}
    }
  `;

  const [createTranslation] = useMutation(ADD_NEW_LITERAL);

  const GET_PROJECT = gql`{project(where: { name: "${props.projectName}" }) ${ProjectResponse}}`;

  const { loading, error, data } = useQuery(GET_PROJECT);

  if (loading || error) {
    return <Loading errorMessage={error && error.message} errorCode={500} />;
  }

  const project: Project = data.project;

  // Set the current page
  const selectPage = (page: number): void => {
    const originalState: string = window.location.search;
    let state: string = originalState
      ? changeQueryValues(originalState, 'page', page)
      : `?page=${page}`;
    state = state.match(/page/) ? state : `${state}&page=${page}`;
    window.history.replaceState(this, '', state);
    setCurrentPageState(page);
  };

  // Set the search input
  const selectSearchInput = (text: string): void => {
    const originalState: string = window.location.search;
    let state: string = originalState
      ? changeQueryValues(originalState, 'pages', 1)
      : `?page=1&search=${text}`;
    state = changeQueryValues(state, 'search', text);
    state = state.match(/search/) ? state : `${state}&search=${text}`;
    window.history.replaceState(this, '', state);
    selectPage(1);
    setSearchInputState(text);
  };

  // Show all, translated or no translated
  const selectLiterals = (event: any) => {
    const { value } = event.target;
    const originalState: string = window.location.search;
    let state: string = originalState
      ? changeQueryValues(originalState, 'page', 1)
      : `?page=1&filter=${value}`;
    state = changeQueryValues(state, 'filter', value);
    state = state.match(/filter/) ? state : `${state}&filter=${value}`;
    window.history.replaceState(this, '', state);
    selectPage(1);
    switch (value) {
      case `${Filter.TRANSLATED}`:
        setFilterState(Filter.TRANSLATED);
        break;
      case `${Filter.NO_TRANSLATED}`:
        setFilterState(Filter.NO_TRANSLATED);
        break;
      case `${Filter.ALL}`:
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
        .then(() => {
          const literalState: LiteralTranslation = {
            // Reset the new literal row
            translationId: '',
            literalId: '',
            translation: '',
            as_in: '',
            literal: '',
          };
          setNewLiteralState(literalState);
          setIsThereNewLiteral(true);
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
          selectPage={selectPage}
          selectSearch={selectSearchInput}
          filter={filterState}
          searchValue={searchInputState}
          newLiteral={isThereNewLiteral}
          newLiteralShow={() => setIsThereNewLiteral(false)}
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
