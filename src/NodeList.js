import React, { Component } from 'react';
import SidebarItem from './SidebarItem.js';
import { Scrollbars } from 'react-custom-scrollbars';
import NodeGraph from './NodeGraph'

class NodeList extends Component {

    updateNodeList() {
        this.props.ros.getNodes((list) => {
          // console.log(list);
            this.setState({
                nodes: list,
            });
        }, (message) => {
            console.log('NodeList updateNodeList failed: ' + message);
        });

    }

    addNodeGraph() {
        this.props.addWidget("node_graph", (
            <NodeGraph key={"node_graph"} ros={this.props.ros} />
        ))
    }

    constructor(props) {
        super(props);

        this.state = {
            nodes: [],
            hidden: props.hidden,
        }

        this.updateNodeList = this.updateNodeList.bind(this);
        this.addNodeGraph = this.addNodeGraph.bind(this);
        this.updateNodeList();
    }

    render() {
        return (
        <SidebarItem name="Node List" hidden={this.state.hidden}>
            <Scrollbars className="NodeList" >
                <ul className="App-intro">
                    {this.state.nodes.map((item) =>
                      <li key={item} style={{textAlign: "left"}}>{item}</li>
                    )}
                </ul>
            </Scrollbars>
            <div className="SmallButton ColorThree" onClick={this.updateNodeList}>
                Update
            </div>
            <div className="SmallButton ColorTwo" onClick={this.addNodeGraph}>
                Node Graph
            </div>
        </SidebarItem>
        );
    }
}

export default NodeList;
