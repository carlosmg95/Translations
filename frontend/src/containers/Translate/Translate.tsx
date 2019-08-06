import React, { useState, Dispatch, SetStateAction } from 'react';
import './Translate.css';
import Dashboard, {
  DashboardBody,
  DashboardHeader,
} from '../../components/Dashboard/Dashboard';
import Translations from '../../components/Translations/Translations';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import {
  User,
  Language,
  Translation,
  Literal,
  Project,
  LiteralTranslation,
} from '../../types';
import UserContext from '../../context/user-context';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

interface TranslateProps {
  [propName: string]: any;
}

const Translate: React.FC<TranslateProps> = (props: TranslateProps) => {
  enum Filter {
    all,
    translated,
    noTranslated,
  }
  const [filterState, setFilterState]: [
    Filter,
    Dispatch<SetStateAction<Filter>>,
  ] = useState(Filter.all);

  const { languageIso, projectName } = props.match.params;

  const selectLiterals = (event: any) => {
    const { value } = event.target;
    if (value === 'all') setFilterState(Filter.all);
    else if (value === 'translated') setFilterState(Filter.translated);
    else if (value === 'no-translated') setFilterState(Filter.noTranslated);
  };

  const PROJECT = gql`
    {
      project(where: {
        name:"${projectName}"
      }) {
        id
        name
        translations(where: {
          language: {
            iso:"${languageIso}"
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
        iso:"${languageIso}"
      }) {
        id
        name
      }
    }
  `;

  return (
    <UserContext.Consumer>
      {({ user }) => (
        <Query query={PROJECT}>
          {({ data, loading }) => {
            if (loading) {
              return <div></div>;
            } else {
              if (
                user.allowLanguages.indexOf(data.language.id) === -1 ||
                user.allowProjects.indexOf(data.project.id) === -1
              ) {
                return (
                  <ErrorMessage code={401} message="You shouldn't be here!" />
                );
              }
              const { literals, translations } = data.project;
              const lt: LiteralTranslation[] = literals
                .map((literal: Literal) => {
                  const translation: Translation = translations.find(
                    translation => translation.literal.id === literal.id,
                  );
                  const translationText = translation
                    ? translation.translation
                    : '';
                  const translationId = translation ? translation.id : '0';
                  return {
                    translationId,
                    literalId: literal.id,
                    translation: translationText,
                    as_in: literal.as_in,
                    literal: literal.literal,
                  };
                })
                .filter((literal: LiteralTranslation) => {
                  if (filterState === Filter.all) {
                    return true;
                  } else if (filterState === Filter.translated) {
                    return literal.translation !== '';
                  } else if (filterState === Filter.noTranslated) {
                    return literal.translation === '';
                  }
                });
              return (
                <Dashboard>
                  <DashboardHeader
                    title={data.language.name}
                    links={[
                      { to: '/dashboard', text: 'dashboard' },
                      { to: `/project/${projectName}`, text: projectName },
                    ]}
                  />
                  <DashboardBody>
                    <Translations
                      projectName={projectName}
                      languageId={data.language.id}
                      translations={lt}
                      selectLiterals={selectLiterals}
                    />
                  </DashboardBody>
                </Dashboard>
              );
            }
          }}
        </Query>
      )}
    </UserContext.Consumer>
  );
};

export default Translate;
