import { useState } from 'react';
import * as userService from '../../utilities/users-service';

export default function LoginForm({ setUser }) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (evt) => {
    setCredentials({ ...credentials, [evt.target.name]: evt.target.value });
    setError('');
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const user = await userService.login(credentials);
      setUser(user);
    } catch (error) {
      setError('Sign in failed. Email and/or password may be incorrect.');
    }
  };

  return (
    <form autoComplete="off" onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={credentials.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />

      <input
        type="password"
        name="password"
        value={credentials.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />

      <button type="submit">Login</button>
      {error ? <div className="error-message">{error}</div> : ''}
    </form>
  );
}
