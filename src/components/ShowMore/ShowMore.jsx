import React, { useState } from 'react';
import './ShowMore.css';

function ShowMore(props) {
  const { translate } = props;
  const [show, setShowMore] = useState(false);
  return (
    <div className="show-more">
      {!show ? (
        <div>
          <div className="text-hidden">{props.children}</div>
          <button type="button" className="text-button" onClick={() => setShowMore(true)}>
            {translate('show-more')}
          </button>
        </div>
      ) : (
        <div>
          <div>{props.children}</div>
          <button type="button" className="text-button" onClick={() => setShowMore(false)}>
            {translate('show-less')}
          </button>
        </div>
      )}
    </div>
  );
}

export default ShowMore;
