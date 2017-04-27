import React, { Component } from 'react';
import Widget from './Widget.js';
import Graph from 'react-graph-vis';
import _ from 'lodash';
import {AutoSizer} from 'react-virtualized';


class NodeGraph extends Component {

    constructor(props) {
        super(props);
        console.log('Constructing NodeGraph');

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
                    enabled: this.state.hierarchical,
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
                    border: 'rgb(50, 185, 210)',
                    background: 'rgba(122, 192, 210, 0.9)',
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
                        highlight: 'rgba(177, 147, 18, 0.9)',
                        hover: 'rgba(150, 185, 210, 0.9)',
                    },
                },
                topic: {
                    color: {
                        border: 'rgba(128, 177, 18, 0.99)',
                        background: 'rgba(128, 177, 18, 0.9)',
                        highlight: 'rgba(177, 147, 18, 0.9)',
                        hover: 'rgb(150, 185, 210)',
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
        console.log('NodeList updateNodeList');

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

                    var edges = details.publishing.map((topic) => {
                        return {from: node_id, to: "t_" + topic}
                    });

                    edges.concat(details.subscribing.map((topic) => {
                        return {from: "t_" + topic, to: node_id}
                    }));

                    this.graphEdgesBuffer = [...this.graphEdgesBuffer, ...edges];

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

    render() {
        console.log('Rendering NodeGraph');

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
        <Widget {...this.props} name="Node Graph">
            <div style={{ flex: '1 1 auto' }}>
                <AutoSizer>
                  {({ height, width }) => {
                      var options = this.options;
                      options.height = height + 'px';
                      options.width = width + 'px';
                      options.layout.hierarchical.enabled = this.state.hierarchical;
                      console.log("options", options)
                      return (
                          <Graph graph={{nodes: nodes, edges: edges}} options={options} style={{height: height, width: width}}/>
                  )}}
                </AutoSizer>
            </div>



            {this.props.children}
            <div style={{height: 25}}>
                <span className={"smallButton"} style={{backgroundColor: "rgba(122, 192, 210, 0.86)"}} onClick={this.updateNodeList}>refresh</span>
                <span className={"smallButton"} style={{backgroundColor: "rgba(128, 177, 18, 0.67)"}} onClick={() => {this.setState({hierarchical: !this.state.hierarchical})}}>{this.state.hierarchical ? "directed" : "free"}</span>
                <span className={"smallButton"} style={{backgroundColor: "rgba(177, 147, 18, 0.67)"}} onClick={() => {this.setState({debug: !this.state.debug})}}>{this.state.debug ? "debug" : "all"}</span>
            </div>
        </Widget>
        );
    }
}

export default NodeGraph;
