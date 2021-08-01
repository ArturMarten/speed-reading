import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Table } from 'semantic-ui-react';

import HelpPopup from '../../HelpPopup/HelpPopup';

function ExerciseInputOption({
  name,
  description,
  unit,
  value,
  min,
  max,
  step,
  updateValue,
  updateDelay,
  keyboardChangesEnabled,
  style,
}) {
  const [inputValue, setInputValue] = useState(value);
  const timeout = useRef(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const onSubmit = useCallback(
    (submittedValue) => {
      if (value !== submittedValue) {
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
          updateValue(submittedValue);
        }, updateDelay);
      }
    },
    [updateDelay, updateValue, value],
  );

  const changeHandler = (event) => {
    if (/^-?\d*$/.test(event.target.value)) {
      const newValue = +event.target.value;
      let updatedValue = newValue;
      if (updatedValue > max) {
        updatedValue = max;
      } else if (updatedValue < min) {
        updatedValue = min;
      }
      setInputValue(newValue);
      if (updatedValue !== inputValue) {
        onSubmit(updatedValue);
      }
    }
  };

  const changeValue = useCallback(
    (newValue) => {
      let updatedValue = inputValue;
      if (newValue > max) {
        updatedValue = max;
      } else if (newValue < min) {
        updatedValue = min;
      } else {
        updatedValue = newValue;
      }
      setInputValue(updatedValue);
      if (updatedValue !== inputValue) {
        onSubmit(updatedValue);
      }
    },
    [inputValue, max, min, onSubmit],
  );

  const decreaseHandler = useCallback(() => {
    changeValue(inputValue - step);
  }, [changeValue, inputValue, step]);

  const increaseHandler = useCallback(() => {
    changeValue(inputValue + step);
  }, [changeValue, inputValue, step]);

  const keyPressHandler = useCallback(
    (event) => {
      const { key } = event;
      if (key === 'Enter') {
        onSubmit(inputValue);
      } else if (key === '+') {
        increaseHandler(event);
      } else if (key === '-') {
        decreaseHandler(event);
      }
    },
    [decreaseHandler, increaseHandler, inputValue, onSubmit],
  );

  useEffect(() => {
    if (keyboardChangesEnabled) {
      document.addEventListener('keypress', keyPressHandler);
    } else {
      document.removeEventListener('keypress', keyPressHandler);
    }
    return () => document.removeEventListener('keypress', keyPressHandler);
  }, [keyPressHandler, keyboardChangesEnabled]);

  const blurHandler = () => {
    let updatedValue = inputValue;
    if (inputValue > max) {
      updatedValue = max;
    } else if (inputValue < min) {
      updatedValue = min;
    }
    setInputValue(updatedValue);
    onSubmit(updatedValue);
  };

  return (
    <Table.Row verticalAlign="middle" style={{ whiteSpace: 'nowrap', ...style }}>
      <Table.Cell>
        {name}
        &nbsp;
        <HelpPopup position="right center" content={description} />
      </Table.Cell>
      <Table.Cell>
        <Button.Group size="mini" fluid basic>
          <Button icon="minus" disabled={inputValue <= min} onClick={decreaseHandler} />
          <Button icon="plus" disabled={inputValue >= max} onClick={increaseHandler} />
        </Button.Group>
      </Table.Cell>
      <Table.Cell>
        <Input
          type="text"
          transparent
          style={{ width: '100%' }}
          value={inputValue}
          onChange={changeHandler}
          onKeyPress={keyPressHandler}
          onBlur={blurHandler}
        >
          <input style={{ textAlign: 'center' }} size={5} />
        </Input>
      </Table.Cell>
      <Table.Cell>{unit}</Table.Cell>
    </Table.Row>
  );
}

ExerciseInputOption.defaultProps = {
  description: null,
  updateDelay: 300,
  keyboardChangesEnabled: false,
};

ExerciseInputOption.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  unit: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  updateValue: PropTypes.func.isRequired,
  updateDelay: PropTypes.number,
  keyboardChangesEnabled: PropTypes.bool,
};

export default ExerciseInputOption;
