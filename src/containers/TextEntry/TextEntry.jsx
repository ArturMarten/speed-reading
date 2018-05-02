import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Button, Icon, Form, Input, Label, Popup, Rating } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../store/actions';
import HelpPopup from '../../components/HelpPopup/HelpPopup';
import TextSelection from '../TextSelection/TextSelection';
import TextEditor from '../TextEditor/TextEditor';
import TextTestEditor from './TextTestEditor/TextTestEditor';
import TextAnalysis from '../TextAnalysis/TextAnalysis';
import ErrorMessage from '../Message/ErrorMessage';
import SuccessMessage from '../Message/SuccessMessage';
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
        maxLength: 100,
      },
      valid: false,
      touched: false,
    },
    author: {
      value: '',
      validation: {
        required: true,
        maxLength: 50,
      },
      valid: false,
      touched: false,
    },
    collectionId: {
      value: 'not-set',
      validation: {
        required: false,
      },
      valid: true,
      touched: false,
    },
    editor: {
      value: '',
      validation: {
        required: false,
        maxLength: 50,
      },
      valid: true,
      touched: false,
    },
    questionsAuthor: {
      value: '',
      validation: {
        required: false,
        maxLength: 50,
      },
      valid: true,
      touched: false,
    },
    reference: {
      value: '',
      validation: {
        required: false,
        maxLength: 200,
      },
      valid: true,
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
  textTestOpened: false,
  textAnalysisOpened: false,
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
    if (prevProps.textStatus.loading && !this.props.textStatus.loading &&
               this.props.textStatus.error === null && this.props.selectedText && !this.props.selectedText.id) {
      this.newTextHandler();
    }
  }

  onSubmit = () => {
    const textEditorComponent = this.textEditorRef.getWrappedInstance();
    const submittedForm = {
      title: this.state.textEntryForm.title.value,
      author: this.state.textEntryForm.author.value,
      collectionId: this.state.textEntryForm.collectionId.value !== 'not-set' ? +this.state.textEntryForm.collectionId.value : null,
      editor: this.state.textEntryForm.editor.value,
      questionsAuthor: this.state.textEntryForm.questionsAuthor.value,
      reference: this.state.textEntryForm.reference.value,
      plain: textEditorComponent.getPlainText(),
      contentState: textEditorComponent.getRawContent(),
      complexity: this.state.textEntryForm.complexity.value,
      keywords: this.state.textEntryForm.keywords.value,
    };
    if (this.props.selectedText) {
      const textId = this.props.selectedText.id;
      this.props.onTextSave(submittedForm, textId, this.props.token);
    } else {
      this.props.onTextSave(submittedForm, null, this.props.token);
    }
  }

  setForm = (selectedText) => {
    const updatedTextEntryForm = { ...this.state.textEntryForm };
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const inputName in updatedTextEntryForm) {
      const updatedFormElement = { ...updatedTextEntryForm[inputName] };
      if (typeof updatedFormElement.value === 'string') {
        if (selectedText[inputName]) {
          updatedFormElement.value = selectedText[inputName].toString();
        } else {
          updatedFormElement.value = initialState.textEntryForm[inputName].value;
        }
      } else {
        updatedFormElement.value = selectedText[inputName];
      }
      updatedFormElement.valid = true;
      updatedFormElement.touched = false;
      updatedTextEntryForm[inputName] = updatedFormElement;
    }
    this.textEditorRef.getWrappedInstance().setContent(selectedText.contentState);
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

  textTestToggleHandler = () => {
    this.setState({ textTestOpened: !this.state.textTestOpened });
  }

  textAnalysisToggleHandler = () => {
    if (!this.state.textAnalysisOpened) {
      const textEditorComponent = this.textEditorRef.getWrappedInstance();
      const text = textEditorComponent.getPlainText();
      const textData = {
        text,
      };
      this.props.onAnalyzeText(textData);
      const textAnalysisComponent = this.textAnalysisRef.getWrappedInstance();
      textAnalysisComponent.setText(text);
    }
    this.setState({ textAnalysisOpened: !this.state.textAnalysisOpened });
  }

  render() {
    const textEditorLabel = (
      <label htmlFor="editor-input">
        {this.props.translate('text-entry.text-editor')}
        <HelpPopup
          position="top center"
          content={this.props.translate('text-entry.text-editor-description')}
        />
      </label>
    );
    const textReferenceLabel = (
      <label htmlFor="reference-input">
        {this.props.translate('text-entry.text-reference')}
        <HelpPopup
          position="top center"
          content={this.props.translate('text-entry.text-reference-description')}
        />
      </label>
    );
    const keywords = this.state.textEntryForm.keywords.value.map((keyword, index) => (
      <Label key={keyword} as="a">
        {keyword}
        <Icon
          name="close"
          onClick={() => this.keywordRemoveHandler(index)}
        />
      </Label>
    ));

    const collectionOptions = [{
      key: 0,
      text: this.props.translate('text-entry.text-collection-not-set'),
      value: 'not-set',
    }].concat(this.props.collections.map((collection, index) => ({
      key: index + 1,
      text: collection.title,
      value: collection.id.toString(),
    })));

    return (
      <Container style={{ marginTop: '3vh', marginBottom: '7vh' }}>
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
        <Header as="h2">{this.props.translate('text-entry.title')}</Header>
        <p>{this.props.translate('text-entry.description')}</p>
        <Form warning error={this.props.textStatus.error !== null} success={this.props.textStatus.message !== null}>
          <Form.Group widths="equal">
            <Form.Input
              id="title-input"
              type="text"
              name="title"
              label={this.props.translate('text-entry.text-title')}
              value={this.state.textEntryForm.title.value}
              error={!this.state.textEntryForm.title.valid && this.state.textEntryForm.title.touched}
              onChange={this.inputChangeHandler}
              placeholder={this.props.translate('text-entry.text-title-placeholder')}
            />
            <Form.Input
              id="author-input"
              type="text"
              name="author"
              label={this.props.translate('text-entry.text-author')}
              value={this.state.textEntryForm.author.value}
              error={!this.state.textEntryForm.author.valid && this.state.textEntryForm.author.touched}
              onChange={this.inputChangeHandler}
              placeholder={this.props.translate('text-entry.text-author-placeholder')}
            />
            <Form.Select
              id="collection-select"
              name="collectionId"
              loading={this.props.collectionsStatus.loading}
              label={this.props.translate('text-entry.text-collection')}
              value={this.state.textEntryForm.collectionId.value}
              options={collectionOptions}
              onChange={this.inputChangeHandler}
              error={!this.state.textEntryForm.collectionId.valid && this.state.textEntryForm.collectionId.touched}
              placeholder={this.props.translate('text-entry.text-collection-placeholder')}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Input
              id="editor-input"
              type="text"
              name="editor"
              label={textEditorLabel}
              value={this.state.textEntryForm.editor.value}
              error={!this.state.textEntryForm.editor.valid && this.state.textEntryForm.editor.touched}
              onChange={this.inputChangeHandler}
              placeholder={this.props.translate('text-entry.text-editor-placeholder')}
            />
            <Form.Input
              id="question-author-input"
              type="text"
              name="questionsAuthor"
              label={this.props.translate('text-entry.text-questions-author')}
              value={this.state.textEntryForm.questionsAuthor.value}
              error={!this.state.textEntryForm.questionsAuthor.valid && this.state.textEntryForm.questionsAuthor.touched}
              onChange={this.inputChangeHandler}
              placeholder={this.props.translate('text-entry.text-questions-author-placeholder')}
            />
            <Form.Input
              id="reference-input"
              type="text"
              name="reference"
              label={textReferenceLabel}
              value={this.state.textEntryForm.reference.value}
              error={!this.state.textEntryForm.reference.valid && this.state.textEntryForm.reference.touched}
              onChange={this.inputChangeHandler}
              placeholder={this.props.translate('text-entry.text-reference-placeholder')}
            />
          </Form.Group>
          <Form.Field>
            <label htmlFor="text-input">
              <div>{this.props.translate('text-entry.text-input')}</div>
            </label>
            <TextEditor
              id="text-input"
              ref={(ref) => { this.textEditorRef = ref; }}
            />
          </Form.Field>
          <Form.Field
            id="complexity-rating"
            control={Rating}
            label={this.props.translate('text-entry.text-complexity')}
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
          <SuccessMessage
            icon="check"
            message={this.props.textStatus.message}
          />
          <ErrorMessage
            error={this.props.textStatus.error}
          />
          <Button
            positive
            type="button"
            floated="right"
            loading={this.props.textStatus.loading}
            disabled={!this.state.textEntryFormValid || this.props.textStatus.loading}
            onClick={this.onSubmit}
          >
            <Icon fitted name="save" style={{ opacity: 1 }} />
            {this.props.selectedText ?
              this.props.translate('text-entry.modify-text') :
              this.props.translate('text-entry.add-text')
            }
          </Button>
          {this.state.textTestOpened ?
            <TextTestEditor
              open={this.state.textTestOpened}
              onClose={this.textTestToggleHandler}
              readingTextId={this.props.selectedText.id}
            /> : null}
          <TextAnalysis
            ref={(ref) => { this.textAnalysisRef = ref; }}
            open={this.state.textAnalysisOpened}
            onClose={this.textAnalysisToggleHandler}
          />
          {this.props.selectedText ?
            <Button
              primary
              type="button"
              floated="right"
              onClick={this.textTestToggleHandler}
            >
              {this.props.translate('text-entry.change-questions')}
            </Button> : null}
          <Button
            positive
            type="button"
            floated="right"
            onClick={this.textAnalysisToggleHandler}
          >
            {this.props.translate('text-entry.analyze-text')}
          </Button>
        </Form>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  collections: state.text.collections,
  selectedText: state.text.selectedText,
  collectionsStatus: state.text.collectionsStatus,
  textStatus: state.text.textStatus,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onFetchTextCollections: () => {
    dispatch(actionCreators.fetchTextCollections());
  },
  onTextSave: (text, textId, token) => {
    dispatch(actionCreators.saveText(text, textId, token));
  },
  onNewText: () => {
    dispatch(actionCreators.unselectText());
  },
  onAnalyzeText: (textData) => {
    dispatch(actionCreators.analyzeText(textData));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextEntry);
