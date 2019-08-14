import React, { useState, Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import './NewProject.css';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Dashboard, {
  DashboardBody,
  DashboardHeader,
} from '../../components/Dashboard/Dashboard';
import { User, Language, Project } from '../../types';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';

interface NewProjectProps {
  user: User;
  addNewProject(project: Project): void;
}

const NewProject: React.FC<NewProjectProps> = (props: NewProjectProps) => {
  const [nameState, setName]: [
    // Project name
    string,
    Dispatch<SetStateAction<string>>,
  ] = useState('');

  const [usersState, setUsersState]: [
    // List of allowed users
    Set<string>,
    Dispatch<SetStateAction<Set<string>>>,
  ] = useState(new Set());

  const [languagesState, setLanguagesState]: [
    // List of languages in the project
    Set<string>,
    Dispatch<SetStateAction<Set<string>>>,
  ] = useState(new Set());

  const [languageRegex, setLanguageRegex]: [
    // String with a part of the name of a language
    string,
    Dispatch<SetStateAction<string>>,
  ] = useState('');

  const [userRegex, setUserRegex]: [
    // String with a part of the name of an user
    string,
    Dispatch<SetStateAction<string>>,
  ] = useState('');

  const [errorMessageState, setErrorMessageState] = useState({
    // Errors messages
    name: '',
    languages: '',
    users: '',
  });

  // Actions when the form changes
  const changeForm = (event: any) => {
    let errorMessage = { ...errorMessageState };

    if (event.target.className.match(/.*project-name.*/)) {
      // If the name changes
      const name: string = event.target.value;

      if (!name || name.match(/\s|\.|\//gi))
        errorMessage.name = "The name is empty or it's wrong";
      else errorMessage.name = '';

      setName(name);
    } else if (event.target.className.match(/.*project-users__checkbox.*/)) {
      // If an user is selected
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
      // If a language is selected
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
      // If a language is being searched
      setLanguageRegex(event.target.value);
    } else if (event.target.className.match(/.*user-search.*/)) {
      // If an user is being searched
      setUserRegex(event.target.value);
    }

    setErrorMessageState(errorMessage);
  };

  const createNewProject = (mutation): void => {
    let errorMessage = { ...errorMessageState };

    if (!nameState || nameState.match(/\s|\.|\//gi))
      errorMessage.name = "The name is empty or it's wrong";

    if (usersState.size === 0)
      errorMessage.users = 'You must select one user at least';

    if (languagesState.size === 0)
      errorMessage.languages = 'You must select one language at least';

    setErrorMessageState(errorMessage);

    if (errorMessage.languages || errorMessage.users || errorMessage.name)
      return;

    mutation({
      variables: {
        project: {
          name: nameState,
          users: {
            connect: Array.from(usersState).map((userId: string) => {
              return { id: userId };
            }),
          },
          languages: {
            connect: Array.from(languagesState).map((languageId: string) => {
              return { id: languageId };
            }),
          },
        },
      },
    })
      .then(result => {
        const project: Project = result.data.createProject;

        project.translations = [];
        props.addNewProject(project);
      })
      .catch(e => {
        const field = e.message.replace(/.*\s(\w+)$/, '$1');
        const errorMessage = { ...errorMessageState };

        if (field === 'name') {
          errorMessage.name = 'The name cannot be repeated';
          setErrorMessageState(errorMessage);
        }
      });
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

  const CREATE_PROJECT = gql`
    mutation CreateProject($project: ProjectCreateInput!) {
      createProject(data: $project) {
        id
        name
        languages {
          id
          name
          iso
          code
        }
        literals {
          id
        }
        users {
          id
        }
      }
    }
  `;

  if (!props.user.admin) {
    // Only admins can create a new project
    return <ErrorMessage code={403} message="You shouldn't be here!" />;
  }

  return (
    <Dashboard>
      <DashboardHeader
        title="Create new project"
        links={[{ to: '/dashboard', text: 'dashboard' }]}
      />
      <DashboardBody>
        {/* CANCEL BUTTON */}
        <Link to="/dashboard" className="btn btn-cancel">
          Cancel
        </Link>
        {/* SAVE BUTTON */}
        <Mutation mutation={CREATE_PROJECT}>
          {createProject => (
            <Link
              to="/dashboard"
              className="btn btn-save"
              onClick={() => createNewProject(createProject)}
            >
              Save
            </Link>
          )}
        </Mutation>
        {/* FORM */}
        <Query query={USERS_LANGUAGES}>
          {({ data, loading }) => {
            if (loading) {
              return <></>;
            }
            const { users, languages } = data;
            return (
              <form onChange={changeForm} className="new-project__form">
                {/* FORM NAME */}
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
                {/* FORM LANGUAGES */}
                <div className="form-group search-group">
                  {/* SEARCH INPUT */}
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
                  {/* SEARCH RESULTS */}
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
                {/* FORM USERS */}
                <div className="form-group search-group">
                  {/* SEARCH INPUT */}
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
                  {/* SEARCH RESULTS */}
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
