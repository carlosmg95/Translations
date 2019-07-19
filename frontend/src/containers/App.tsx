import React, { Component } from 'react';
import './App.css';
import { User, Language, Translation, Literal, Project } from '../types';
import Header from '../components/Header/Header';
import Main from '../components/Main/Main';
import Translate from '../components/Translate/Translate';

interface AppProps {
  user: User;
  translations: Translation[];
  literals: Literal[];
  languages: Language[];
  projects: Project[];
}

interface AppState {
  path: string;
  projects: Project[];
  selectedProject: number;
}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    let path: string = window.location.pathname.replace(/\/$/, '');
    const projects: Project[] = this.props.projects.filter(
      (project: Project) =>
        this.props.user.allowProjects.indexOf(project.id) !== -1,
    );

    this.state = { path, projects, selectedProject: projects[0].id };
  }

  selectProject = (event: any): void => {
    this.setState({ selectedProject: event.target.value });
  };

  render() {
    const actions: [string, string][] = this.props.user.admin
      ? [
          ['translate', 'Translate'], // [id, text]
          ['literal', 'Add new literals'],
          ['language', 'Add new languages'],
          ['user', 'Create a new user'],
        ]
      : [['translate', 'Translate']];

    let body: JSX.Element = <div></div>;
    switch (this.state.path) {
      case '/':
        body = (
          <Main
            actions={actions}
            projects={this.state.projects}
            selectProject={this.selectProject}
          />
        );
        break;
      case '/translate':
        body = (
          <Translate
            user={this.props.user}
            translations={this.props.translations}
            literals={this.props.literals}
            languages={this.props.languages}
          />
        );
        break;
      default:
        body = (
          <Main
            actions={actions}
            projects={this.state.projects}
            selectProject={this.selectProject}
          />
        );
        break;
    }

    return (
      <div className="App">
        <Header title="Translations" />
        {body}
      </div>
    );
  }
}

export default App;
