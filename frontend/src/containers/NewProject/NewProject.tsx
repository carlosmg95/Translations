import React, { useState, Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import './NewProject.css';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Dashboard, {
  DashboardBody,
  DashboardHeader,
} from '../../components/Dashboard/Dashboard';
import { User, Language } from '../../types';
import { ProjectResponse } from '../../types-res';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

interface NewProjectProps {
  user: User;
}

const NewProject: React.FC<NewProjectProps> = (props: NewProjectProps) => {
  const [nameState, setName]: [
    // Project name
    string,
    Dispatch<SetStateAction<string>>,
  ] = useState('');

  const [repoState, setRepo]: [
    // Project repository
    string,
    Dispatch<SetStateAction<string>>,
  ] = useState('');

  const [branchState, setBranch]: [
    // Project repository branch
    string,
    Dispatch<SetStateAction<string>>,
  ] = useState('');

  const [pathState, setPath]: [
    // Project repository branch
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
    repo: '',
    branch: '',
    path: '',
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
    } else if (event.target.className.match(/.*project-repo.*/)) {
      // If the repo changes
      const repo: string = event.target.value;

      if (!repo || repo.match(/\s/gi))
        errorMessage.repo = "The repository field is empty or it's wrong";
      else errorMessage.repo = '';

      setRepo(repo);
    } else if (event.target.className.match(/.*project-branch.*/)) {
      // If the repo changes
      const branch: string = event.target.value;

      if (!branch || branch.match(/\s/gi))
        errorMessage.branch = "The branch field is empty or it's wrong";
      else errorMessage.branch = '';

      setBranch(branch);
    } else if (event.target.className.match(/.*project-path.*/)) {
      // If the repo changes
      const path: string = event.target.value;

      if (!path || path.match(/\s/gi))
        errorMessage.path = "The path field is empty or it's wrong";
      else errorMessage.path = '';

      setPath(path);
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

  const createNewProject = (mutation, event): void => {
    let errorMessage = { ...errorMessageState };

    if (!nameState || nameState.match(/\s|\.|\//gi))
      errorMessage.name = "The name is empty or it's wrong";

    if (!repoState || repoState.match(/\s/gi))
      errorMessage.repo = "The repository field is empty or it's wrong";

    if (!branchState || branchState.match(/\s|\.|\//gi))
      errorMessage.branch = "The branch field is empty or it's wrong";

    if (!pathState || pathState.match(/\s/gi))
      errorMessage.path = "The path field is empty or it's wrong";

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
          git_name: nameState,
          git_repo: repoState,
          git_branch: branchState,
          git_path: pathState,
          users: Array.from(usersState).map((userId: string) => {
            return { id: userId };
          }),
          languages: Array.from(languagesState).map((languageId: string) => {
            return { id: languageId };
          }),
        },
      },
    })
      .then(() => {
        window.location.href = event.target.href.replace(/^.+\/(\w+)$/, '$1'); // Go to /dashboard
      })
      .catch(e => {
        const errorText = e.message.replace(/^.*:\s(.+)$/, '$1');
        const errorMessage = { ...errorMessageState };

        errorMessage.name = errorText;
        setErrorMessageState(errorMessage);
      });
  };

  const USERS_LANGUAGES = gql`
    {
      users {
        id
        name
      }
      languages {
        id
        iso
        name
      }
    }
  `;

  const CREATE_PROJECT = gql`
    mutation CreateProject($project: ProjectCreateInput!) {
      createProject(data: $project) ${ProjectResponse}
    }
  `;

  const { loading, error, data } = useQuery(USERS_LANGUAGES);
  const [createProject] = useMutation(CREATE_PROJECT);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <ErrorMessage code={500} message="Server error" />;
  }

  const { users, languages } = data;

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
        <Link
          to="/dashboard"
          className="btn btn-save"
          onClick={event => {
            event.preventDefault();
            event.persist();
            createNewProject(createProject, event);
          }}
        >
          Save
        </Link>
        {/* FORM */}
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
          {/* FORM GIT CONFIG */}
          <div className="form-group">
            <label className="form-item">Repository: </label>
            <input
              className="form-item project-repo"
              type="text"
              placeholder="https clone url"
            />
            {errorMessageState.repo ? (
              <small className="error-message-sm">
                {errorMessageState.repo}
              </small>
            ) : (
              ''
            )}
          </div>
          <div className="form-group">
            <label className="form-item">Repository Branch: </label>
            <input className="form-item project-branch" type="text" />
            {errorMessageState.branch ? (
              <small className="error-message-sm">
                {errorMessageState.branch}
              </small>
            ) : (
              ''
            )}
          </div>
          <div className="form-group">
            <label className="form-item">Relative path: </label>
            <input
              className="form-item project-path"
              type="text"
              placeholder="Path to the translations file"
            />
            {errorMessageState.path ? (
              <small className="error-message-sm">
                {errorMessageState.path}
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
                    (languageRegex && language.name.includes(languageRegex)),
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
      </DashboardBody>
    </Dashboard>
  );
};

export default NewProject;
