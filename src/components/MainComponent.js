import React, { useState } from 'react';
// import AgentWindow from './AgentWindow';
import DetailForm from './DetailForm';
import SpinnWheel from './SpinnerWheel';
import StartButton from './StartButton';

const MainComponent = () => {
  const [currentComponent, setCurrentComponent] = useState('start');
  const nextComponent = () => {
    switch (currentComponent) {
      case 'start':
        setCurrentComponent('DetailForm');
        break;
      case 'DetailForm':
        setCurrentComponent('agentWindow');
        break;
      default:
        setCurrentComponent('start');
    }
  };

  return (
    <div>
      {currentComponent === 'start' && <StartButton onClick={nextComponent} />}
      {currentComponent === 'DetailForm' && <DetailForm onClick={nextComponent} />}
      {currentComponent === 'agentWindow' && <SpinnWheel onClick={nextComponent} />}
    </div>
  );
};

export default MainComponent;
