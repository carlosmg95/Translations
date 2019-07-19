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
  selectedProject: Project | undefined;
}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    const path: string = window.location.pathname.replace(/\/$/, '');

    const projects: Project[] = this.props.projects.filter(
      (project: Project) =>
        this.props.user.allowProjects.indexOf(project.id) !== -1,
    );

    const selectedProject: Project = projects[0];

    this.state = { path, projects, selectedProject };
  }

  selectProject = (event: any): void => {
    const projectId: number = +event.target.value;
    const selectedProject: Project | undefined = this.props.projects.find(
      (project: Project) => project.id === projectId,
    );

    this.setState({ selectedProject });
  };

  render() {
    const projectName: string = this.state.selectedProject
      ? this.state.selectedProject.name
      : '';
    const actions: [string, string][] = this.props.user.admin
      ? [
          ['translate/' + projectName, 'Translate'], // [id, text]
          ['literal', 'Add new literals'],
          ['language', 'Add new languages'],
          ['user', 'Create a new user'],
        ]
      : [['translate/' + projectName, 'Translate']];

    let body: JSX.Element = <div></div>;
    if (this.state.path.match(/\/translate.*/)) {
      body = (
        <Translate
          user={this.props.user}
          translations={this.props.translations}
          literals={this.props.literals}
          languages={this.props.languages}
          projects={this.state.projects}
        />
      );
    } else {
      body = (
        <Main
          actions={actions}
          projects={this.state.projects}
          selectProject={this.selectProject}
        />
      );
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
