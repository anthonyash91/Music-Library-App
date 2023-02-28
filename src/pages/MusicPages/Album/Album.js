import {
  convertAlbumLength,
  convertTrackLength,
  shortenPlayCount
} from '../../../utilities/functions';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Album({ spotifyAPI }) {
  const [albumData, setAlbumData] = useState({});
  const [albumTracks, setAlbumTracks] = useState({});
  const [albumCredits, setAlbumCredits] = useState({});

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
    <>
      {convertAlbumLength(albumRunTime)}
      <br />
      {shortenPlayCount(albumPlayCount)}
      <br />
      <br />

      {albumData?.albums
        ? albumData.albums[0]?.tracks?.items?.map((track, i) => {
            const {
              artists,
              duration_ms,
              name,
              preview_url,
              track_number,
              uri
            } = track;
            return <div>{convertTrackLength(duration_ms)}</div>;
          })
        : ''}
    </>
  );
}
