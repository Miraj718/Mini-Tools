// CombinedView.js
import React, { useState } from 'react';
import Chat from './Chat';
import SpinnWheel from './SpinnerWheel';

const AgentWindow = ({ onReset }) => {
  const [showSpinner, setShowSpinner] = useState(true);

  const toggleSpinner = () => {
    setShowSpinner(!showSpinner);
  };

  return (
    <div>
      {showSpinner && <SpinnWheel />}
      {/* {!showSpinner && <Chat />} */}

      {/* <Chat /> */}
      {/* <button onClick={toggleSpinner}>Toggle Spinner</button>
      <button onClick={onReset}>Start Over</button> */}
    </div>
  );
};

export default AgentWindow;
