import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Dropdown } from 'semantic-ui-react';

import HelpPopup from '../../HelpPopup/HelpPopup';

function ExerciseSelectOption({ name, description, options, value, updateValue }) {
  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const selectionChangeHandler = (event, data) => {
    const updatedValue = data.value;
    updateValue(updatedValue);
    setSelectedValue(updatedValue);
  };

  return (
    <Table.Row verticalAlign="middle">
      <Table.Cell>
        {name}
        <HelpPopup position="right center" content={description} />
      </Table.Cell>
      <Table.Cell colSpan={3}>
        <Dropdown fluid selection scrolling value={selectedValue} options={options} onChange={selectionChangeHandler} />
      </Table.Cell>
    </Table.Row>
  );
}

ExerciseSelectOption.defaultProps = {
  description: null,
};

ExerciseSelectOption.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.any,
      text: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }),
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  updateValue: PropTypes.func.isRequired,
};

export default ExerciseSelectOption;
