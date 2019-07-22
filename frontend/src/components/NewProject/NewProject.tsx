import React, { Component } from 'react';
import './NewProject.css';
import { User, Language } from '../../types';

interface NewProjectState {
  name: string;
  users: any;
  languages: any;
}

interface NewProjectProps {
  users: User[];
  languages: Language[];
}

class NewProject extends Component<NewProjectProps, NewProjectState> {
  constructor(props: NewProjectProps) {
    super(props);
    this.state = { name: '', users: new Set(), languages: new Set() };
  }

  changeForm = (event: any) => {
    if (event.target.className.match(/.*project-name.*/)) {
      this.setState({ name: event.target.value });
    } else if (event.target.className.match(/.*project-users__checkbox.*/)) {
      let users: any = this.state.users;
      if (event.target.checked) {
        users.add(event.target.value);
      } else {
        users.delete(event.target.value);
      }
      this.setState({ users });
    } else if (
      event.target.className.match(/.*project-languages__checkbox.*/)
    ) {
      let languages: any = this.state.languages;
      if (event.target.checked) {
        languages.add(event.target.value);
      } else {
        languages.delete(event.target.value);
      }
      this.setState({ languages });
    }
  };

  render() {
    let languages: JSX.Element[] = this.props.languages.map(
      (language: Language) => {
        return (
          <label key={language.id} className="form-item">
            <input
              className="project-languages__checkbox"
              type="checkbox"
              value={language.id}
            />{' '}
            {language.name}
          </label>
        );
      },
    );
    let users: JSX.Element[] = this.props.users.map((user: User) => {
      return (
        <label key={user.id} className="form-item">
          <input
            className="project-users__checkbox"
            type="checkbox"
            value={user.id}
          />{' '}
          {user.name}
        </label>
      );
    });

    return (
      <div className="new-project">
        <h1>Create a new project</h1>
        <form onChange={this.changeForm} className="project-form">
          <div className="form-group">
            <label className="form-item">Name: </label>
            <input className="form-item project-name" type="text" />
          </div>
          <div className="form-group">
            <label className="form-item">Allowed users: </label>
            {users}
          </div>
          <div className="form-group">
            <label className="form-item">Allowed languages: </label>
            {languages}
          </div>
          <button
            type="button"
            onClick={() => {
              window.location.href = '/';
            }}
            className="btn-cancel"
          >
            Cancel
          </button>
          <button type="button" className="btn-save">
            Save
          </button>
        </form>
      </div>
    );
  }
}

export default NewProject;
