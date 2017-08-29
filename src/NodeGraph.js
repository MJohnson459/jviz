import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Graph from 'react-graph-vis';

class NodeGraph extends Component {

    constructor(props) {
        super(props);

        this.state = {
            graph: {},
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
                    highlight: 'rgba(122, 192, 210, 0.99)',
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
                default: {
                    color: {
                        border: 'rgba(98, 98, 98, 0.97)',
                        background: 'rgba(98, 118, 131, 0.9)',
                    },
                },
                active: {
                    color: {
                        border: 'rgb(122, 192, 210)',
                        background: 'rgb(122, 192, 210)',
                    },
                },
                input: {
                    color: {
                        border: 'rgb(177, 147, 18)',
                        background: 'rgb(177, 147, 18)',
                    },
                },
                output: {
                    color: {
                        border: 'rgb(128, 177, 18)',
                        background: 'rgb(128, 177, 18)',
                    },
                },
            },
            autoResize: true
        };

        this.createGraph = this.createGraph.bind(this);
        this.rosGraphUpdated = this.rosGraphUpdated.bind(this);
    }

    componentDidMount() {
      this.createGraph(this.props.nodeList);
    }

    componentWillReceiveProps(nextProps) {
      console.log("receiving new props")
      this.createGraph(nextProps.nodeList);
    }

    rosGraphUpdated(nextGraph) {
      console.log("receiving new graph")
      this.createGraph(nextGraph);
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

          let graphNode = {id: node_id, label: node.fullname, shape: "ellipse", group: "default"}

          switch(node.type) {
            case "node":
                graphNode.shape = "box"
                break
            case "topic":
              graphNode.shape = "ellipse"
              break
            default:
          }

          switch(node.relation) {
            case "Active":
              graphNode.group = "active"
              break
            case "Input":
              graphNode.group = "input"
              break
            case "Output":
              graphNode.group = "output"
              break
            default:
          }

          if (node.active) {
            graphNode.group = "active"
            graphNode.chosen = true
          }

          return graphNode;

      });

      this.setState({
        graph: {
          nodes: nodes,
          edges: edges,
        }
      });
    }

    render() {
        return (
        <div className="NodeGraph">
            <div style={{ flex: '1 1 auto', display: 'flex'}}>
                <Graph graph={this.state.graph} options={this.options} style={{flex: 1}}/>
            </div>

            {this.props.children}
            <div className="ButtonPanel">
              <span className='SmallButton ColorTwo' onClick={() => {this.setState({hierarchical: !this.state.hierarchical})}}>{this.state.hierarchical ? "directed" : "free"}</span>
              <span className='SmallButton ColorThree' onClick={() => {this.createGraph(this.props.nodeList)}}>recreate </span>
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
