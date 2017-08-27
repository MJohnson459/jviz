import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Graph from 'react-graph-vis';
import {AutoSizer} from 'react-virtualized';

class NodeGraph extends Component {

    constructor(props) {
        super(props);

        this.state = {
            graphNodes: [],
            graphEdges: [],
            hierarchical: false,
        }

        this.options = {
            layout: {
                hierarchical: {
                    direction: 'LR',
                    enabled: this.state.hierarchical,
                    sortMethod: 'directed',
                },
            },
            edges: {
                color: "#d4d3d3",
                smooth: true,
            },
            nodes: {
                color: {
                    highlight: 'rgba(177, 147, 18, 0.9)',
                    hover: 'rgb(150, 185, 210)',
                },
                font: {
                    color: 'rgb(223, 223, 223)',
                }
            },
            interaction: {
                hover: true,
            },
            groups: {
                node: {
                    color: {
                        border: 'rgba(122, 192, 210, 0.99)',
                        background: 'rgba(122, 192, 210, 0.9)',
                    },
                },
                topic: {
                    color: {
                        border: 'rgba(128, 177, 18, 0.99)',
                        background: 'rgba(128, 177, 18, 0.9)',
                    },
                },
            },
            autoResize: true
        };

        this.createGraph = this.createGraph.bind(this);
    }

    componentDidMount() {
      this.createGraph(this.props.nodeList);
    }

    componentWillReceiveProps(nextProps) {
      this.createGraph(nextProps.nodeList);
    }

    createGraph(nodeTree) {
      var edges = [];

      const nodes = nodeTree.map((node) => {
          const node_id = node.type + "_" + node.fullname;

          // Assuming topics but links may be services or actions etc.
          node.out && node.out.forEach((topic) => {
              edges.push({from: node_id, to: "topic_" + topic});
          });

          node.in && node.in.forEach((topic) => {
              edges.push({from: "topic_" + topic, to: node_id});
          });

          switch(node.type) {
            case "node":
              return {id: node_id, label: node.fullname, shape: "box", group: "node"};
            case "topic":
              return {id: node_id, label: node.fullname, shape: "ellipse", group: "topic"};
            default:
              return {id: node_id, label: node.fullname, shape: "ellipse", group: "unknown"};
          }

      });

      this.setState({
        graphNodes: nodes,
        graphEdges: edges,
      });
    }

    render() {
        return (
        <div className="NodeGraph">
            <div style={{ flex: '1 1 auto', display: 'flex'}}>
                <Graph graph={{nodes: this.state.graphNodes, edges: this.state.graphEdges}} options={this.options} style={{flex: 1}}/>
            </div>

            {this.props.children}
            <div className="ButtonPanel">
                <span className='SmallButton ColorTwo' onClick={() => {this.setState({hierarchical: !this.state.hierarchical})}}>{this.state.hierarchical ? "directed" : "free"}</span>
            </div>
        </div>
        );
    }
}

NodeGraph.propTypes = {
  nodeList: PropTypes.array.isRequired,
  children: PropTypes.element,
}

export default NodeGraph;
