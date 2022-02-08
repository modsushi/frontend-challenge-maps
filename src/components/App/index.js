import React, { useState } from 'react';

import Header from '../Header';
import Main from '../Main';
import './App.css';

const RESTAURANT_TYPES = ['pizza', 'burger', 'sushi'];

function App() {
  const [userSelection, setUserSelection] = useState(null);

  function changeSelection(selection) {
    if(!RESTAURANT_TYPES.includes(selection))
      return;
    if (selection === userSelection)
      return;
    setUserSelection(selection);
  }

  return (
    <div className="App">
      <Header changeSelection={changeSelection} userSelection={userSelection} options={RESTAURANT_TYPES} />
			<Main userSelection={userSelection} />
    </div>
  );
}

export default App;
