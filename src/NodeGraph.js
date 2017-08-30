import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Graph from 'react-graph-vis';

import RosGraph from './RosGraph';

class NodeGraph extends Component {

    constructor(props) {
        super(props);

        const options = {
              layout: {
                  hierarchical: {
                      direction: 'LR',
                      enabled: false,
                      sortMethod: 'directed',
                  },
              },
              edges: {
                  color: "#d4d3d3",
                  smooth: true,
              },
              nodes: {
                  color: {
                      border: 'rgba(98, 98, 98, 0.97)',
                      background: 'rgba(98, 118, 131, 0.9)',
                  },
                  font: {
                      color: 'rgb(223, 223, 223)',
                  }
              },
              interaction: {
                  hover: true,
              },
              groups: {
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

        this.state = {
            graph: {
              nodes: [],
              edges: [],
            },
            options: options,
        }

        this.createGraph = this.createGraph.bind(this);
    }

    componentDidMount() {
      this.createGraph(this.props.rosGraph, this.props.metadata);
    }

    componentWillReceiveProps(nextProps) {
      console.log("receiving new props")
      this.createGraph(nextProps.rosGraph, nextProps.metadata);
    }

    createGraph(rosGraph, metadata) {
      var edges = [];

      // Deal with nodes
      const nodeNodes = rosGraph.nodes.nodes.map((node) => {
          const graphId = "node_" + node.name
          let group = null

          if (metadata.type === "node" && metadata.active.id === node.name) group = "active"
          else if (metadata.relations.in.includes(node.name)) group = "input"
          else if (metadata.relations.out.includes(node.name)) group = "output"

          // ***** Add edges ******
          // Assuming topics but links may be services or actions etc.
          node.topics.publishers.forEach((topic) => {
              edges.push({from: graphId, to: "topic_" + topic});
          });

          node.topics.subscribers.forEach((topic) => {
              edges.push({from: "topic_" + topic, to: graphId});
          });

          return {id: graphId, label: node.name, shape: "box", group: group};
      });

      const topicNodes = rosGraph.topics.map((node) => {
          const graphId = "topic_" + node.name
          let group = null

          if (metadata.type === "topic" && metadata.active.id === node.name) group = "active"
          else if (metadata.relations.in.includes(node.name)) group = "input"
          else if (metadata.relations.out.includes(node.name)) group = "output"

          return {id: graphId, label: node.name, shape: "ellipse", group: group};
      });

      this.setState({
        graph: {
          nodes: [...nodeNodes, ...topicNodes],
          edges: edges,
        },
      });


          // switch(node.relation) {
          //   case "Active":
          //     graphNode.group = "active"
          //     break
          //   case "Input":
          //     graphNode.group = "input"
          //     break
          //   case "Output":
          //     graphNode.group = "output"
          //     break
          //   default:
          // }
          //
          // if (node.active) {
          //   graphNode.group = "active"
          //   graphNode.chosen = true
          // }

    }

    render() {
        return (
        <div className="NodeGraph">
            <div style={{ flex: '1 1 auto', display: 'flex'}}>
                <Graph graph={this.state.graph} options={this.state.options} style={{flex: 1}}/>
            </div>

            {this.props.children}
            <div className="ButtonPanel">
              <span className='SmallButton ColorTwo' onClick={() => {
                  const hierarchical = this.state.options.layout.hierarchical.enabled
                  let options = this.state.options
                  options.layout.hierarchical.enabled = !hierarchical
                  this.setState({options: options})
                }}>{this.state.options.layout.hierarchical.enabled ? "directed" : "free"}</span>
              <span className='SmallButton ColorThree' onClick={() => {this.createGraph(this.props.rosGraph, this.props.metadata)}}>recreate </span>
            </div>
        </div>
        );
    }
}

NodeGraph.propTypes = {
  rosGraph: PropTypes.instanceOf(RosGraph.RosGraph).isRequired,
  children: PropTypes.element,
}

export default NodeGraph;
