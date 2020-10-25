import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './views/Home';
import Lobby from './views/Lobby';
import Playground from './views/Playground';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Route exact path="/" component={Home} />
        <Route exact path="/lobby/:room" component={Lobby} />
        <Route exact path="/playground" component={Playground} />
      </BrowserRouter>
    </div>
  );
}

export default App;
