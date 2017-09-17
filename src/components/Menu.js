import React from 'react';
import {Link} from 'react-router-dom';

const Menu = (props) => {
  return (
    <div className='menu'>
      <ul>
        <li><Link to="/textEntry">Text entry</Link></li>
        <li><Link to="/exercise/reading">Exercise</Link></li>
      </ul>
    </div>
  );
};

export default Menu;