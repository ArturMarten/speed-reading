import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Search, Grid, Popup, Icon, Dimmer, Loader, Dropdown, Label, Table } from 'semantic-ui-react';
import { getTranslate, getActiveLanguage } from 'react-localize-redux';

import * as actionCreators from '../../store/actions';
import { sortByColumn, stopPropagation } from '../../shared/utility';
import TextSelectionFilter from './TextSelectionFilter';

const initialState = {
  selectedTextId: null,
  searchLoading: false,
  searchValue: '',
  textSelectionFilterOpened: false,
  filter: {
    collectionIds: [],
    keywords: [],
    complexityEquality: 'from',
    complexityRating: 0,
    authors: [],
    questionsAuthors: [],
    language: 'estonian',
    unread: false,
  },
  filterApplied: false,
  column: 'averageInterestingnessRating',
  direction: 'descending',
};

export class TextSelection extends Component {
  searchTimeout = null;

  state = {
    ...initialState,
    searchResults: this.props.texts,
    filter: {
      ...initialState.filter,
      language: this.props.currentLanguage === 'gb' ? 'english' : 'estonian',
    },
    sortOptions: [
      {
        key: 0,
        value: 'averageInterestingnessRating',
        text: this.props.translate('text-selection.by-average-interestingness-rating'),
      },
      {
        key: 1,
        value: 'interestingnessRatingCount',
        text: this.props.translate('text-selection.by-interestingness-rating-count'),
      },
      { key: 2, value: 'wordCount', text: this.props.translate('text-selection.by-word-count') },
      {
        key: 3,
        value: 'textReadingAttemptCount',
        text: this.props.translate('text-selection.by-user-reading-attempt'),
      },
      {
        key: 4,
        value: 'totalReadingAttemptCount',
        text: this.props.translate('text-selection.by-total-reading-attempt'),
      },
      {
        key: 5,
        value: 'wordLengthClassRating',
        text: this.props.translate('text-selection.by-word-length-class-rating'),
      },
      {
        key: 6,
        value: 'sentenceLengthClassRating',
        text: this.props.translate('text-selection.by-sentence-length-class-rating'),
      },
      { key: 7, value: 'title', text: this.props.translate('text-selection.by-title') },
      { key: 8, value: 'author', text: this.props.translate('text-selection.by-author') },
    ],
  };

  componentDidMount() {
    this.props.onFetchTexts();
    if (this.props.collections === []) {
      this.props.onFetchTextCollections();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.texts.length === 0 && this.props.texts.length !== 0) {
      this.resetSearch();
    }
    if (prevProps.selectStatus.loading && !this.props.selectStatus.loading) {
      this.props.onClose();
    }
  }

  onSubmit = () => {
    this.props.onTextSelect(this.state.selectedTextId);
  };

  onFilterChange = (name, value) => {
    const updatedFilter = { ...this.state.filter };
    updatedFilter[name] = value;
    this.setState({ filter: updatedFilter, filterApplied: true });
  };

  onFilterClear = () => {
    this.setState({ filter: { ...initialState.filter }, filterApplied: false });
  };

  textSelectionFilterToggleHandler = (event) => {
    stopPropagation(event);
    this.setState({ textSelectionFilterOpened: !this.state.textSelectionFilterOpened });
  };

  resetSearch = () => {
    this.setState({
      ...initialState,
      searchResults: this.props.texts,
    });
  };

  searchHandler = (event, { value }) => {
    this.setState({ searchValue: value, searchLoading: true, selectedTextId: null });
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      if (this.state.searchValue.length < 1) return this.resetSearch();
      const foundResults = this.props.texts.filter((text) => {
        const term = this.state.searchValue.toLowerCase();
        return (
          term === '' || text.title.toLowerCase().indexOf(term) !== -1 || text.author.toLowerCase().indexOf(term) !== -1
        );
      });
      return this.setState({
        searchLoading: false,
        searchResults: foundResults,
      });
    }, 500);
  };

  sortDirectionHandler = () => {
    this.setState({
      direction: this.state.direction === 'ascending' ? 'descending' : 'ascending',
    });
  };

  sortColumnHandler = (event, { value }) => {
    this.setState({
      column: value,
    });
  };

  sortHandler = (selectedColumn) => () => {
    const { column, direction } = this.state;
    if (column !== selectedColumn) {
      this.setState({
        column: selectedColumn,
        direction: 'ascending',
      });
    } else {
      this.setState({
        direction: direction === 'ascending' ? 'descending' : 'ascending',
      });
    }
  };

  textSelectionHandler = (textId) => {
    this.setState({ selectedTextId: textId });
  };

  render() {
    const { column, direction } = this.state;
    const filteredTexts = this.state.searchResults.filter(
      (text) =>
        (this.state.filter.collectionIds.length === 0 ||
          this.state.filter.collectionIds.indexOf((+text.collectionId).toString()) !== -1) &&
        (this.state.filter.keywords.length === 0 ||
          this.state.filter.keywords.some((keyword) => text.keywords.includes(keyword))) &&
        (this.state.filter.complexityEquality === 'from'
          ? this.state.filter.complexityRating <= text.complexity
          : this.state.filter.complexityRating >= text.complexity) &&
        (this.state.filter.authors.length === 0 || this.state.filter.authors.indexOf(text.author) !== -1) &&
        (this.state.filter.questionsAuthors.length === 0 ||
          this.state.filter.questionsAuthors.indexOf(text.questionsAuthor) !== -1) &&
        text.language === this.state.filter.language &&
        (!this.state.filter.unread || !text.textReadingAttemptCount || text.textReadingAttemptCount === 0),
    );
    const sortedTexts = sortByColumn(filteredTexts, column, direction);
    const textTableRows = sortedTexts.map((text) => {
      const { wordCount, wordLengthClassRating, sentenceLengthClassRating } = text;
      const readTime = wordCount / this.props.wordsPerMinute;
      const wordCountColor = 100 - Math.round(((wordCount - 250) / 1000) * 100);
      const wordLengthClassRatingColor = 160 - wordLengthClassRating * 14;
      const sentenceLengthClassRatingColor = 160 - sentenceLengthClassRating * 14;
      return (
        <Table.Row
          key={text.id}
          active={text.id === this.state.selectedTextId}
          onClick={() => this.textSelectionHandler(text.id)}
          onDoubleClick={() => this.onSubmit()}
        >
          <Table.Cell textAlign="left" computer={6}>
            <div>
              <b>{text.title}</b>
            </div>
            <div>{text.author}</div>
          </Table.Cell>
          <Table.Cell>
            <div style={{ fontSize: '1.2em' }}>
              {text.textReadingAttemptCount
                ? `${text.textReadingAttemptCount}`
                : `${this.props.translate('text-selection.not-read')}`}
            </div>
            <div style={{ fontSize: '0.8em' }}>
              {`(${this.props.translate('text-selection.total')}`}
              &nbsp;
              {`${text.totalReadingAttemptCount})`}
            </div>
          </Table.Cell>
          <Table.Cell>
            <Label circular size="large" style={{ color: 'black', background: `hsl(${wordCountColor}, 100%, 50%)` }}>
              {`${wordCount}`}
            </Label>
            <div style={{ fontSize: '0.8em' }}>
              {`${readTime.toFixed(1)}`}
              &nbsp;
              {`${this.props.translate('text-selection.min')}`}
            </div>
          </Table.Cell>
          <Table.Cell>
            <span style={{ fontSize: '1.2em' }}>
              {`${text.wordLengthClassRating}${this.props.translate('text-selection.class')} `}
            </span>
            <Label
              circular
              empty
              style={{ color: 'black', background: `hsl(${wordLengthClassRatingColor}, 100%, 50%)` }}
            />
          </Table.Cell>
          <Table.Cell>
            <span style={{ fontSize: '1.2em' }}>
              {`${text.sentenceLengthClassRating}${this.props.translate('text-selection.class')} `}
            </span>
            <Label
              circular
              empty
              style={{ color: 'black', background: `hsl(${sentenceLengthClassRatingColor}, 100%, 50%)` }}
            />
          </Table.Cell>
          <Table.Cell>
            <div style={{ fontSize: '1.6em' }}>
              {text.averageInterestingnessRating ? text.averageInterestingnessRating.toFixed(1) : '-'}
            </div>
            <div style={{ fontSize: '0.8em' }}>
              {`(${text.interestingnessRatingCount}`}
              &nbsp;
              {`${this.props.translate('text-selection.ratings')})`}
            </div>
          </Table.Cell>
        </Table.Row>
      );
    });
    return (
      <Modal size="large" open={this.props.open} onClose={this.props.onClose} closeIcon>
        <Modal.Header>{this.props.translate('text-selection.modal-header')}</Modal.Header>
        <Modal.Content style={{ paddingBottom: 0 }}>
          {this.props.textsStatus.loading ? (
            <Dimmer active inverted>
              <Loader active inline="centered" content={this.props.translate('text-selection.fetching')} />
            </Dimmer>
          ) : null}
          <Grid centered style={{ paddingBottom: '2px' }}>
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
                  <Button basic onClick={this.textSelectionFilterToggleHandler}>
                    <Icon fitted color={this.state.filterApplied ? 'red' : null} size="large" name="filter" />
                    &nbsp;
                    {this.props.translate('text-selection.filter')}
                  </Button>
                  <TextSelectionFilter
                    open={this.state.textSelectionFilterOpened}
                    onClose={this.textSelectionFilterToggleHandler}
                    filter={this.state.filter}
                    textCount={textTableRows.length}
                    onFilterChange={this.onFilterChange}
                    onFilterClear={this.onFilterClear}
                  />
                  <Popup
                    trigger={
                      <Button basic>
                        <Icon fitted size="large" name="sort" />
                        &nbsp;
                        {this.props.translate('text-selection.sort')}
                      </Button>
                    }
                    flowing
                    position="bottom right"
                    on="click"
                  >
                    <Popup
                      content={
                        direction === 'descending'
                          ? this.props.translate('text-selection.descending')
                          : this.props.translate('text-selection.ascending')
                      }
                      trigger={
                        <Button icon onClick={this.sortDirectionHandler}>
                          <Icon name={direction === 'descending' ? 'down arrow' : 'up arrow'} />
                        </Button>
                      }
                      position="bottom right"
                      on="hover"
                    />
                    <Dropdown
                      selection
                      value={column}
                      options={this.state.sortOptions}
                      onChange={this.sortColumnHandler}
                      placeholder={this.props.translate('text-selection.sort-by-placeholder')}
                    />
                  </Popup>
                </Button.Group>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <div style={{ height: '60vh', maxHeight: '60vh', overflow: 'auto' }}>
            <Table selectable compact="very" textAlign="center" verticalAlign="middle" basic sortable unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell sorted={column === 'title' ? direction : null} onClick={this.sortHandler('title')}>
                    {this.props.translate('text-selection.title-and-author')}
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === 'textReadingAttemptCount' ? direction : null}
                    onClick={this.sortHandler('textReadingAttemptCount')}
                  >
                    {this.props.translate('text-selection.user-reading-attempt-count')}
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === 'wordCount' ? direction : null}
                    onClick={this.sortHandler('wordCount')}
                  >
                    {this.props.translate('text-selection.word-count')}
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === 'wordLengthClassRating' ? direction : null}
                    onClick={this.sortHandler('wordLengthClassRating')}
                  >
                    {this.props.translate('text-selection.word-class-rating')}
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === 'sentenceLengthClassRating' ? direction : null}
                    onClick={this.sortHandler('sentenceLengthClassRating')}
                  >
                    {this.props.translate('text-selection.sentence-class-rating')}
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === 'averageInterestingnessRating' ? direction : null}
                    onClick={this.sortHandler('averageInterestingnessRating')}
                  >
                    {this.props.translate('text-selection.interestingness')}
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body style={{ cursor: 'pointer' }}>{textTableRows}</Table.Body>
            </Table>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            type="button"
            loading={this.props.selectStatus.loading}
            onClick={this.onSubmit}
            disabled={this.state.selectedTextId === null || this.props.selectStatus.loading}
          >
            {this.props.translate('text-selection.choose')}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  texts: state.text.texts,
  wordsPerMinute: state.options.speedOptions.wordsPerMinute,
  collections: state.text.collections,
  textsStatus: state.text.textsStatus,
  selectStatus: state.text.selectStatus,
  currentLanguage: getActiveLanguage(state.locale).code,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = (dispatch) => ({
  onFetchTexts: () => {
    dispatch(actionCreators.fetchTexts());
  },
  onFetchTextCollections: () => {
    dispatch(actionCreators.fetchTextCollections());
  },
  onTextSelect: (textId) => {
    dispatch(actionCreators.selectText(textId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextSelection);
