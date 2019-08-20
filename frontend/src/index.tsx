import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './containers/App';
import * as serviceWorker from './serviceWorker';

import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient, { gql } from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { ProjectResponse, UserResponse } from './types-res';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
});

client
  .query({
    query: gql`
      {
        user(where: { name: "admin" }) ${UserResponse}
        projects(where: { users_some: { name: "admin" } }) ${ProjectResponse}
      }
    `,
  })
  .then(response => {
    let { user, projects } = response.data;

    ReactDOM.render(
      <ApolloProvider client={client}>
        <BrowserRouter>
          <App user={user} projects={projects} />
        </BrowserRouter>
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
