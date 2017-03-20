import React, { Component } from 'react';
import logo from './logo.svg';
import JViz from './JViz'
import './App.css';

import ROSLIB from 'roslib';

class App extends Component {

  constructor() {
    super();
    console.log('Constructing');
    this.state = {
      url: "ws://localhost:9090",
      connected: false,
    }

    this.handleConnect = this.handleConnect.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({url: event.target.value});
  }

  handleConnect() {
    this.ros = new ROSLIB.Ros({
        url : this.state.url,
      });

    this.ros.on('connection', () => {
      console.log('Connected to websocket server.');
      this.setState({
          connected: true,
      });
    });
  }

  render() {

    console.log('App Rendering');
    var x = "";
    if (this.state.connected) {
        x = (
            <JViz ros={this.ros} />
        );
    } else {
        x = (
            <div>
                <p>Connect to url</p>
                <input type="url" name="url" value={this.state.url} onChange={this.handleChange}/>
                <button onClick={this.handleConnect} value="Connect">
                  Connect
                </button>
            </div>

        );
    }

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to JViz</h2>
        </div>
        {x}
      </div>
    );
  }
}

export default App;
