import React from 'react';
import PropTypes from 'prop-types';
import { fetchPopularRepos } from '../utils/api';
import Loading from './Loading';

const SelectLanguage = ({ onSelect, selectedLanguage }) => {
  var languages = ['All', 'JavaScript', 'Ruby', 'Java', 'Css', 'Python'];

  return (
    <ul className='languages'>
      {languages.map((language) => (
        <li
          style={language === selectedLanguage ? { color: '#d0012b'} : null}
          onClick={() => { onSelect(language) }}
          key={language}>
            {language}
        </li>
      ))}
    </ul>
  )
}

const RepoGrid = ({ repos }) => {
  return (
    <ul className='popular-list'>
      {repos.map(({html_url, name, owner, stargazers_count}, index) => (
        <li key={name} className='popular-item'>
          <div className='popular-rank'>#{index + 1}</div>
          <ul className='space-list-items'>
            <li>
              <img
                className='avatar'
                src={owner.avatar_url}
                alt={'Avatar for ' + owner.login}
              />
            </li>
            <li><a href={html_url}>{name}</a></li>
            <li>@{owner.login}</li>
            <li>{stargazers_count} stars</li>
          </ul>
        </li>
      ))}
    </ul>
  )
}

SelectLanguage.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
}

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired,
}

class Popular extends React.Component {
  state = {
    selectedLanguage: 'All',
    repos: null
  }

  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage);
  }

  updateLanguage = (language) => {
    this.setState(() => ({
      selectedLanguage: language,
      repos: null
    }));

    fetchPopularRepos(language)
      .then((repos) => {
        this.setState(() => ({ repos }))
      });
  }

  render() {
    return (
      <div>
        <SelectLanguage
          selectedLanguage={this.state.selectedLanguage}
          onSelect={this.updateLanguage}
        />

        {!this.state.repos
          ? <Loading text="Downloading" speed={10}/>
          : <RepoGrid repos={this.state.repos} />
        }
      </div>
    )
  }
}

export default Popular;
