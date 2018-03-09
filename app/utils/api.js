const c_id = "YOUR_CLIENT_ID";
const s_id = "YOUR_SECRET_ID";
const params = `?client_id=${c_id}&client_secret=${s_id}`;

const getProfile = async (username) => {
  // add params to the end of this get if necessary
  const response = await fetch(`https://api.github.com/users/${username}${params}`)

  return response.json();
}

const getRepos = async (username) => {
  const response = await fetch(`https://api.github.com/users/${username}/repos${params}&per_page=100`);

  return response.json();
}

const getStarCount = (repos) => (
  repos.reduce((count, {stargazers_count}) => (count + stargazers_count), 0)
)

const calculateScore = ({followers}, repos) => {
  return (followers * 3) + getStarCount(repos)
}

const handleError = (error) => {
  console.warn(error)
  return null
}

const getUserData = async (player) => {
  const [profile, repos] = await Promise.all([getProfile(player), getRepos(player)]);

  return {
    profile,
    score: calculateScore(profile, repos)
  };
}


const sortPlayers = (players) => {
  return players.sort((a, b) => (b.score - a.score))
}

// import battle from '../api' -- default function
// import { battle }  from '../api' -- not default function

export async function battle(players) {
  const results = await Promise.all(players.map(getUserData)).catch(handleError);
  return results === null
    ? results
    : sortPlayers(results);
}

export async function fetchPopularRepos(language) {
  const encodedURI = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`);

  const response = await fetch(encodedURI).catch(handleError);

  const repos = await response.json();

  return repos.items;
}

