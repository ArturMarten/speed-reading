import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, List, Rating, Search, Grid, Popup, Icon, Dimmer, Loader, Dropdown } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../store/actions';

const initialState = {
  selectedTextId: null,
  searchLoading: false,
  searchValue: '',
};

export class TextSelection extends Component {
  state = {
    ...initialState,
    searchResults: this.props.texts,
  };

  componentDidMount() {
    this.props.onFetchTexts();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.texts.length === 0 && this.props.texts.length !== 0) {
      this.resetSearch();
    }
    if (prevProps.selecting && !this.props.selecting) {
      this.props.onClose();
    }
  }

  onSubmit = () => {
    this.props.onTextSelect(this.state.selectedTextId);
  }

  resetSearch = () => {
    this.setState({
      ...initialState,
      searchResults: this.props.texts,
    });
  }

  searchTimeout = null;

  searchHandler = (event, { value }) => {
    this.setState({ searchValue: value, searchLoading: true, selectedTextId: null });
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      if (this.state.searchValue.length < 1) return this.resetSearch();
      const foundResults = this.props.texts
        .filter((text) => {
          const term = this.state.searchValue.toLowerCase();
          return term === ''
              || text.title.toLowerCase().indexOf(term) !== -1
              || text.author.toLowerCase().indexOf(term) !== -1;
        });
      return this.setState({
        searchLoading: false,
        searchResults: foundResults,
      });
    }, 500);
  }

  textSelectionHandler = (textId) => {
    this.setState({ selectedTextId: textId });
  }

  render() {
    const texts = this.state.searchResults.map(text => (
      <List.Item
        key={text.id}
        active={text.id === this.state.selectedTextId}
        onClick={() => this.textSelectionHandler(text.id)}
      >
        <List.Content floated="right">
          {this.props.translate('text-selection.complexity')}
          <Rating
            disabled
            maxRating={10}
            icon="star"
            defaultRating={text.complexity}
          />
        </List.Content>
        <List.Content>
          <List.Header>{text.title}</List.Header>
          <List.Description>{this.props.translate('text-selection.author')}: {text.author}</List.Description>
        </List.Content>
      </List.Item>
    ));
    return (
      <Modal size="large" open={this.props.open} onClose={this.props.onClose} closeIcon>
        <Modal.Header>{this.props.translate('text-selection.modal-header')}</Modal.Header>
        <Modal.Content>
          <Dimmer active={this.props.fetching} inverted>
            <Loader active inline="centered" content={this.props.translate('text-selection.fetching')} />
          </Dimmer>
          <Grid centered style={{ maxHeight: '6vh' }}>
            <Grid.Row columns={2} style={{ paddingTop: 0 }}>
              <Grid.Column mobile={10} computer={8}>
                <Search
                  showNoResults={false}
                  open={false}
                  input={{ fluid: true }}
                  value={this.state.searchValue}
                  placeholder={this.props.translate('text-selection.search-placeholder')}
                  onSearchChange={this.searchHandler}
                  loading={this.state.searchLoading}
                />
              </Grid.Column>
              <Grid.Column mobile={6} computer={3}>
                <Button.Group>
                  <Button basic disabled>
                    <Icon fitted size="large" name="filter" />
                    {this.props.translate('text-selection.filter')}
                  </Button>
                  {' '}
                  <Popup
                    trigger={
                      <Button basic>
                        <Icon fitted size="large" name="sort" />
                        {this.props.translate('text-selection.sort')}
                      </Button>
                    }
                    flowing
                    position="bottom right"
                    on="click"
                  >
                    <Button icon disabled>
                      <Icon name="down arrow" />
                    </Button>
                    <Dropdown
                      disabled
                      options={null}
                      placeholder={this.props.translate('text-selection.sort-by-placeholder')}
                      selection
                    />
                  </Popup>
                </Button.Group>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <List style={{ height: '55vh', maxHeight: '55vh', overflow: 'auto' }} selection verticalAlign="middle">
            {texts}
          </List>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            type="button"
            loading={this.props.selecting}
            onClick={this.onSubmit}
            disabled={this.state.selectedTextId === null || this.props.selecting}
          >
            {this.props.translate('text-selection.choose')}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  texts: state.text.texts,
  fetching: state.text.fetching,
  selecting: state.text.selecting,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onFetchTexts: () => {
    dispatch(actionCreators.fetchTexts());
  },
  onTextSelect: (textId) => {
    dispatch(actionCreators.selectText(textId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextSelection);
