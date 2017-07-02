import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Graph from 'react-graph-vis';
import _ from 'lodash';
import {AutoSizer} from 'react-virtualized';
import ROSLIB from 'roslib';

class NodeGraph extends Component {

    constructor(props) {
        super(props);

        this.state = {
            graphNodes: [],
            graphEdges: [],
            hierarchical: false,
            debug: true,
        }

        this.quietNames = [
            '/diag_agg', '/runtime_logger', '/pr2_dashboard', '/rviz', '/rosout', '/cpu_monitor', '/monitor', '/hd_monitor', '/rxloggerlevel', '/clock', '/rqt', '/statistics', '/rosapi','/rosout_agg',
        ];

        this.options = {
            layout: {
                hierarchical: {
                    direction: 'LR',
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
      // {
      //   name: '/node/one',
      //   header: {
      //     name: '/node/one',
      //     details: {
      //       publishing: [],
      //       subscribing: [],
      //     }
      //   }
      // }

      var edges = [];
      var topics = [];

      const nodes = nodeTree.map((node) => {
          const node_id = "n_" + node.name;

          // Need to de-duplicate. This should end up with 2 for each pair.
          node.header.details.publishing.forEach((topic) => {
              edges.push({from: node_id, to: "t_" + topic});
              topics.push({id: "t_" + topic, label: topic, shape: "ellipse", group: "topic"});
          });

          node.header.details.subscribing.forEach((topic) => {
              edges.push({from: "t_" + topic, to: node_id});
              topics.push({id: "t_" + topic, label: topic, shape: "ellipse", group: "topic"});
          });

          return {id: node_id, label: node.name, shape: "box", group: "node"};
      });

      this.setState({
        graphNodes: _.uniqBy([...nodes, ...topics], 'id'),
        graphEdges: edges,
      });
    }

    getOptions(width, height) {
        return {
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
            width: width + 'px',
            height: height + 'px',
        };
    }

    render() {
        var nodes = [];
        var edges = [];

        if (this.state.debug) {
            nodes = this.state.graphNodes.filter((node)=> {
                return !this.quietNames.includes(node.label);
            })
            edges = this.state.graphEdges.filter((edge)=> {
                return !this.quietNames.includes(edge.from) &&
                    !this.quietNames.includes(edge.to);
            })
        } else {
            nodes = this.state.graphNodes;
            edges = this.state.graphEdges;
        }

        return (
        <div className="NodeGraph">
            <div style={{ flex: '1 1 auto' }}>
                <AutoSizer>
                  {({ height, width }) => {
                      const options = this.getOptions(width, height);
                      return (
                          <Graph graph={{nodes: nodes, edges: edges}} options={options} style={{height: height, width: width}}/>
                      )}}
                </AutoSizer>
            </div>

            {this.props.children}
            <div className="Footer">
                <span className='SmallButton ColorOne' onClick={this.updateNodeList}>refresh</span>
                <span className='SmallButton ColorTwo' onClick={() => {this.setState({hierarchical: !this.state.hierarchical})}}>{this.state.hierarchical ? "directed" : "free"}</span>
                <span className='SmallButton ColorThree' onClick={() => {this.setState({debug: !this.state.debug})}}>{this.state.debug ? "debug" : "all"}</span>
            </div>
        </div>
        );
    }
}

NodeGraph.propTypes = {
  ros: PropTypes.instanceOf(ROSLIB.Ros).isRequired,
  children: PropTypes.element,
}

export default NodeGraph;
