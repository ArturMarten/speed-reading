import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Button, Dropdown, Rating, Label } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import './TextSelectionFilter.css';

const initialState = {};

export class TextSelectionFilter extends Component {
  state = {
    ...initialState,
    collectionOptions: [],
    keywordOptions: [],
    complexityRatingOptions: [
      { key: 0, value: 'from', text: this.props.translate('text-selection-filter.from') },
      { key: 1, value: 'to', text: this.props.translate('text-selection-filter.up-to') },
    ],
    authorOptions: [],
    questionsAuthorOptions: [],
    languageOptions: [
      { key: 0, value: 'estonian', text: this.props.translate('text-selection-filter.estonian') },
      { key: 1, value: 'english', text: this.props.translate('text-selection-filter.english') },
    ],
  };

  componentDidMount() {
    if (this.props.texts !== [] && this.props.collections !== []) {
      this.processFilterData(this.props.texts);
    }
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.texts !== this.props.texts && this.props.texts !== []) ||
        (prevProps.collections !== this.props.collections && this.props.collections !== [])) {
      this.processFilterData(this.props.texts);
    }
  }

  onChangeHandler = (event, { name, value }) => {
    this.props.onFilterChange(name, value);
  }

  processFilterData = (texts) => {
    // Adding collection options
    const collectionOptions = this.props.collections.map((collection, index) => ({
      key: index + 1,
      text: collection.title,
      value: collection.id.toString(),
    }));

    // Adding keywords, author and question author options
    const keywords = [];
    const authors = [];
    const questionsAuthors = [];
    texts.forEach((text) => {
      text.keywords.forEach((keyword) => {
        if (keywords.indexOf(keyword) === -1) {
          keywords.push(keyword);
        }
      });
      if (authors.indexOf(text.author) === -1) {
        authors.push(text.author);
      }
      if (questionsAuthors.indexOf(text.questionsAuthor) === -1) {
        questionsAuthors.push(text.questionsAuthor);
      }
    });
    const keywordOptions = keywords.map((keyword, index) => ({
      key: index,
      value: keyword,
      text: keyword,
    }));

    const authorOptions = authors.map((author, index) => ({
      key: index,
      value: author,
      text: author,
    }));

    const questionsAuthorOptions = questionsAuthors.map((questionsAuthor, index) => ({
      key: index,
      value: questionsAuthor,
      text: questionsAuthor,
    }));

    this.setState({
      collectionOptions,
      keywordOptions,
      authorOptions,
      questionsAuthorOptions,
    });
  }

  render() {
    return (
      <Modal size="tiny" open={this.props.open} onClose={this.props.onClose} closeIcon>
        <Modal.Header>{this.props.translate('text-selection-filter.modal-header')}</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field
              id="collection-dropdown"
              name="collectionIds"
              inline
              fluid
              multiple
              search
              selection
              value={this.props.filter.collectionIds}
              options={this.state.collectionOptions}
              label={this.props.translate('text-selection-filter.collection')}
              placeholder={this.props.translate('text-selection-filter.collection')}
              onChange={this.onChangeHandler}
              control={Dropdown}
            />
            <Form.Field
              id="keyword-dropdown"
              name="keywords"
              inline
              fluid
              multiple
              search
              selection
              value={this.props.filter.keywords}
              options={this.state.keywordOptions}
              label={this.props.translate('text-selection-filter.keywords')}
              placeholder={this.props.translate('text-selection-filter.keywords')}
              onChange={this.onChangeHandler}
              control={Dropdown}
            />
            <Form.Group inline>
              <Form.Field
                id="complexity-dropdown"
                name="complexityEquality"
                selection
                value={this.props.filter.complexityEquality}
                options={this.state.complexityRatingOptions}
                label={this.props.translate('text-selection-filter.complexity')}
                onChange={this.onChangeHandler}
                control={Dropdown}
              />
              <Form.Field
                id="complexity-rating"
                name="complexityRating"
                icon="star"
                size="large"
                label=""
                clearable
                maxRating={10}
                rating={this.props.filter.complexityRating}
                onRate={(event, data) => this.onChangeHandler(event, { ...data, value: data.rating })}
                control={Rating}
              />
            </Form.Group>
            <Form.Field
              id="author-dropdown"
              name="authors"
              inline
              fluid
              multiple
              search
              selection
              value={this.props.filter.authors}
              options={this.state.authorOptions}
              label={this.props.translate('text-selection-filter.author')}
              placeholder={this.props.translate('text-selection-filter.author')}
              onChange={this.onChangeHandler}
              control={Dropdown}
            />
            <Form.Field
              id="question-author-dropdown"
              name="questionsAuthors"
              inline
              fluid
              multiple
              search
              selection
              value={this.props.filter.questionsAuthors}
              options={this.state.questionsAuthorOptions}
              label={this.props.translate('text-selection-filter.question-author')}
              placeholder={this.props.translate('text-selection-filter.question-author')}
              onChange={this.onChangeHandler}
              control={Dropdown}
            />
            <Form.Field
              id="language-dropdown"
              name="language"
              inline
              fluid
              selection
              value={this.props.filter.language}
              options={this.state.languageOptions}
              label={this.props.translate('text-selection-filter.language')}
              placeholder={this.props.translate('text-selection-filter.language')}
              onChange={this.onChangeHandler}
              control={Dropdown}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Label
            basic
            color="blue"
          >
            {this.props.translate('text-selection-filter.text-count')}: {this.props.textCount}
          </Label>
          <Button
            negative
            type="button"
            onClick={this.props.onFilterClear}
          >
            {this.props.translate('text-selection-filter.clear-filter')}
          </Button>
          <Button
            positive
            onClick={this.props.onClose}
          >
            {this.props.translate('text-selection-filter.close')}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  texts: state.text.texts,
  collections: state.text.collections,
  translate: getTranslate(state.locale),
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TextSelectionFilter);
