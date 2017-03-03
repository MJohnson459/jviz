import React, { Component } from 'react';
import ROSLIB from 'roslib';

class NodeList extends Component {

    updateNodeList() {
        console.log('NodeList updateNodeList');

        this.ros.getNodes((list) => {
            const listItems = list.map((item) => {
                <li key={item} style={{textAlign: "left"}}>{item}</li>
            });
            this.setState({
                nodes: listItems,
            });
            console.log('NodeList updateNodeList');
        }, (message) => {
            console.log('NodeList updateNodeList failed: ' + message);
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
                Update
            </button>
        </div>
        );
    }
}

export default NodeList;
