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

  const spotifyAPI = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': `${process.env.REACT_APP_SPOTIFY_API_KEY}`,
      'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
    }
  };

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
        <Route
          path="/"
          element={user ? <UserLibrary /> : <AuthPage setUser={setUser} />}
        />

        <Route path="/*" element={<PageNotFound />} />

        {user ? (
          <Route
            path="/album/:spotifyId"
            element={<Album spotifyAPI={spotifyAPI} />}
          />
        ) : (
          ''
        )}
      </Routes>
    </>
  );
}

export default App;
