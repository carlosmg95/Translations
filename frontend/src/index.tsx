import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App';
import * as serviceWorker from './serviceWorker';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

import { User, Language, Translation, Literal, Project } from './types';

const httpLink = createHttpLink({
  uri: 'http://localhost:4466',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

client
  .query({
    query: gql`
      {
        users(where: {}) {
          id
          name
          admin
          projects {
            id
          }
          languages {
            id
          }
        }
        projects(where: {}) {
          id
          name
          languages {
            id
          }
        }
        languages(where: {}) {
          id
          name
          iso
        }
        translations(where: {}) {
          id
          language {
            id
          }
          literal {
            id
          }
          project {
            id
          }
          translation
        }
        literals(where: {}) {
          id
          as_in
          project {
            id
          }
          literal
        }
      }
    `,
  })
  .then(response => {
    let { users, literals, translations, languages, projects } = response.data;

    users = users.map((user: any) => {
      user.allowLanguages = user.languages.map(
        (language: Language) => language.id,
      );
      user.allowProjects = user.projects.map((project: Project) => project.id);
      delete user.languages;
      delete user.projects;
      return user;
    });

    literals = literals.map((literal: any) => {
      literal.project_id = literal.project.id;
      delete literal.project;
      return literal;
    });

    projects = projects.map((project: any) => {
      project.languages = project.languages.map(
        (language: Language) => language.id,
      );
      return project;
    });

    translations = translations.map((translation: any) => {
      translation.project_id = translation.project.id;
      translation.literal_id = translation.literal.id;
      translation.lang_id = translation.language.id;
      delete translation.project;
      delete translation.literal;
      delete translation.language;
      return translation;
    });

    const user: User = users.find((user: User) => user.admin) as User;

    ReactDOM.render(
      <ApolloProvider client={client}>
        <App
          user={user}
          users={users}
          projects={projects}
          literals={literals}
          translations={translations}
          languages={languages}
        />
      </ApolloProvider>,
      document.getElementById('root'),
    );

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister();
  })
  .catch(e => {
    console.log(e);
  });
