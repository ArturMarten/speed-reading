import { useState } from 'react';
import { Button, Form, Input, Modal } from 'semantic-ui-react';
import { getAverage, getStandardDeviation } from '../../../shared/utility';
import { LabeledSlider } from '../../LabeledSlider/LabeledSlider';
import Histogram from '../Histogram';

function DistributionChart(props) {
  const {
    data,
    exercise,
    modification,
    field,
    minimumAttemptCount,
    minimumAttemptCountChangeHandler,
    groupName,
    userCount,
    onClose,
    translate,
  } = props;
  const [ticks, setTicks] = useState(30);
  const onTickChange = (value) => {
    setTicks(value);
  };
  const exerciseLabel = modification
    ? `${translate(`distribution.${exercise}`)} (${translate(`distribution.${exercise}.${modification}`)})`
    : `${translate(`distribution.${exercise}`)}`;
  const groupLabel = `${groupName}`;
  const userCountLabel = `${translate('distribution.user-count')}: ${userCount}`;
  const average = getAverage(data) || 0;
  const standardDeviation = getStandardDeviation(data, average) || 0;
  const averageLabel = `${translate('distribution.average')}: ${average.toFixed(2)}`;
  const standardDeviationLabel = `${translate('distribution.standard-deviation')}: ${standardDeviation.toFixed(2)}`;
  const statisticsLabel = `[${averageLabel}, ${standardDeviationLabel}]`;
  return (
    <Modal open={data !== null} onClose={onClose} closeIcon closeOnDimmerClick={false}>
      <Modal.Header>{translate('distribution.title')}</Modal.Header>
      <Modal.Content>
        <Form style={{ marginBottom: '10px' }}>
          <Form.Group style={{ alignItems: 'flex-end' }}>
            <Form.Field width={10}>
              <label htmlFor="tick-count-slider">
                <div>{`${translate('distribution.tick-count')}: ${ticks}`}</div>
                <LabeledSlider
                  id="tick-count-slider"
                  color="rgb(47, 141, 255)"
                  min={1}
                  max={50}
                  value={ticks}
                  onChange={onTickChange}
                />
              </label>
            </Form.Field>
            <Form.Field
              type="number"
              width={6}
              value={minimumAttemptCount}
              onChange={minimumAttemptCountChangeHandler}
              label={translate('statistics.minimum-attempt-count')}
              control={Input}
            />
          </Form.Group>
        </Form>
        <div style={{ overflowX: 'auto' }}>
          <Histogram
            xLabel={translate(`distribution.${field}`)}
            yLabel={translate('distribution.frequency')}
            title={`${exerciseLabel} - ${groupLabel} - ${userCountLabel} ${statisticsLabel}`}
            fill="rgb(47, 141, 255)"
            width={850}
            height={300}
            data={data}
            ticks={ticks}
            translate={translate}
          />
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button positive onClick={onClose} content={translate('distribution.close')} />
      </Modal.Actions>
    </Modal>
  );
}

export default DistributionChart;
