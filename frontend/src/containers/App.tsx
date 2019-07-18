import React, { Component } from 'react';
import './App.css';
import Header from '../components/Header/Header';
import Main from '../components/Main/Main';

class App extends Component {
  render() {
    const user: { admin: boolean } = { admin: true };
    const actions: string[] = user.admin
                                ? ["Translate", "Add new literals", "Add new languages", "Create a new user"]
                                : ["Translate"];
    return (
      <div className="App">
        <Header title="Translations" />
        <Main actions={actions} />
      </div>
    );
  }
}

export default App;
