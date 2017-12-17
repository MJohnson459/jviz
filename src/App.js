// @flow
import * as React from 'react';
import ROSLIB from 'roslib';

import logo from './logo.svg';
import JViz from './JViz'
import './styles/App.css';

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
    error: false,
    url: "ws://localhost:9090",
  }

  ros = null

  handleChange = (event: {target: {value: string}}) => {
    this.setState({url: event.target.value});
  }

  handleConnect = () => {
    try {
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
          error: (
            <div style={{color: "rgb(161, 55, 55)", margin: 5}}>
              <div>Unable to establish connection to rosbridge server</div>
            </div>
          ),
        });
      });
    } catch (e) {
      console.log("Failed to create ros instance", e)
      this.setState({
        error: (
          <div style={{color: "rgb(161, 55, 55)", margin: 5}}>
            <div>{e.message}</div>
          </div>
        ),
      });
    }
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
                <div className="App-header">
                  <img src={logo} className="App-logo" alt="logo" />
                  <h2>Welcome to JViz</h2>
                </div>
                <p>Connect to url</p>
                <input type="url" name="url" value={this.state.url} onChange={this.handleChange}/>
                <button onClick={this.handleConnect} value="Connect">
                  Connect
                </button>
                {this.state.error}
            </div>

        );
    }

    return (
      <div className="App">
        {x}
      </div>
    );
  }
}

export default App;
