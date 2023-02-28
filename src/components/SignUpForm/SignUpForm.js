import { signUp } from '../../utilities/users-service';
import { useState } from 'react';
import { Uploader } from 'uploader';
import { UploadButton } from 'react-uploader';

export default function SignUpForm({ setUser }) {
  const [formData, setFormData] = useState({
    icon: '',
    name: '',
    email: '',
    password: '',
    confirm: ''
  });

  const [error, setError] = useState('');
  const [userIcon, setUserIcon] = useState('');

  const handleChange = (evt) => {
    setFormData({
      ...formData,
      [evt.target.name]: evt.target.value
    });
    setError('');
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const formDataCopy = { ...formData };
      delete formDataCopy.confirm;
      const user = await signUp(formDataCopy);
      setUser(user);
    } catch (error) {
      setError(
        'Sign up failed. Username and/or email address may already be in use.'
      );
    }
  };

  const uploader = Uploader({
    apiKey: 'public_FW25b3h8aR2hb4QHapA4e1NkptXN'
  });

  const options = {
    multi: false,
    layout: 'modal',
    editor: {
      images: {
        crop: true,
        cropShape: 'rect'
      }
    },
    showFinishButton: true,
    showRemoveButton: false,
    maxFileCount: 1
  };

  const disable = formData.password !== formData.confirm;

  return (
    <form autoComplete="off" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Username"
        required
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email address"
        required
      />

      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />

      <input
        type="password"
        name="confirm"
        value={formData.confirm}
        onChange={handleChange}
        placeholder="Confirm password"
        required
      />

      <UploadButton
        uploader={uploader}
        options={options}
        onComplete={(files) =>
          setUserIcon(files.map((x) => x.fileUrl).join('\n'))
        }
      >
        {({ onClick }) => (
          <button onClick={onClick}>Upload a Profile Photo</button>
        )}
      </UploadButton>

      <button
        type="submit"
        disabled={disable}
        onClick={() => {
          setFormData({
            ...formData,
            icon: `${
              userIcon === ''
                ? 'https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-512x488-rddkk3u9.png'
                : userIcon
            }`
          });
        }}
      >
        Sign Up
      </button>
      {error ? <div className="error-message">{error}</div> : ''}
    </form>
  );
}
