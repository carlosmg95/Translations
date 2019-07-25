import React, { useState, Dispatch, SetStateAction } from 'react';
import './NewProject.css';
import { User, Language } from '../../types';

interface NewProjectProps {
  users: User[];
  languages: Language[];
  createProject(
    name: string,
    users: string[],
    languages: string[],
  ): Promise<string>;
}

const NewProject: React.FC<NewProjectProps> = (props: NewProjectProps) => {
  const [nameState, setName]: [
    string,
    Dispatch<SetStateAction<string>>,
  ] = useState('');

  const [usersState, setUsersState]: [
    Set<string>,
    Dispatch<SetStateAction<Set<string>>>,
  ] = useState(new Set());

  const [languagesState, setLanguagesState]: [
    Set<string>,
    Dispatch<SetStateAction<Set<string>>>,
  ] = useState(new Set());

  const changeForm = (event: any) => {
    if (event.target.className.match(/.*project-name.*/)) {
      setName(event.target.value);
    } else if (event.target.className.match(/.*project-users__checkbox.*/)) {
      if (event.target.checked) {
        usersState.add(event.target.value);
      } else {
        usersState.delete(event.target.value);
      }
      setUsersState(usersState);
    } else if (
      event.target.className.match(/.*project-languages__checkbox.*/)
    ) {
      if (event.target.checked) {
        languagesState.add(event.target.value);
      } else {
        languagesState.delete(event.target.value);
      }
      setLanguagesState(languagesState);
    }
  };

  let languagesBody: JSX.Element[] = props.languages.map(
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
  let usersBody: JSX.Element[] = props.users.map((user: User) => {
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
      <form onChange={changeForm} className="project-form">
        <div className="form-group">
          <label className="form-item">Name: </label>
          <input className="form-item project-name" type="text" />
        </div>
        <div className="form-group">
          <label className="form-item">Allowed users: </label>
          {usersBody}
        </div>
        <div className="form-group">
          <label className="form-item">Allowed languages: </label>
          {languagesBody}
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
        <button
          type="button"
          className="btn-save"
          onClick={() => {
            props
              .createProject(
                nameState,
                Array.from(usersState),
                Array.from(languagesState),
              )
              .then(() => {
                window.location.href = '/';
              })
              .catch(e => {
                alert('Ha ocurrido un error!');
              });
          }}
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default NewProject;
