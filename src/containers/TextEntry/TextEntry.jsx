import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Button, Icon, Form, Input, Label, Popup, Rating } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../store/actions';
import TextSelection from '../TextSelection/TextSelection';
import TextEditor from '../TextEditor/TextEditor';
import { checkValidity } from '../../shared/utility';

const MAX_RATING = 10;

const initialState = {
  currentKeyword: '',
  keywordPopup: false,
  textEntryForm: {
    title: {
      value: '',
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    author: {
      value: '',
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    collectionId: {
      value: '',
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    complexity: {
      value: 0,
      valid: true,
      touched: false,
    },
    keywords: {
      value: [],
      valid: true,
      touched: false,
    },
  },
  textEntryFormValid: false,
  textSelectionOpened: false,
};

export class TextEntry extends Component {
  state = { ...initialState };

  componentDidMount() {
    this.props.onFetchTextCollections();
    if (this.props.selectedText) {
      this.setForm(this.props.selectedText);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedText && prevProps.selectedText !== this.props.selectedText) {
      this.setForm(this.props.selectedText);
    }
  }

  onSubmit = () => {
    const textEditorComponent = this.textEditorRef.getWrappedInstance();
    const submittedForm = {
      title: this.state.textEntryForm.title.value,
      author: this.state.textEntryForm.author.value,
      collectionId: +this.state.textEntryForm.collectionId.value,
      plain: textEditorComponent.getPlainText(),
      text: textEditorComponent.getRawContent(),
      complexity: this.state.textEntryForm.complexity.value,
      keywords: this.state.textEntryForm.keywords.value,
    };
    if (this.props.selectedText) {
      const textId = this.props.selectedText.id;
      this.props.onTextSave(submittedForm, textId);
    } else {
      this.props.onTextSave(submittedForm);
      this.resetForm();
    }
  }

  setForm = (selectedText) => {
    const updatedTextEntryForm = { ...this.state.textEntryForm };
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const inputName in updatedTextEntryForm) {
      const updatedFormElement = { ...updatedTextEntryForm[inputName] };
      updatedFormElement.value = typeof updatedFormElement.value === 'string' ?
        selectedText[inputName].toString() : selectedText[inputName];
      updatedFormElement.valid = true;
      updatedFormElement.touched = false;
      updatedTextEntryForm[inputName] = updatedFormElement;
    }
    this.textEditorRef.getWrappedInstance().setContent(selectedText.text);
    this.setState({
      textEntryForm: updatedTextEntryForm,
      textEntryFormValid: true,
    });
  }

  resetForm = () => {
    this.textEditorRef.getWrappedInstance().clearContent();
    this.setState({ ...initialState });
  }

  newTextHandler = () => {
    this.resetForm();
    this.props.onNewText();
  }

  keywordChangeHandler = (event) => {
    this.setState({ currentKeyword: event.target.value });
  }

  keywordKeyPressHandler = (event) => {
    if (event.key === 'Enter' && this.state.currentKeyword !== '' &&
      this.state.textEntryForm.keywords.value.indexOf(this.state.currentKeyword) === -1
    ) {
      const updatedTextEntryForm = { ...this.state.textEntryForm };
      const updatedKeywordsElement = { ...updatedTextEntryForm.keywords };
      updatedKeywordsElement.value = updatedKeywordsElement.value.concat(this.state.currentKeyword);
      updatedTextEntryForm.keywords = updatedKeywordsElement;
      this.setState({
        keywordPopup: false,
        currentKeyword: '',
        textEntryForm: updatedTextEntryForm,
      });
    }
  }

  keywordRemoveHandler = (keywordIndex) => {
    const updatedTextEntryForm = { ...this.state.textEntryForm };
    const updatedKeywordsElement = { ...updatedTextEntryForm.keywords };
    updatedKeywordsElement.value = updatedKeywordsElement.value.filter((keyword, index) => index !== keywordIndex);
    updatedTextEntryForm.keywords = updatedKeywordsElement;
    this.setState({ textEntryForm: updatedTextEntryForm });
  }

  inputChangeHandler = (event, { name, value }) => {
    const updatedTextEntryForm = { ...this.state.textEntryForm };
    const updatedFormElement = { ...updatedTextEntryForm[name] };
    updatedFormElement.value = value;
    updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedFormElement.touched = true;
    updatedTextEntryForm[name] = updatedFormElement;
    let formIsValid = true;
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const inputName in updatedTextEntryForm) {
      formIsValid = updatedTextEntryForm[inputName].valid && formIsValid;
    }
    this.setState({
      textEntryForm: updatedTextEntryForm,
      textEntryFormValid: formIsValid,
    });
  }

  textSelectionToggleHandler = () => {
    this.setState({ textSelectionOpened: !this.state.textSelectionOpened });
  }

  render() {
    const keywords = this.state.textEntryForm.keywords.value.map((keyword, index) => (
      <Label key={keyword} as="a">
        {keyword}
        <Icon
          name="close"
          onClick={() => this.keywordRemoveHandler(index)}
        />
      </Label>
    ));

    const collectionOptions = this.props.collections
      .map((collection, index) => ({
        key: index,
        text: collection.title,
        value: collection.id.toString(),
      }));

    return (
      <Container style={{ marginTop: '4vh' }}>
        <Header as="h2">{this.props.translate('text-entry.title')}</Header>
        {this.state.textSelectionOpened ?
          <TextSelection
            open={this.state.textSelectionOpened}
            onClose={this.textSelectionToggleHandler}
          /> : null}
        <Button
          primary
          floated="right"
          onClick={this.textSelectionToggleHandler}
          content={this.props.selectedText ?
            this.props.translate('text-entry.change-text') :
            this.props.translate('text-entry.select-text')}
        />
        {this.props.selectedText ?
          <Button
            secondary
            floated="right"
            onClick={this.newTextHandler}
            content={this.props.translate('text-entry.new-text')}
          /> : null
        }
        <p>{this.props.translate('text-entry.description')}</p>
        <Form warning>
          <Form.Group widths="equal">
            <Form.Input
              type="text"
              name="title"
              label={this.props.translate('text-entry.text-title')}
              value={this.state.textEntryForm.title.value}
              error={!this.state.textEntryForm.title.valid && this.state.textEntryForm.title.touched}
              onChange={this.inputChangeHandler}
              placeholder={this.props.translate('text-entry.text-title-placeholder')}
            />
            <Form.Input
              type="text"
              name="author"
              label={this.props.translate('text-entry.text-author')}
              value={this.state.textEntryForm.author.value}
              error={!this.state.textEntryForm.author.valid && this.state.textEntryForm.author.touched}
              onChange={this.inputChangeHandler}
              placeholder={this.props.translate('text-entry.text-author-placeholder')}
            />
            <Form.Select
              name="collectionId"
              loading={this.props.fetchingCollections}
              label={this.props.translate('text-entry.text-collection')}
              value={this.state.textEntryForm.collectionId.value}
              options={collectionOptions}
              onChange={this.inputChangeHandler}
              error={!this.state.textEntryForm.collectionId.valid && this.state.textEntryForm.collectionId.touched}
              placeholder={this.props.translate('text-entry.text-collection-placeholder')}
            />
          </Form.Group>
          <Form.Field>
            <label htmlFor="text-editor">
              <div>{this.props.translate('text-entry.text-editor')}</div>
            </label>
            <TextEditor
              id="text-editor"
              ref={(ref) => { this.textEditorRef = ref; }}
            />
          </Form.Field>
          <Form.Field
            control={Rating}
            label={this.props.translate('text-entry.text-complexity')}
            id="complexity-rating"
            icon="star"
            size="huge"
            maxRating={MAX_RATING}
            name="complexity"
            rating={this.state.textEntryForm.complexity.value}
            onRate={(event, data) => this.inputChangeHandler(event, { ...data, value: data.rating })}
          />
          <Form.Group inline>
            <Form.Field>
              <Popup
                trigger={
                  <Input
                    icon="tags"
                    iconPosition="left"
                    value={this.state.currentKeyword}
                    onChange={this.keywordChangeHandler}
                    onKeyPress={this.keywordKeyPressHandler}
                    onFocus={() => this.setState({ keywordPopup: true })}
                    onBlur={() => this.setState({ keywordPopup: false })}
                    placeholder={this.props.translate('text-entry.text-keyword-placeholder')}
                  />
                }
                content={this.props.translate('text-entry.text-keyword-popup')}
                open={this.state.keywordPopup}
                position="top center"
              />
            </Form.Field>
            <Label.Group size="large">
              {keywords}
            </Label.Group>
          </Form.Group>
          <Button
            positive
            type="button"
            floated="right"
            loading={this.props.savingText}
            disabled={!this.state.textEntryFormValid || this.props.savingText}
            onClick={this.onSubmit}
          >
            <Icon fitted name="save" style={{ opacity: 1 }} />
            {this.props.selectedText ?
              this.props.translate('text-entry.modify-text') :
              this.props.translate('text-entry.add-text')
            }
          </Button>
          {this.props.selectedText ?
            <Button
              primary
              type="button"
              floated="right"
            >
              {this.props.translate('text-entry.change-questions')}
            </Button> : null}
        </Form>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  fetchingCollections: state.text.fetchingCollections,
  collections: state.text.collections,
  selectedText: state.text.selectedText,
  savingText: state.text.savingText,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onFetchTextCollections: () => {
    dispatch(actionCreators.fetchTextCollections());
  },
  onTextSave: (text, textId) => {
    dispatch(actionCreators.storeText(text, textId));
  },
  onNewText: () => {
    dispatch(actionCreators.unselectText());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextEntry);
