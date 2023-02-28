import { useState } from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import SignUpForm from '../../components/SignUpForm/SignUpForm';

export default function AuthPage({ setUser }) {
  const [loginOrSignup, setLoginOrSignup] = useState('login');

  return (
    <>
      {loginOrSignup === 'login' ? (
        <>
          <LoginForm setUser={setUser} />
          <div
            onClick={() => {
              setLoginOrSignup('sign up');
            }}
          >
            Sign Up
          </div>
        </>
      ) : (
        <>
          <SignUpForm setUser={setUser} />
          <div
            onClick={() => {
              setLoginOrSignup('login');
            }}
          >
            Login
          </div>
        </>
      )}
    </>
  );
}
