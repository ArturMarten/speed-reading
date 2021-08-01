import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Checkbox } from 'semantic-ui-react';

import HelpPopup from '../../HelpPopup/HelpPopup';

function ExerciseCheckOption({ name, description, value, updateValue }) {
  const [checkedValue, setCheckedValue] = useState(false);

  useEffect(() => {
    setCheckedValue(value);
  }, [value]);

  const changeHandler = (event, data) => {
    const updatedValue = data.checked;
    updateValue(updatedValue);
    setCheckedValue(updatedValue);
  };

  return (
    <Table.Row verticalAlign="middle" style={{ whiteSpace: 'nowrap' }}>
      <Table.Cell>
        {name}
        &nbsp;
        <HelpPopup position="right center" content={description} />
      </Table.Cell>
      <Table.Cell colSpan={3}>
        <Checkbox checked={checkedValue} onChange={changeHandler} />
      </Table.Cell>
    </Table.Row>
  );
}

ExerciseCheckOption.defaultProps = {
  description: null,
};

ExerciseCheckOption.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  value: PropTypes.bool.isRequired,
  updateValue: PropTypes.func.isRequired,
};

export default ExerciseCheckOption;
