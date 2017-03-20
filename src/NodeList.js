import React, { Component } from 'react';
import ROSLIB from 'roslib';

class NodeList extends Component {

    updateNodeList() {
        console.log('NodeList updateNodeList');

        this.ros.getNodes((list) => {
          // console.log(list);
            this.setState({
                nodes: list,
            });
        }, (message) => {
            console.log('NodeList updateNodeList failed: ' + message);
        });

    }

    constructor(props) {
        super();
        console.log('Constructing NodeList');

        this.ros = props.ros;

        this.state = {
            nodes: [],
        }

        this.updateNodeList = this.updateNodeList.bind(this);
        this.updateNodeList();
    }

    render() {
        console.log('Rendering NodeList');

        return (
        <div className="NodeList">
            <h2>Node List</h2>
            <ul className="App-intro">
                {this.state.nodes.map((item) =>
                  <li key={item} style={{textAlign: "left"}}>{item}</li>
                )}
            </ul>
            <button onClick={this.updateNodeList}>
                Update
            </button>
        </div>
        );
    }
}

export default NodeList;
