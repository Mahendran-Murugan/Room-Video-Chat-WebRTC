import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { LandingScreen } from './components/screen/LandingScreen';
import { RoomScreen } from './components/screen/RoomScreen';

function App() {
  return (
    <Routes>
      <Route path='/' element={<LandingScreen />} />
      <Route path='/room/:id' element={<RoomScreen />} />
    </Routes>
  );
}

export default App;
