// @flow
import * as React from 'react';
import ROSLIB from 'roslib';

import logo from './logo.svg';
import JViz from './JViz'
import './styles/App.css';
import {version} from '../package.json';

type Props = {

}

type State = {
  connected: boolean,
  error: ?React.Element<*>,
  url: string,
}

class App extends React.Component<Props, State> {
  state = {
    connected: false,
    error: undefined,
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
            <div className="App">
              <JViz ros={this.ros} />
            </div>
        );
    } else {
        x = (
            <div className="App">
                <div className="AppHeader">
                  <img src={logo} className="Logo" alt="logo" />
                  <h2>Welcome to JViz</h2>
                </div>
                <div className="AppMain">
                  <p>Connect to url</p>
                  <input type="url" name="url" value={this.state.url} onChange={this.handleChange}/>
                  <button onClick={this.handleConnect} value="Connect">
                    Connect
                  </button>
                  {this.state.error}
                </div>
                <div className="AppFooter">
                  <div style={{float: "right"}}>JViz Version: {version}</div>
                </div>
            </div>

        );
    }

    return x;
  }
}

export default App;
