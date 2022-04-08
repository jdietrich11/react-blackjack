import React from 'react';

import './playfield.scss';

const Playfield = () => {
  return (
    <div className='playfield'>
      <div className='bidding'>
        <input className='biding__input' type='number' value='69'></input>
      </div>
      <div className='user-inputs'>
        <div className='btn btn__draw'>Draw</div>
        <div className='btn btn__end'>End</div>
      </div>
      <div className='deck'>dECK</div>
    </div>
  );
};

export default Playfield;
