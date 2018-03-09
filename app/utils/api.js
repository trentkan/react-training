import axios from 'axios';

const c_id = "YOUR_CLIENT_ID";
const s_id = "YOUR_SECRET_ID";
const params = `?client_id=${c_id}&client_secret=${s_id}`;

const getProfile = (username) => (
  // add params to the end of this get if necessary
  axios.get(`https://api.github.com/users/${username}${params}`).then(({data}) => (data))
)

const getRepos = (username) => (
  axios.get(`https://api.github.com/users/${username}/repos${params}&per_page=100`)
)

const getStarCount = (repos) => (
  repos.data.reduce((count, {stargazers_count}) => (count + stargazers_count), 0)
)

const calculateScore = ({followers}, repos) => {
  return (followers * 3) + getStarCount(repos)
}

const handleError = (error) => {
  console.warn(error)
  return null
}

const getUserData = (player) => {
  return Promise.all([
    getProfile(player),
    getRepos(player)
  ]).then(([profile, repos]) => ({
    profile,
    score: calculateScore(profile, repos)
  }))
}


const sortPlayers = (players) => {
  return players.sort((a, b) => (b.score - a.score))
}

// import battle from '../api' -- default function
// import { battle }  from '../api' -- not default function

export function battle(players) {
  return Promise.all(players.map(getUserData)).then(sortPlayers).catch(handleError)
}

export function fetchPopularRepos(language) {
  const encodedURI = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`);

  return axios.get(encodedURI).then(({ data }) => (data.items) )
}

