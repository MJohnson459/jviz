import React, { Component } from 'react';
import SidebarItem from './SidebarItem.js';
import { Scrollbars } from 'react-custom-scrollbars';
import NodeGraph from './NodeGraph'

class NodeList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            nodes: [],
        }

        this.updateNodeList = this.updateNodeList.bind(this);
        this.addNodeGraph = this.addNodeGraph.bind(this);
        this.updateNodeList();
    }

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

    render() {
        return (
        <SidebarItem name="Node List" hidden={this.props.hidden}>
            <Scrollbars className="NodeList" autoHeight autoHeightMax={350}>
                {this.state.nodes.map((item) =>
                    (<div className="Node" key={item} style={{textAlign: "left"}}>{item}</div>)
                )}
            </Scrollbars>
            <div className="Footer">
              <div className="SmallButton ColorThree" onClick={this.updateNodeList}>
                  Update
              </div>
              <div className="SmallButton ColorTwo" onClick={this.addNodeGraph}>
                  Node Graph
              </div>
            </div>

        </SidebarItem>
        );
    }
}

export default NodeList;
