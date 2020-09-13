import React from 'react';
import './ProgressBar.css';

function ProgressBar(props) {
  const { percent, max, value, formatter, color } = props;

  const valueLabel = formatter ? formatter(value) : value || 0;
  const maxLabel = formatter ? formatter(max) : max || 0;
  const label = `${valueLabel} / ${maxLabel} (${percent}%)`;

  const containerStyles = {
    position: 'relative',
    height: '25px',
    width: '100%',
    minWidth: '150px',
    backgroundColor: '#f3f3f3',
    borderRadius: '3px',
    marginTop: '5px',
  };

  const fillerStyles = {
    height: '100%',
    width: `${Math.min(percent, 100)}%`,
    backgroundColor: color,
    borderRadius: 'inherit',
    textAlign: 'right',
    animation: 'progress-bar 5s',
    transition: 'width 2s ease-in-out',
  };

  const labelStyles = {
    position: 'absolute',
    height: '25px',
    lineHeight: '25px',
    fontSize: '17px',
    top: 0,
    left: 0,
    width: '100%',
    textAlign: 'center',
    color: '#000000',
    /*
    textShadow: '1px 1px 1px #ffffff',
    color: '#979797',
    fontWeight: 'bold',
    mixBlendMode: 'difference',
    */
    whiteSpace: 'nowrap',
  };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles} />
      <span style={labelStyles}>{label}</span>
    </div>
  );
}

export default ProgressBar;
