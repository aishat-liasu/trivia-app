import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

import './stylesheets/App.css';

import Home from './pages/home';
import PlayQuiz from './pages/playQuiz';
import AddQuestion from './pages/addQuestion';


class App extends Component {
  render() {
    return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/add" component={AddQuestion} />
          <Route path="/quiz" component={PlayQuiz} />
          <Route component={Home} />
        </Switch>
      </Router>
    </div>
  );

  }
}

export default App;
