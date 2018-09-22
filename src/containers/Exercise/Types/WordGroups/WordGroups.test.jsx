/* eslint-disable func-names */
import { updateState } from './WordGroups';
import { exampleText, writeText, getGroupsMetadata } from '../../../../utils/CanvasUtils/CanvasUtils';
import { splitIntoWordGroups } from '../../../../utils/TextUtils';

const CANVAS_HEIGHT = 400;
const GROUP_CHARACTER_COUNT = 15;

describe('Wordgroups updateState', () => {
  const textOptions = {
    font: 'sans-serif',
    width: 250,
    fontSize: 14,
    lineSpacing: 1.0,
  };
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = textOptions.width;
  offscreenCanvas.height = CANVAS_HEIGHT;
  const offscreenContext = offscreenCanvas.getContext('2d');
  offscreenContext.font = `${Math.ceil(textOptions.fontSize / 0.75)}px ${textOptions.font}`;
  offscreenContext.textBaseline = 'bottom';
  offscreenContext.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
  const { wordsMetadata, linesMetadata } = writeText(offscreenContext, exampleText.contentState);
  const wordGroups = splitIntoWordGroups(exampleText.contentState.getPlainText(''), GROUP_CHARACTER_COUNT);
  const groupsMetadata = getGroupsMetadata(wordsMetadata, wordGroups);
  const textMetadata = { wordsMetadata, linesMetadata, groupsMetadata };

  before(() => {
    // console.log(wordGroups);
  });

  it('increases initial state group index', () => {
    const currentState = {
      groupIndex: -1,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.groupIndex).to.equal(0);
  });

  it('outputs first draw rect', () => {
    const currentState = {
      groupIndex: -1,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    const firstWordGroup = wordGroups[0];
    const expectedRects = [{
      x: 0,
      y: 0,
      width: textMetadata.wordsMetadata[firstWordGroup.length - 1].rect.right,
      height: 19,
    }];
    expect(newState.drawRects).to.eql(expectedRects);
  });

  it('increases group index after first group', () => {
    const currentState = {
      groupIndex: 0,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.groupIndex).to.equal(1);
  });

  it('outputs second draw rect', () => {
    const currentState = {
      groupIndex: 0,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    const groupMetadata = textMetadata.groupsMetadata[1];
    const expectedRects = [{
      x: groupMetadata.rects[0].left,
      y: 0,
      width: groupMetadata.rects[0].right - groupMetadata.rects[0].left,
      height: 19,
    }, {
      x: groupMetadata.rects[1].left,
      y: 19,
      width: groupMetadata.rects[1].right - groupMetadata.rects[1].left,
      height: 19,
    }];
    expect(newState.drawRects).to.eql(expectedRects);
  });

  it('increases group index after second group', () => {
    const currentState = {
      groupIndex: 1,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.groupIndex).to.equal(2);
  });

  it('outputs third draw rect', () => {
    const currentState = {
      groupIndex: 1,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    const groupMetadata = textMetadata.groupsMetadata[2];
    const expectedRects = [{
      x: 0,
      y: groupMetadata.rects[0].top,
      width: groupMetadata.rects[0].right - groupMetadata.rects[0].left,
      height: 19,
    }];
    expect(newState.drawRects).to.eql(expectedRects);
  });

  it('detects new line after second group', () => {
    const currentState = {
      groupIndex: 1,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.newLine).to.equal(true);
  });

  it('increases group index after fourth group', () => {
    const currentState = {
      groupIndex: 3,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.groupIndex).to.equal(4);
  });

  it('outputs fifth draw rect', () => {
    const currentState = {
      groupIndex: 3,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    const groupMetadata = textMetadata.wordsMetadata[7];
    const expectedRects = [{
      x: groupMetadata.rect.left,
      y: groupMetadata.rect.top,
      width: groupMetadata.rect.right - groupMetadata.rect.left,
      height: 19,
    }];
    expect(newState.drawRects).to.eql(expectedRects);
  });

  it('detects that there is not new page', () => {
    const pageFirstGroupIndex = textMetadata.groupsMetadata
      .findIndex(group => group.rects[group.rects.length - 1].bottom > CANVAS_HEIGHT);
    const pageLastGroupIndex = pageFirstGroupIndex - 1;
    const currentState = {
      groupIndex: pageLastGroupIndex - 1,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.newPage).to.equal(false);
  });

  it('detects that there is new page', () => {
    const pageFirstGroupIndex = textMetadata.groupsMetadata
      .findIndex(group => group.rects[group.rects.length - 1].bottom > CANVAS_HEIGHT);
    const pageLastGroupIndex = pageFirstGroupIndex - 1;
    const currentState = {
      groupIndex: pageLastGroupIndex,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.newPage).to.equal(true);
  });

  it('increases margin top', () => {
    const pageFirstGroupIndex = textMetadata.groupsMetadata
      .findIndex(group => group.rects[group.rects.length - 1].bottom > CANVAS_HEIGHT);
    const pageLastGroupIndex = pageFirstGroupIndex - 1;
    const currentState = {
      groupIndex: pageLastGroupIndex,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.marginTop).to.equal(385);
  });

  it('outputs new page draw rect', () => {
    const pageFirstGroupIndex = textMetadata.groupsMetadata
      .findIndex(group => group.rects[group.rects.length - 1].bottom > CANVAS_HEIGHT);
    const pageLastGroupIndex = pageFirstGroupIndex - 1;
    const currentState = {
      groupIndex: pageLastGroupIndex,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    const firstGroupMetadata = textMetadata.groupsMetadata[pageFirstGroupIndex];
    const expectedRects = [{
      x: 0,
      y: 0,
      width: firstGroupMetadata.rects[0].right - firstGroupMetadata.rects[0].left,
      height: 19,
    }];
    expect(newState.drawRects).to.eql(expectedRects);
  });

  it('detects that text has not finished', () => {
    const currentState = {
      groupIndex: 63,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 390,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.finished).to.equal(false);
  });

  it('detects that text has finished', () => {
    const currentState = {
      groupIndex: 64,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 390,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.finished).to.equal(true);
  });
});
