import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Editor, RichUtils, convertToRaw } from 'draft-js';
import { Container, Segment, Header, Message, Button, Icon, Form, Input, Label, Popup, Rating } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import './TextEntry.css';
import * as actionCreators from '../../store/actions';
import { checkValidity } from '../../shared/utility';
import InlineStyleControls from '../../components/TextEntry/InlineStyleControls';

const options = [
  { key: 0, text: 'Test collection', value: '1' },
];

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
      value: null,
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
};

export class TextEntry extends Component {
  state = { ...initialState };

  onSubmit = () => {
    const contentState = this.props.editorState.getCurrentContent();
    const submittedForm = {
      title: this.state.textEntryForm.title.value,
      author: this.state.textEntryForm.author.value,
      collectionId: +this.state.textEntryForm.collectionId.value,
      plain: contentState.getPlainText(''),
      text: convertToRaw(contentState),
      complexity: this.state.textEntryForm.complexity.value,
      keywords: this.state.textEntryForm.keywords.value,
    };
    console.log(submittedForm);
    this.props.onTextSave(submittedForm);
  }

  onTab = (event) => {
    // Currently works only with lists
    event.preventDefault();
    this.props.onSaveEditorState(RichUtils.onTab(event, this.props.editorState, 4));
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

  toggleInlineStyle = (inlineStyle) => {
    this.props.onSaveEditorState(RichUtils.toggleInlineStyle(
      this.props.editorState,
      inlineStyle,
    ));
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
    return (
      <Container style={{ marginTop: '4vh' }}>
        <Header as="h2">{this.props.translate('text-entry.title')}</Header>
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
              label={this.props.translate('text-entry.text-collection')}
              options={options}
              onChange={this.inputChangeHandler}
              error={!this.state.textEntryForm.collectionId.valid && this.state.textEntryForm.collectionId.touched}
              placeholder={this.props.translate('text-entry.text-collection-placeholder')}
            />
          </Form.Group>
          <Form.Field>
            <label htmlFor="text-editor-label">
              <div>{this.props.translate('text-entry.editor-text')}</div>
            </label>
            <Message warning attached style={{ margin: 0 }}>
              <Message.Header>{this.props.translate('text-entry.editor-warning-title')}</Message.Header>
              <p>{this.props.translate('text-entry.editor-warning-content')}</p>
            </Message>
            <Segment style={{ margin: 0 }}>
              <InlineStyleControls
                editorState={this.props.editorState}
                onToggle={this.toggleInlineStyle}
                translate={this.props.translate}
              />
              <Editor
                id="text-editor"
                editorState={this.props.editorState}
                onChange={this.props.onSaveEditorState}
                onTab={this.onTab}
              />
            </Segment>
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
            loading={this.props.textSaveStatus === 'Saving'}
            disabled={!this.state.textEntryFormValid || this.props.textSaveStatus === 'Saving'}
            onClick={this.onSubmit}
          >
            {this.props.textSaveStatus === 'Saved' ?
              <Icon fitted name="checkmark" size="large" style={{ opacity: 1 }} /> :
              <Icon fitted name="save" size="large" style={{ opacity: 1 }} />}
            {this.props.translate('text-entry.save')}
          </Button>
        </Form>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  editorState: state.text.editorState,
  textSaveStatus: state.text.textSaveStatus,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onSaveEditorState: (editorState) => {
    dispatch(actionCreators.editorStateUpdated(editorState));
  },
  onTextSave: (text) => {
    dispatch(actionCreators.storeText(text));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextEntry);
