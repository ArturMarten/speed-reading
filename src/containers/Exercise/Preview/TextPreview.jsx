import React, { Component } from 'react';
import { connect } from 'react-redux';
import { convertFromHTML, ContentState } from 'draft-js';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import { writeText } from '../../../utils/CanvasUtils/CanvasUtils';

const TEXT_VERTICAL_PADDING = 15;
const TEXT_HORIZONTAL_PADDING = 70;

// eslint-disable-next-line
const blocksFromHTML = convertFromHTML('<p><b>Lorem ipsum dolor sit amet</b></p><p>consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nunc pulvinar sapien et ligula ullamcorper malesuada. Mauris cursus mattis molestie a iaculis at erat. Purus gravida quis blandit turpis cursus in hac. Placerat orci nulla pellentesque dignissim enim. Rutrum tellus pellentesque eu tincidunt tortor aliquam nulla facilisi. Lacus luctus accumsan tortor posuere. Ut sem nulla pharetra diam. Quisque egestas diam in arcu cursus euismod. Vitae semper quis lectus nulla at volutpat diam.</p><p>Lacus vel facilisis volutpat est velit egestas dui id ornare. Tortor aliquam nulla facilisi cras fermentum odio eu feugiat pretium. Nunc id cursus metus aliquam eleifend mi. A diam maecenas sed enim ut. Est lorem ipsum dolor sit amet consectetur.</p>');
const content = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);

export class TextPreview extends Component {
  componentDidMount() {
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenContext = this.offscreenCanvas.getContext('2d');
    this.shownContext = this.shownCanvas.getContext('2d');
    this.init();
  }

  componentDidUpdate() {
    this.init();
  }

  init() {
    this.offscreenCanvas.width = this.shownCanvas.width;
    this.offscreenCanvas.height = this.shownCanvas.height;
    this.offscreenContext.font = `${this.props.textOptions.fontSize}pt ${this.props.textOptions.font}`;
    this.offscreenContext.textBaseline = 'bottom';
    this.offscreenContext.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
    this.textMetadata = writeText(this.offscreenContext, content);
    this.shownContext.clearRect(0, 0, this.shownCanvas.width, this.shownCanvas.height);
    this.shownContext.drawImage(this.offscreenCanvas, 0, 0);
  }

  render() {
    return (
      <Grid>
        <Grid.Row centered>
          <Header as="h3" content={this.props.translate('exercises.text-preview')} />
        </Grid.Row>
        <Grid.Row centered>
          <Segment compact>
            <div
              style={{
                padding: `${TEXT_VERTICAL_PADDING}px ${TEXT_HORIZONTAL_PADDING}px ${TEXT_VERTICAL_PADDING}px ${TEXT_HORIZONTAL_PADDING}px`,
              }}
            >
              <canvas
                ref={(ref) => { this.shownCanvas = ref; }}
                width={this.props.textOptions.width}
                height={400}
              />
            </div>
          </Segment>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  textOptions: state.options.textOptions,
  translate: getTranslate(state.locale),
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TextPreview);
