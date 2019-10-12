// https://api.themoviedb.org/3/movie/550?api_key=9f6c1972f43992dca31c9d465f1363cc
const api = 'https://api.themoviedb.org/3';
const key = '9f6c1972f43992dca31c9d465f1363cc';

const defaultContent = {
  api_key: key,
  language: 'en-US'
};

function queryString(obj) {
  return Object.entries(obj)
    .map(([index, val]) => `${index}=${val}`)
    .join('&');
}

export default async function request(url, content = {}, debug = false) {
  const obj = { ...defaultContent, ...content };

  const response = await fetch(`${api}/${url}?${queryString(obj)}`);
  const data = await (debug ? response.status : response.json());

  return data;
}