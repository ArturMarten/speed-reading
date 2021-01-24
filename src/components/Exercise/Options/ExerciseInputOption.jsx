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
}) {
  const [inputValue, setInputValue] = useState('');
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
      setInputValue(submittedValue);
    },
    [updateDelay, updateValue, value],
  );

  const changeHandler = (event) => {
    if (/^-?\d*$/.test(event.target.value)) {
      let updatedValue = +event.target.value;
      if (updatedValue > max) {
        updatedValue = max;
      } else if (updatedValue < min) {
        updatedValue = min;
      }
      if (updatedValue !== inputValue) {
        setInputValue(updatedValue);
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
      onSubmit(updatedValue);
      setInputValue(updatedValue);
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
    onSubmit(inputValue);
  };

  return (
    <Table.Row verticalAlign="middle">
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
