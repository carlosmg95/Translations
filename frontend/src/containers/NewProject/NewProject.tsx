import React, { useState, Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import './NewProject.css';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Dashboard, {
  DashboardBody,
  DashboardHeader,
} from '../../components/Dashboard/Dashboard';
import { User, Language } from '../../types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

interface NewProjectProps {
  user: User;
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

  const [languageRegex, setLanguageRegex]: [
    string,
    Dispatch<SetStateAction<string>>,
  ] = useState('');

  const [userRegex, setUserRegex]: [
    string,
    Dispatch<SetStateAction<string>>,
  ] = useState('');

  const [errorMessageState, setErrorMessageState] = useState({
    name: '',
    languages: '',
    users: '',
  });

  const changeForm = (event: any) => {
    let errorMessage = { ...errorMessageState };

    if (event.target.className.match(/.*project-name.*/)) {
      const name: string = event.target.value;
      if (!name || name.match(/\s|\.|\//gi))
        errorMessage.name = "The name is empty or it's wrong";
      else errorMessage.name = '';
      setName(name);
    } else if (event.target.className.match(/.*project-users__checkbox.*/)) {
      let users: Set<string> = new Set(usersState);
      if (event.target.checked) {
        users.add(event.target.value);
      } else {
        users.delete(event.target.value);
      }
      if (users.size === 0)
        errorMessage.users = 'You must select one user at least';
      else errorMessage.users = '';
      setUsersState(users);
    } else if (
      event.target.className.match(/.*project-languages__checkbox.*/)
    ) {
      let languages: Set<string> = new Set(languagesState);
      if (event.target.checked) {
        languages.add(event.target.value);
      } else {
        languages.delete(event.target.value);
      }
      if (languages.size === 0)
        errorMessage.languages = 'You must select one language at least';
      else errorMessage.languages = '';
      setLanguagesState(languages);
    } else if (event.target.className.match(/.*language-search.*/)) {
      setLanguageRegex(event.target.value);
    } else if (event.target.className.match(/.*user-search.*/)) {
      setUserRegex(event.target.value);
    }

    setErrorMessageState(errorMessage);
  };

  const USERS_LANGUAGES = gql`
    {
      users(where: {}) {
        id
        name
      }
      languages(where: {}) {
        id
        iso
        name
      }
    }
  `;

  if (!props.user.admin) {
    return <ErrorMessage code={403} message="You shouldn't be here!" />;
  }

  return (
    <Dashboard>
      <DashboardHeader
        title="Create new project"
        links={[{ to: '/dashboard', text: 'dashboard' }]}
      />
      <DashboardBody>
        <Link to="/dashboard">
          <button type="button" className="btn-cancel">
            Cancel
          </button>
        </Link>
        <button
          type="button"
          className="btn-save"
          onClick={() => {
            let errorMessage = { ...errorMessageState };

            if (!nameState || nameState.match(/\s|\.|\//gi))
              errorMessage.name = "The name is empty or it's wrong";
            if (usersState.size === 0)
              errorMessage.users = 'You must select one user at least';
            if (languagesState.size === 0)
              errorMessage.languages = 'You must select one language at least';

            setErrorMessageState(errorMessage);
            // TODO: SAVE DATA
            /*props
              .createProject(
                nameState,
                Array.from(usersState),
                Array.from(languagesState),
              )
              .then(() => {
                window.location.href = '/';
              })
              .catch(e => {
                const field = e.message.replace(/.*\s(\w+)$/, '$1');
                if (field === 'name') {
                  setErrorMessageState(
                    'The name must be filled and it cannot be repeated',
                  );
                }
              });*/
          }}
        >
          Save
        </button>
        <Query query={USERS_LANGUAGES}>
          {({ data, loading }) => {
            if (loading) {
              return <></>;
            }
            const { users, languages } = data;
            return (
              <form onChange={changeForm} className="new-project__form">
                <div className="form-group">
                  <label className="form-item">Name: </label>
                  <input className="form-item project-name" type="text" />
                  {errorMessageState.name ? (
                    <small className="error-message-sm">
                      {errorMessageState.name}
                    </small>
                  ) : (
                    ''
                  )}
                </div>
                <div className="form-group search-group">
                  <div className="input-search">
                    <input
                      className="form-item search language-search"
                      type="text"
                      placeholder="language"
                    />
                  </div>
                  {errorMessageState.languages ? (
                    <small className="error-message-sm">
                      {errorMessageState.languages}
                    </small>
                  ) : (
                    ''
                  )}
                  <div className="result-search">
                    {languages
                      .filter(
                        (language: Language) =>
                          (!languageRegex && languagesState.has(language.id)) ||
                          (languageRegex &&
                            language.name.includes(languageRegex)),
                      )
                      .map((language: Language) => (
                        <label
                          key={language.id}
                          className="form-item project-languages__label"
                        >
                          <input
                            className="project-languages__checkbox"
                            type="checkbox"
                            value={language.id}
                            defaultChecked={languagesState.has(language.id)}
                          />{' '}
                          {language.name}
                        </label>
                      ))}
                  </div>
                </div>
                <div className="form-group search-group">
                  <div className="input-search">
                    <input
                      className="form-item search user-search"
                      type="text"
                      placeholder="user"
                    />
                  </div>
                  {errorMessageState.users ? (
                    <small className="error-message-sm">
                      {errorMessageState.users}
                    </small>
                  ) : (
                    ''
                  )}
                  <div className="result-search">
                    {users
                      .filter(
                        (user: User) =>
                          (!userRegex && usersState.has(user.id)) ||
                          (userRegex && user.name.includes(userRegex)),
                      )
                      .map((user: Language) => (
                        <label
                          key={user.id}
                          className="form-item project-users__label"
                        >
                          <input
                            className="project-users__checkbox"
                            type="checkbox"
                            value={user.id}
                            defaultChecked={usersState.has(user.id)}
                          />{' '}
                          {user.name}
                        </label>
                      ))}
                  </div>
                </div>
              </form>
            );
          }}
        </Query>
      </DashboardBody>
    </Dashboard>
  );
};

export default NewProject;
