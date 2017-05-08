import React, { Component } from 'react';
import Graph from 'react-graph-vis';
import _ from 'lodash';
import {AutoSizer} from 'react-virtualized';


class NodeGraph extends Component {

    constructor(props) {
        super(props);

        this.state = {
            graphNodes: [],
            topics: [],
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



        this.updateNodeList = this.updateNodeList.bind(this);
        this.drawNode = this.drawNode.bind(this);

        this.updateNodeList();
    }

    getNamespace(node) {
        const names = node.split('/')
        if (names.length > 1) {
            return names[0];
        }
        return '';
    }

    updateNodeList() {
        /// Need to buffer updates to avoid numerous render updates
        var readyForUpdate = {topics: false, nodes: false, edges: false};

        this.props.ros.getNodes((list) => {

            var updated_nodes = 0;

            // console.log(list);
            this.graphEdgesBuffer = [];
            this.graphNodesBuffer = [];

            const nodes = list.map((node) => {
                const node_id = "n_" + node;

                this.props.ros.getNodeDetails(node, (details) => {

                    const pub_edges = details.publishing.map((topic) => {
                        return {from: node_id, to: "t_" + topic}
                    });

                    const sub_edges = details.subscribing.map((topic) => {
                        return {from: "t_" + topic, to: node_id}
                    });

                    this.graphEdgesBuffer = [...this.graphEdgesBuffer, ...pub_edges, ...sub_edges];

                    if (++updated_nodes === list.length) {
                        readyForUpdate.edges = true;

                        if (readyForUpdate.topics === true &&
                            readyForUpdate.nodes === true &&
                            readyForUpdate.edges === true) {
                                this.graphUpdated();
                        }
                    }


                });

                return {id: node_id, label: node, shape: "box", group: "node"};
            });


            this.graphNodesBuffer = _.unionBy(this.graphNodesBuffer, nodes, 'id');
            readyForUpdate.nodes = true;

            if (readyForUpdate.topics === true &&
                readyForUpdate.nodes === true &&
                readyForUpdate.edges === true) {
                    this.graphUpdated();
            }

        }, (message) => {
            console.log('NodeList updateNodeList failed: ' + message);
        });

        /// Get all topics and add the topics to the graph node list
        this.props.ros.getTopics((topics) => {
            const topicNodes = topics.topics.map((topic) =>
                {
                    return {id: "t_" + topic, label: topic, shape: "ellipse", group: "topic"}
                }
            )

            this.graphNodesBuffer = _.unionBy(this.graphNodesBuffer, topicNodes, 'id');
            readyForUpdate.topics = true;
            if (readyForUpdate.topics === true &&
                readyForUpdate.nodes === true &&
                readyForUpdate.edges === true) {
                    this.graphUpdated();
            }
        });

    }

    graphUpdated() {
        this.setState(prevState => ({
            graphNodes: this.graphNodesBuffer,
            graphEdges: this.graphEdgesBuffer,
        }));
    }

    drawNode(node) {

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
            <div style={{height: 25}}>
                <span className='SmallButton ColorOne' onClick={this.updateNodeList}>refresh</span>
                <span className='SmallButton ColorTwo' onClick={() => {this.setState({hierarchical: !this.state.hierarchical})}}>{this.state.hierarchical ? "directed" : "free"}</span>
                <span className='SmallButton ColorThree' onClick={() => {this.setState({debug: !this.state.debug})}}>{this.state.debug ? "debug" : "all"}</span>
            </div>
        </div>
        );
    }
}

export default NodeGraph;
