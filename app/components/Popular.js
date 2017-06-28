var React = require('react');

class Popular extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: 'All'
    };
    // Can we just put this on line 29?
    this.updateLanguage = this.updateLanguage.bind(this);
  }

  updateLanguage(language) {
    this.setState(() => {
      return {
        selectedLanguage: language
      }
    });
  }

  render() {
    var languages = ['All', 'JavaScript', 'Ruby', 'Java', 'Css', 'Python'];
    return (
      <ul className='languages'>
        {languages.map((language) => {
          return (
            <li
              style={language === this.state.selectedLanguage ? { color: '#d0012b'} : null}
              onClick={this.updateLanguage.bind(null, language)}
              key={language}>
              {language}
            </li>
          )
        })}
      </ul>
    )
  }
}

module.exports = Popular;
