import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Graph from 'react-graph-vis';

import RosGraph from './RosGraph';

class NodeGraph extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hierarchical: false,
        }
    }

    static getOptions(hierarchical = false) {

      return {
            layout: {
                hierarchical: {
                    direction: 'LR',
                    enabled: hierarchical,
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
                    hover: {
                        border: 'rgb(122, 192, 210)',
                        background: 'rgb(92, 162, 180)',
                    },
                    highlight: {
                        border: 'rgb(122, 192, 210)',
                        background: 'rgb(122, 192, 210)',
                    },
                },
                font: {
                    color: 'rgb(223, 223, 223)',
                },
            },
            interaction: {
                hover: true,
            },
            groups: {
                default: {},
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
                lonely: {
                    color: {
                        border: 'rgb(161, 55, 55)',
                        background: 'rgb(159, 83, 83)',
                    },
                },
            },
            autoResize: true
        };
    }

    static getGroupTag(metadata, type, node) {
      let group = "default"

      // Lonely node
      if (type === "topic" && node.publishers.length + node.subscribers.length === 1 ) group = "lonely"

      if (metadata !== undefined) {
        if (metadata.type === type && metadata.active.id === node.name) group = "active"
        else if (metadata.relations.in.includes(node.name)) group = "input"
        else if (metadata.relations.out.includes(node.name)) group = "output"
      }

      return group
    }

    static createGraph(rosGraph, metadata) {
      let edges = []
      let nodes = []

      // Deal with nodes
      rosGraph.nodes.nodes.forEach((node) => {
          if (metadata.hidden.includes(node.name)) return
          const graphId = "node_" + node.name
          const group = NodeGraph.getGroupTag(metadata, "node", node)

          // ***** Add edges ******
          // Assuming topics but links may be services or actions etc.
          node.topics.publishers.forEach((topic) => {
              edges.push({from: graphId, to: "topic_" + topic})
          })

          node.topics.subscribers.forEach((topic) => {
              edges.push({from: "topic_" + topic, to: graphId})
          })

          nodes.push({id: graphId, label: node.name, shape: "box", group: group})
      })

      rosGraph.topics.forEach((node) => {
          if (metadata.hidden.includes(node.name)) return
          const graphId = "topic_" + node.name
          const group = this.getGroupTag(metadata, "topic", node)
          nodes.push({id: graphId, label: node.name, shape: "ellipse", group: group})
      });

      const graph = {
          nodes: nodes,
          edges: edges,
        };

        return graph

    }

    render() {
        const graph = NodeGraph.createGraph(this.props.rosGraph, this.props.metadata)
        const options = NodeGraph.getOptions(this.state.hierarchical)
        return (
        <div className="NodeGraph">
            <div style={{ flex: '1 1 auto', display: 'flex'}}>
                <Graph graph={graph} options={options} style={{flex: 1}}/>
            </div>

            {this.props.children}
            <div className="ButtonPanel">
              <span className='SmallButton ColorTwo' onClick={() => {
                  //this.setState({hierarchical: !this.state.hierarchical})
                }}>{this.state.hierarchical ? "directed" : "free"}</span>
              <span className='SmallButton ColorThree' onClick={() => {
                this.setState({
                  graph: NodeGraph.createGraph(this.props.rosGraph, this.props.metadata)
                })}}>redraw </span>
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
