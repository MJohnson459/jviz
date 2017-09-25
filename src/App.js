// @flow
import * as React from 'react';
import logo from './logo.svg';
import JViz from './JViz'
import './styles/App.css';

import ROSLIB from 'roslib';

type Props = {

}

type State = {
  connected: boolean,
  error?: string,
  url: string,
}

class App extends React.Component<Props, State> {
  state = {
    connected: false,
    url: "ws://localhost:9090",
  }

  ros = null

  handleChange = (event: {target: {value: string}}) => {
    this.setState({url: event.target.value});
  }

  handleConnect = () => {
    this.ros = new ROSLIB.Ros({
        url : this.state.url,
      });

    if (this.ros) this.ros.on('connection', () => {
      this.setState({
          connected: true,
      });
    });

    if (this.ros) this.ros.on('error', (error) => {
      console.log(error)
      this.setState({
          error: error,
      });
    });
  }

  render() {
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
                {this.state.error ? <div style={{color: "rgb(161, 55, 55)", margin: 5}}>Unable to connect to server</div> : false}
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
