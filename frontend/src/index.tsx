import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./containers/App";
import * as serviceWorker from "./serviceWorker";

import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient, { gql } from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";

import { User } from "./types";
import { UserResponse } from "./types-res";

const client = new ApolloClient({
  uri: process.env.REACT_APP_API_ENDPOINT,
  cache: new InMemoryCache(),
  request: operation => {
    const token = window.localStorage.getItem("authToken");
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ""
      }
    });
  }
});

console.log(`Endpoint: ${process.env.REACT_APP_API_ENDPOINT}`);

client
  .query({
    query: gql`{ loggedUser ${UserResponse} }`
  })
  .then(response => {
    let user: User = response.data.loggedUser;

    ReactDOM.render(
      <ApolloProvider client={client}>
        <BrowserRouter>
          <App user={user} />
        </BrowserRouter>
      </ApolloProvider>,
      document.getElementById("root")
    );

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister();
  })
  .catch(e => {
    console.log(e);
  });
