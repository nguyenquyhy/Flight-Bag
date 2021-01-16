import * as React from 'react';
import { Route } from 'react-router';
import Home from './components/Home';
import Twitch from './components/Twitch';

import './custom.css'

export default class App extends React.Component {
  static displayName = App.name;

  render () {
    return (
      <>
        <Route exact path='/' component={Home} />
        <Route exact path='/Twitch/Token' component={Twitch} />
      </>
    );
  }
}
