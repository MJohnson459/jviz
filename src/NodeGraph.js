import React, { Component } from 'react';
import ROSLIB from 'roslib';
import Widget from './Widget.js';
import Graph from 'react-graph-vis';
class NodeGraph extends Component {

    constructor(props) {
        super(props);
        console.log('Constructing NodeGraph');

        this.state = {
            nodes: [],
            edges: [],
        }

        this.updateNodeList = this.updateNodeList.bind(this);
        this.drawNode = this.drawNode.bind(this);

        this.updateNodeList();
    }

    updateNodeList() {
        console.log('NodeList updateNodeList');

        this.props.ros.getNodes((list) => {
          // console.log(list);
            var edges = [];
            var nodes = {};
            this.props.ros.getNodeDetails(list[0], (publications, subscriptions, services) => {
                edges = publications.map((pub) => {
                    return {from: list[0], to: pub}
                })
            });

            this.setState({
                nodes: list.map((node) => {
                    return {id: node, label: node}
                }),
                edges: list.map((node, i) => {
                    return {from: node, to: list[i+1] || list[0]}
                })
            });
        }, (message) => {
            console.log('NodeList updateNodeList failed: ' + message);
        });

    }

    drawNode(node) {

    }

    render() {
        console.log('Rendering NodeGraph');
        var options = {
            layout: {
                hierarchical: false
            },
            edges: {
                color: "#000000"
            }
        };
        return (
        <Widget {...this.props} name="Node Graph">
            <Graph graph={{nodes: this.state.nodes, edges: this.state.edges}} options={options} style={{width: "100%", height: "100%"}}/>


            {this.props.children}
        </Widget>
        );
    }
}

export default NodeGraph;
