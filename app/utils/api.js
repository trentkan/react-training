var axios = require('axios');

// var c_id = "YOUR_CLIENT_ID";
// var s_id = "YOUR_SECRET_ID";
// var params = "?client_id=" + c_id +"&client_secret=" + s_id;

const getProfile = (username) => {
  // return axios.get('https://api.github.com/users/'' + username + params)
  return axios.get('https://api.github.com/users/' + username)
    .then((user) => {
      return user.data;
    });
}

const getRepos = (username) => {
  // Add params after repo if necessary
  return axios.get('https://api.github.com/users/' + username + '/repos?per_page=100');
}

const getStarCount = (repos) => {
  return repos.data.reduce((count, repo) => {
    return count + repo.stargazers_count;
  }, 0)
}

const calculateScore = (user_profile, repos) => {
  var followers = user_profile.followers;
  var totalStars = getStarCount(repos);

  return (followers * 3) + totalStars;
}

const handleError = (error) => {
  console.warn(error);
  return null;
}

const getUserData = (player) => {
  return axios.all([
    getProfile(player), getRepos(player)
  ]).then((data) => {
    var profile = data[0];
    var repos = data[1];

    return {
      profile: profile,
      score: calculateScore(profile, repos)
    }
  })
}

const sortPlayers = (players) => {
  return players.sort((a, b) => {
    return b.score - a.score
  })
}

module.exports = {
  battle: (players) => {
    return axios.all(players.map(getUserData))
      .then(sortPlayers)
      .catch(handleError)
  },
  fetchPopularRepos: (language) => {
    var encodedURI = window.encodeURI('https://api.github.com/search/repositories?q=stars:>1+language:' + language + '&sort=stars&order=desc&type=Repositories');

    return axios.get(encodedURI).then((response) => {
      return response.data.items;
    })
  }
}
