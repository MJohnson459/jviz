import React, { Component } from 'react';
import ROSLIB from 'roslib';
import logo from './logo.svg';
import NodeList from './NodeList'
import Publisher from './Publisher'
import Subscriber from './Subscriber'
import './App.css';

class App extends Component {

    connect() {
        this.ros.connect({
            url : 'ws://hecate.seebyte.com:9090',
        });
    }

    constructor() {
        super();
        console.log('Constructing');
        this.state = {
            message: "empty",
            connected: false,
        }

        this.ros = new ROSLIB.Ros({
            url : 'ws://hecate.seebyte.com:9090'
          });

        this.ros.on('connection', () => {
          console.log('Connected to websocket server.');
          this.setState({
              connected: true,
          });
        });
    }

  render() {

    console.log('Rendering');
    var x = "";
    if (this.state.connected) {
        x = (
            <div>
                <NodeList ros={this.ros} />
                <Publisher ros={this.ros} />
                <Subscriber ros={this.ros} />
            </div>
        );
    } else {
        x = (
            <div>
                <p>Failed to connect to ROS</p>
                <button onClick={this.connect} value="Connect" />
            </div>

        );
    }

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        {x}
      </div>
    );
  }
}

export default App;
