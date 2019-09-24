import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import './Login.css';
import PillButton from '../../components/PillButton/PillButton';
import Dashboard, { DashboardBody } from '../../components/Dashboard/Dashboard';
import { UserResponse } from '../../types-res';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

interface Login {
  signup?: boolean;
}

const Login: React.FC<Login> = (props: Login) => {
  const [usernameState, setUsernameState]: [
    string,
    Dispatch<SetStateAction<string>>,
  ] = useState('');

  const [usernameErrorState, setUsernameErrorState]: [
    string,
    Dispatch<SetStateAction<string>>,
  ] = useState('');

  const [passwordState, setPasswordState]: [
    string,
    Dispatch<SetStateAction<string>>,
  ] = useState('');

  const [passwordErrorState, setPasswordErrorState]: [
    string,
    Dispatch<SetStateAction<string>>,
  ] = useState('');

  const [repeatedPasswordState, setRepeatedPasswordState]: [
    string,
    Dispatch<SetStateAction<string>>,
  ] = useState('');

  const [repeatedPasswordErrorState, setRepeatedPasswordErrorState]: [
    string,
    Dispatch<SetStateAction<string>>,
  ] = useState('');

  const CREATE_USER = gql`
    mutation CreateUser($name: String!, $password: String!, $repeatedPassword: String!) {
      createUser(data: {
        name: $name,
        password: $password,
        repeatedPassword: $repeatedPassword
      }) ${UserResponse}
    }
  `;

  const Login = gql`
    mutation login($username: String!, $password: String!) {
      login(username: $username, password: $password)
    }
  `;

  const [createUserMutation] = useMutation(CREATE_USER);
  const [loginMutation] = useMutation(Login);

  const passwordError = (): boolean => {
    if (passwordState === repeatedPasswordState) {
      setRepeatedPasswordErrorState('');
    }

    if (!passwordState) {
      setPasswordErrorState('The password cannot be empty.');
      return true;
    } else {
      setPasswordErrorState('');
      return false;
    }
  };

  const repeatedPasswordError = (): boolean => {
    if (!repeatedPasswordState) {
      setRepeatedPasswordErrorState('The password cannot be empty.');
      return true;
    } else if (passwordState !== repeatedPasswordState) {
      setRepeatedPasswordErrorState("The passwords don't match.");
      return true;
    } else {
      setRepeatedPasswordErrorState('');
      return false;
    }
  };

  const usernameError = (): boolean => {
    if (!usernameState) {
      setUsernameErrorState('The username cannot be empty.');
      return true;
    } else {
      setUsernameErrorState('');
      return false;
    }
  };

  const createUser = async () => {
    if (usernameError() || passwordError() || repeatedPasswordError()) {
      return;
    }

    createUserMutation({
      variables: {
        name: usernameState,
        password: passwordState,
        repeatedPassword: passwordState,
      },
    })
      .then(result => {
        login();
      })
      .catch(e => {
        const errorMessage: string = e.message.replace(/^.+:\s(.+)$/, '$1');
        setUsernameErrorState(errorMessage);
      });
  };

  const login = async () => {
    if (usernameError() || passwordError()) {
      return;
    }

    loginMutation({
      variables: {
        username: usernameState,
        password: passwordState,
      },
    })
      .then(result => {
        const token: string = result.data.login;
        window.localStorage.setItem('authToken', token);
        window.location.href = '/dashboard';
      })
      .catch(e => {
        const errorMessage: string = e.message.replace(/^.+:\s(.+)$/, '$1');
        setPasswordErrorState(errorMessage);
      });
  };

  useEffect(() => {
    usernameError();
  }, [usernameState]);

  useEffect(() => {
    passwordError();
  }, [passwordState]);

  useEffect(() => {
    repeatedPasswordError();
  }, [repeatedPasswordState]);

  useEffect(() => {
    setUsernameErrorState('');
    setPasswordErrorState('');
    setRepeatedPasswordErrorState('');
  }, []);

  return (
    <Dashboard>
      <DashboardBody>
        <div className="Login">
          <div className="block">
            <form onSubmit={event => event.preventDefault()}>
              {props.signup ? (
                <>
                  <h1>Sign up</h1>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Username"
                      value={usernameState}
                      onChange={event => setUsernameState(event.target.value)}
                    />
                    <small className="error-message-sm">
                      {usernameErrorState}
                    </small>
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      placeholder="Password"
                      value={passwordState}
                      onChange={event => setPasswordState(event.target.value)}
                    />
                    <small className="error-message-sm">
                      {passwordErrorState}
                    </small>
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      placeholder="Repeate password"
                      value={repeatedPasswordState}
                      onChange={event =>
                        setRepeatedPasswordState(event.target.value)
                      }
                    />
                    <small className="error-message-sm">
                      {repeatedPasswordErrorState}
                    </small>
                  </div>
                  <div className="buttons">
                    <PillButton
                      type="submit"
                      className="btn new-user-btn"
                      text="Create new user"
                      onClick={createUser}
                    />
                  </div>
                </>
              ) : (
                <>
                  <h1>Sign in</h1>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Username"
                      value={usernameState}
                      onChange={event => setUsernameState(event.target.value)}
                    />
                    <small className="error-message-sm">
                      {usernameErrorState}
                    </small>
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      placeholder="Password"
                      value={passwordState}
                      onChange={event => setPasswordState(event.target.value)}
                    />
                    <small className="error-message-sm">
                      {passwordErrorState}
                    </small>
                  </div>
                  <div className="buttons">
                    <PillButton
                      type="submit"
                      className="btn login-btn"
                      text="Sign in"
                      onClick={login}
                    />
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </DashboardBody>
    </Dashboard>
  );
};

export default Login;
