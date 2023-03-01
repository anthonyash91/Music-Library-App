import { getUser } from '../../utilities/users-service';
import { logOut } from '../../utilities/users-service';
import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import PageNotFound from '../PageNotFound/PageNotFound';
import AuthPage from '../AuthPage/AuthPage';
import UserLibrary from '../UserPages/UserLibrary/UserLibrary';
import Album from '../MusicPages/Album/Album';

function App() {
  const [user, setUser] = useState(getUser());
  const [newAlbum, setNewAlbum] = useState({});

  const spotifyAPI = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': `${process.env.REACT_APP_SPOTIFY_API_KEY}`,
      'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
    }
  };

  const getUserData = async () => {
    try {
      const response = await fetch(`/api/users/${user._id}`);
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  const createAlbum = async (e) => {
    e.preventDefault(e);

    try {
      await fetch(`/api/albums/user/${user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...newAlbum })
      });

      getUserData();
    } catch (error) {
      console.error(error);
    }
  };

  const updateAlbum = async (id, updatedAlbum) => {
    try {
      await fetch(`/api/albums/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...updatedAlbum })
      });

      getUserData();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAlbum = async (id) => {
    try {
      await fetch(`/api/albums/${id}/${user._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      getUserData();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <h3
        onClick={() => {
          logOut();
          setUser();
        }}
      >
        Logout
      </h3>

      <Routes>
        <Route path="/*" element={<PageNotFound />} />

        {user ? (
          <>
            <Route path="/" element={<UserLibrary />} />
            <Route
              path="/album/:spotifyId"
              element={
                <Album
                  user={user}
                  setNewAlbum={setNewAlbum}
                  getUserData={getUserData}
                  createAlbum={createAlbum}
                  updateAlbum={updateAlbum}
                  deleteAlbum={deleteAlbum}
                  spotifyAPI={spotifyAPI}
                />
              }
            />
          </>
        ) : (
          <Route path="/" element={<AuthPage setUser={setUser} />} />
        )}
      </Routes>
    </>
  );
}

export default App;
