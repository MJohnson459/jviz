import React, { Component } from 'react';
import ROSLIB from 'roslib';
import NodeList from './NodeList';
import Publisher from './Publisher';
import Subscriber from './Subscriber';
import './App.css';

class JViz extends Component {


    constructor(props) {
        super();
        console.log('Constructing JViz');

        this.state = {
            message: "empty",
            connected: false,
        }

        this.ros = props.ros;
    }

  render() {
    console.log('Rendering JViz');
    return (
      <div className="App">
        <div>
            <NodeList ros={this.ros} />
            <Publisher ros={this.ros} />
            <Subscriber ros={this.ros} />
        </div>
      </div>
    );
  }
}

export default JViz;
