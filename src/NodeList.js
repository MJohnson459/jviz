import React, { Component } from 'react';
import SidebarItem from './SidebarItem.js';
import NodeGraph from './NodeGraph'
import SyntaxHighlighter from 'react-syntax-highlighter';
import YAML from 'yamljs';
import ReactTooltip from 'react-tooltip';

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

          var updatedNodesCount = 0;
          var updatedNodes = []

          // console.log(list);
          this.graphEdgesBuffer = [];
          this.graphNodesBuffer = [];

          list.forEach((node) => {
              const node_id = "n_" + node;

              this.props.ros.getNodeDetails(node, (details) => {

                  updatedNodes.push({
                    id: "n_" + node,
                    name: node,
                    details: details,
                    selected: false,
                  });

                  if (++updatedNodesCount === list.length) {
                    this.setState({
                      nodes: updatedNodes
                    })
                  }
              });
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
            <div className="ItemList">
              {this.state.nodes.map((node, index) =>
                  (
                    <div className="Item" key={node.id} style={{textAlign: "left", position: "relative"}} onClick={ () => {
                        var nodes = this.state.nodes;
                        nodes[index].selected = !node.selected;
                        this.setState({nodes: nodes});
                        }}>
                      <div>{node.name}</div>
                      {
                        node.selected ?
                          (<SyntaxHighlighter language="yaml" className="Message" useInlineStyles={false}>
                              {YAML.stringify(node.details, 2)}
                          </SyntaxHighlighter>)
                          : ""
                      }
                    </div>)
              )}
            </div>
            <div className="Footer">
              <ReactTooltip effect="solid" place="right" type="info"/>
              <div data-tip="Refresh the list of nodes" className="SmallButton ColorThree" onClick={this.updateNodeList}>
                  Refresh
              </div>
              <div data-tip="Create a Node Graph Widget" className="SmallButton ColorTwo" onClick={this.addNodeGraph}>
                  Node Graph
              </div>
            </div>

        </SidebarItem>
        );
    }
}

export default NodeList;
