import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './views/Home';
import Lobby from './views/Lobby';
import Playground from './views/Playground';
import NotFound from './views/NotFound';
import Toast from './components/Toast';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/lobby/:room" component={Lobby} />
          <Route exact path="/playground" component={Playground} />
          <Route path="*" component={NotFound} />
        </Switch>
      </BrowserRouter>
      <Toast />
    </div>
  );
}

export default App;
