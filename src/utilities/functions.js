// spotify api provides album & track lengths in milliseconds so you have to convert them to hour:minute:second format
export function convertAlbumLength(ms) {
  let sec = Math.floor(ms / 1000);
  let hrs = Math.floor(sec / 3600);
  sec -= hrs * 3600;
  let min = Math.floor(sec / 60);
  sec -= min * 60;

  sec = '' + sec;
  sec = ('00' + sec).substring(sec.length);

  if (hrs > 0) {
    min = '' + min;
    min = ('00' + min).substring(min.length);
    return hrs + ' hr ' + min + ' min';
  } else {
    return min + ' min ' + sec + ' sec';
  }
}

export function convertTrackLength(ms) {
  let sec = Math.floor(ms / 1000);
  let hrs = Math.floor(sec / 3600);
  sec -= hrs * 3600;
  let min = Math.floor(sec / 60);
  sec -= min * 60;

  sec = '' + sec;
  sec = ('00' + sec).substring(sec.length);

  if (hrs > 0) {
    min = '' + min;
    min = ('00' + min).substring(min.length);
    return hrs + ':' + min + ':' + sec;
  } else {
    return min + ':' + sec;
  }
}

// for UI purposes, the total play count of an album, which can sometimes be in the billions, needs to be shortened: eg: 1k, 1m, 1b...
export function shortenPlayCount(num) {
  if ((num = num.toString().replace(/[^0-9.]/g, '')) < 1e3) return num;
  let letter = [
      { v: 1e3, s: 'k' },
      { v: 1e6, s: 'm' },
      { v: 1e9, s: 'b' }
    ],
    t;
  for (t = letter.length - 1; t > 0 && !(num >= letter[t].v); t--);
  return (
    (num / letter[t].v).toFixed(1).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') +
    letter[t].s
  );
}
