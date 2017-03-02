import React, { Component } from 'react';
import ROSLIB from 'roslib';
import logo from './logo.svg';
import './App.css';

class NodeList extends Component {
    updateNodeList() {
        this.ros.getNodes((list) => {
            const listItems = list.map((list) =>
              <li key={list} style={{textAlign: "left"}}>{list}</li>
            );
            this.setState({
                nodes: listItems,
            })
        });
    }

    constructor(props) {
        super();
        console.log('Constructing NodeList');

        this.ros = props.ros;

        this.state = {
            nodes: "",
        }

        this.updateNodeList = this.updateNodeList.bind(this);
        this.updateNodeList();
    }

    render() {
        console.log('Rendering NodeList');

        return (
        <div className="NodeList">
            <ul className="App-intro">
                {this.state.nodes}
            </ul>
            <button onClick={this.updateNodeList}>
                updateNodeList
            </button>
        </div>
        );
    }
}

class App extends Component {

    constructor() {
        super();
        console.log('Constructing');
        this.state = {
            message: "empty",
        }

        this.ros = new ROSLIB.Ros({
            url : 'ws://hecate.seebyte.com:9090'
          });

        this.ros.on('connection', function() {
          console.log('Connected to websocket server.');
        });

        this.listener = new ROSLIB.Topic({
            ros : this.ros,
            name : '/listener',
            messageType : 'std_msgs/String'
        });

        this.listener.subscribe((message) => {
            this.setState({
              message: message.data,
            });
            console.log("hello " + message.data);
        });
    }

  render() {

    console.log('Rendering');// + ': ' + message.data);

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
            {this.state.message}
        </p>
        <NodeList ros={this.ros} />
      </div>
    );
  }
}

export default App;
