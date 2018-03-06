import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, List, Rating, Search, Grid, Popup, Icon, Dimmer, Loader, Dropdown } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

const dummyData = [
  {
    author: 'test',
    characterCount: 510,
    collectionId: 1,
    complexity: 4,
    id: 1,
    keywords: [
      'test',
    ],
    sentenceCount: 5,
    title: 'Test title 2',
    wordCount: 84,
  },
  {
    author: 'test',
    characterCount: 510,
    collectionId: 1,
    complexity: 4,
    id: 2,
    keywords: [
      'test',
    ],
    sentenceCount: 5,
    title: 'Test title 2',
    wordCount: 84,
  },
  { id: 3, title: 'Test', author: 'Test' },
  { id: 4, title: 'Test', author: 'Test' },
  { id: 5, title: 'Test', author: 'Test' },
  { id: 6, title: 'Test', author: 'Test' },
  { id: 7, title: 'Test', author: 'Test' },
  { id: 8, title: 'Test', author: 'Test' },
  { id: 9, title: 'Test', author: 'Test' },
  { id: 10, title: 'Test', author: 'Test' },
  { id: 11, title: 'Test', author: 'Test' },
  { id: 12, title: 'Test', author: 'Test' },
  { id: 13, title: 'Test', author: 'Test' },
  { id: 14, title: 'Test', author: 'Test' },
  { id: 15, title: 'Test', author: 'Test' },
  { id: 16, title: 'Test', author: 'Test' },
  { id: 17, title: 'Test', author: 'Test' },
  { id: 18, title: 'Test', author: 'Test' },
];

const initialState = {
  selectedTextId: null,
  searchLoading: false,
  searchValue: '',
  searchResults: dummyData,
};

export class TextSelection extends Component {
  state = { ...initialState };

  onSubmit = () => {
    console.log('Chosen');
  }

  searchTimeout = null;

  searchHandler = (event, { value }) => {
    this.setState({ searchValue: value, searchLoading: true, selectedTextId: null });
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      if (this.state.searchValue.length < 1) return this.setState({ ...initialState });
      const foundResults = dummyData
        .filter((text) => {
          const term = this.state.searchValue.toLowerCase();
          return text.title.toLowerCase().indexOf(term) !== -1
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
          Complexity
          <Rating
            disabled
            maxRating={10}
            icon="star"
            defaultRating={Math.round(Math.random() * 10)}
          />
        </List.Content>
        <List.Content>
          <List.Header>Title: {text.title}</List.Header>
          <List.Description>Author: {text.author}</List.Description>
        </List.Content>
      </List.Item>
    ));
    return (
      <Modal size="large" open={this.props.open} onClose={this.props.onClose} closeIcon>
        <Modal.Header>{this.props.translate('text-selection.modal-header')}</Modal.Header>
        <Modal.Content>
          <Dimmer active={false} inverted>
            <Loader active inline="centered" content="Loading texts" />
          </Dimmer>
          <Grid centered style={{ maxHeight: '6vh' }}>
            <Grid.Row columns={2} style={{ paddingTop: 0 }}>
              <Grid.Column mobile={10} computer={8}>
                <Search
                  showNoResults={false}
                  open={false}
                  input={{ fluid: true }}
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
            onClick={this.onSubmit}
            disabled={this.state.selectedTextId === null}
          >
            {this.props.translate('text-selection.choose')}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  selectedText: state.selectedText,
  translate: getTranslate(state.locale),
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TextSelection);
