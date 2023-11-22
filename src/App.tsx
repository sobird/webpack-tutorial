import React, { useState } from 'react';
import './App.scss';
import Bird from '@/assets/bird.png';

console.log('process.env.baseURL', process.env.baseURL);

export default () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setCount(count + 1);
        }}
      >
        {count}
      </button>

      <img src={Bird} alt="" />
    </div>
  );
};
