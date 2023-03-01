import { convertLength, shortenPlayCount } from '../../../utilities/functions';
import { useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate, Link } from 'react-router-dom';
import Button from '../../../components/Button';

export default function Album({
  user,
  setNewAlbum,
  getUserData,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  spotifyAPI
}) {
  const [albumData, setAlbumData] = useState({});
  const [albumTracks, setAlbumTracks] = useState({});
  const [albumCredits, setAlbumCredits] = useState({});
  const [newLike, setNewLike] = useState({});

  let { spotifyId } = useParams();
  let albumRunTime = 0;
  let albumPlayCount = 0;

  const getAlbumData = async () => {
    const fetchAlbumData = await fetch(
      `https://spotify23.p.rapidapi.com/albums/?ids=${spotifyId}`,
      spotifyAPI
    );
    const receivedAlbumData = await fetchAlbumData.json();
    setAlbumData(receivedAlbumData);

    const fetchAlbumTracks = await fetch(
      `https://spotify23.p.rapidapi.com/album_tracks/?id=${spotifyId}`,
      spotifyAPI
    );
    const receivedAlbumTracks = await fetchAlbumTracks.json();
    setAlbumTracks(receivedAlbumTracks);
  };

  const getAlbumCredits = async (id) => {
    const fetchAlbumCredits = await fetch(
      `https://spotify23.p.rapidapi.com/track_credits/?id=${id}`,
      spotifyAPI
    );
    const receivedAlbumCredits = await fetchAlbumCredits.json();
    setAlbumCredits(receivedAlbumCredits);
  };

  const createLike = async (e) => {
    e.preventDefault(e);

    try {
      await fetch(`/api/likes/user/${user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...newLike })
      });

      getUserData();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteLike = async (id) => {
    try {
      await fetch(`/api/likes/${id}/${user._id}`, {
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

  if (albumData.albums && albumData.albums[0] && albumTracks.data) {
    albumData.albums[0].tracks.items.map((track) => {
      albumRunTime += track.duration_ms;
    });

    albumData.albums[0].tracks.items.map((track, i) => {
      albumPlayCount += parseInt(
        albumTracks.data.album.tracks.items[i].track.playcount
      );
    });
  }

  useEffect(() => {
    getAlbumData();
  }, []);

  return (
    <div id="container">
      {albumData?.albums?.length ? (
        <>
          <div id="album-header" className="flex">
            <div
              id="album-art"
              style={{
                backgroundImage:
                  'url(' + albumData?.albums[0]?.images[0]?.url + ')'
              }}
            ></div>
            <div id="album-info" className="flex">
              <h1>{albumData?.albums[0]?.name}</h1>

              <div id="album-metadata" className="flex">
                <div className="flex">
                  <div className="flex">
                    {albumData?.albums[0]?.artists.map((artist, i) => {
                      const { id, name, uri } = artist;
                      return (
                        <div className="artist-name">
                          <Link to={`/artist/${id}`}>{name}</Link>
                          <span className="artist-comma">, </span>
                        </div>
                      );
                    })}
                  </div>
                  <span>&bull;</span>
                  {albumData?.albums[0]?.release_date.slice(0, 4)}
                </div>

                <div className="flex">
                  <div className="type">{albumData?.albums[0]?.type}</div>
                  <span>&bull;</span>
                  {albumData?.albums[0]?.total_tracks} tracks
                  <span>&bull;</span>
                  {convertLength(albumRunTime, 100)}
                  <span>&bull;</span>
                  {shortenPlayCount(albumPlayCount)} plays
                </div>
              </div>

              <div id="album-info-buttons" className="flex">
                {user?.albums?.items?.some(
                  (album) =>
                    album.spotifyId === albumData?.albums[0]?.uri.slice(-22)
                ) ? (
                  <>
                    <Button
                      buttonFunction={() => {
                        deleteAlbum(albumData?.albums[0]?.uri.slice(-22));
                      }}
                      buttonIcon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM184 232H328c13.3 0 24 10.7 24 24s-10.7 24-24 24H184c-13.3 0-24-10.7-24-24s10.7-24 24-24z" />
                        </svg>
                      }
                      buttonLabel="Remove From Library"
                    />

                    {user?.albums?.items?.some(
                      (album) =>
                        album.spotifyId ===
                          albumData?.albums[0]?.uri.slice(-22) && album.favorite
                    ) ? (
                      <Button
                        buttonClass="favorite-album-button"
                        buttonFunction={() => {
                          updateAlbum(albumData?.albums[0]?.uri.slice(-22), {
                            favorite: 'false'
                          });
                        }}
                        buttonIcon={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                          >
                            <path
                              class="heart"
                              d="M0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84.02L256 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 .0003 232.4 .0003 190.9L0 190.9z"
                            />
                          </svg>
                        }
                        buttonLabel="Remove From Favorites"
                      />
                    ) : (
                      <Button
                        buttonClass="favorite-album-button"
                        buttonFunction={() => {
                          updateAlbum(albumData?.albums[0]?.uri.slice(-22), {
                            favorite: 'true'
                          });
                        }}
                        buttonIcon={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                          >
                            <path
                              className="heart"
                              d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z"
                            />
                          </svg>
                        }
                        buttonLabel="Add to Favorites"
                      />
                    )}
                  </>
                ) : (
                  <form onSubmit={createAlbum}>
                    <Button
                      buttonFunction={() => {
                        const createAlbumArtists = () => {
                          return albumData?.albums[0].artists?.map(
                            (artist, i) => {
                              return {
                                uri: albumData?.albums[0].artists[i].uri,
                                profile: {
                                  name: albumData?.albums[0].artists[i].name
                                }
                              };
                            }
                          );
                        };

                        const createAlbumCovers = () => {
                          return albumData?.albums[0].images?.map((art, i) => {
                            return {
                              url: albumData?.albums[0].images[i].url
                            };
                          });
                        };

                        setNewAlbum({
                          data: {
                            uri: albumData?.albums[0].uri,
                            name: albumData?.albums[0].name,
                            artists: { items: createAlbumArtists() },
                            coverArt: { sources: createAlbumCovers() },
                            date: {
                              year: parseInt(
                                albumData?.albums[0].release_date.slice(0, 4)
                              )
                            }
                          },
                          spotifyId: albumData?.albums[0].uri.slice(-22),
                          favorite: false
                        });
                      }}
                      buttonIcon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                        </svg>
                      }
                      buttonLabel="Add to Library"
                    />
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* <div>{albumData?.albums[0]?.uri}</div> */}
          <br />
          <br />
          <br />

          <ul id="tracklist">
            {albumData?.albums[0]?.tracks?.items?.map((track, i) => {
              const {
                duration_ms,
                id,
                name,
                artists,
                preview_url,
                track_number
              } = track;

              return (
                <li className="flex" key={`${id}+${i}`}>
                  <div className="section track-info">
                    <div className="audio-player">#{track_number}</div>

                    <div class="track-title-artists">
                      <div class="title">{name}</div>
                      <div class="artists">
                        {artists.map((artist, i) => {
                          const { id, name } = artist;
                          return (
                            <span key={i}>
                              <Link to={`/artist/${id}`}>{name}</Link>
                              <span>, </span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  {/* <div>{preview_url}</div>
                  <div>{track_number}</div> */}

                  <div className="section icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z" />
                    </svg>
                  </div>

                  <div className="section">
                    {albumTracks?.data?.album?.tracks?.items[i]?.track
                      ? shortenPlayCount(
                          albumTracks?.data?.album?.tracks?.items[i]?.track
                            .playcount
                        )
                      : ''}
                  </div>

                  <div className="section">
                    {convertLength(duration_ms, 200)}
                  </div>

                  <div className="section icon like-track">
                    {user?.likes?.items?.some(
                      (like) => like.spotifyId === id
                    ) ? (
                      <Button
                        buttonFunction={() => {
                          deleteLike(id);
                        }}
                        buttonIcon={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                          >
                            <path d="M0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84.02L256 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 .0003 232.4 .0003 190.9L0 190.9z" />
                          </svg>
                        }
                      />
                    ) : (
                      <form onSubmit={createLike}>
                        <Button
                          buttonFunction={() => {
                            const createAlbumArtists = () => {
                              return artists.map((artist, i) => {
                                return {
                                  artistName: artists[i].name,
                                  artistId: artists[i].id
                                };
                              });
                            };

                            setNewLike({
                              data: {
                                albumName: albumData.albums[0].name,
                                trackName: name,
                                albumUri: albumData.albums[0].id,
                                artists: { items: createAlbumArtists() },
                                coverArt: albumData.albums[0].images[0].url,
                                preview: preview_url,
                                playlist: '',
                                duration: convertLength(duration_ms),
                                playCount: shortenPlayCount(
                                  albumTracks?.data?.album?.tracks?.items[i]
                                    ?.track.playcount
                                )
                              },
                              spotifyId: id
                            });
                          }}
                          buttonIcon={
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                            >
                              <path d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z" />
                            </svg>
                          }
                        />
                      </form>
                    )}
                  </div>

                  <div className="section icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M0 256a56 56 0 1 1 112 0A56 56 0 1 1 0 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z" />
                    </svg>
                  </div>
                  {/* <div>
                    <button
                      onClick={() => {
                        getAlbumCredits(id);
                      }}
                    >
                      get credits
                    </button>
                  </div>
                  <br />
                  <br />
                  <br /> */}
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        'hi'
      )}
      {/* <div>{albumData?.albums[0]?.release_date}</div>
      <div>{albumData?.albums[0]?.label}</div> */}
    </div>
  );
}
