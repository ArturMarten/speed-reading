import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getLanguages, getActiveLanguage, setActiveLanguage} from 'react-localize-redux';
import {Dropdown, Flag} from 'semantic-ui-react';

class ResponsiveContainer extends Component {
  constructor(props) {
    super(props);
  }

  languageList() {
    return (
      this.props.languages.map((language, index) => {
        if (!language.active) {
          return (
            <Dropdown.Item key={index} onClick={() => this.props.onSettingLanguage(language.code)}>
              <Flag name={language.code}/>
            </Dropdown.Item>
          );
        }
      })
    );
  }

  render() {
    return (
      <Dropdown icon={<Flag name={this.props.currentLanguage} />}>
        <Dropdown.Menu>
          {this.languageList()}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

const mapStateToProps = (state) => ({
  currentLanguage: getActiveLanguage(state.locale).code,
  languages: getLanguages(state.locale),
});

const mapDispatchToProps = (dispatch) => ({
  onSettingLanguage: (code) => {
    dispatch(setActiveLanguage(code));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ResponsiveContainer);
