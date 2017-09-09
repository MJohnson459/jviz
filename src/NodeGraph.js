import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Graph from 'react-graph-vis';

import RosGraph from './RosGraph';
import RosGraphView from './RosGraphView';

class NodeGraph extends Component {

    constructor(props) {
        super(props);

        this.state = {
            options: NodeGraph.getOptions(),
            lonely: {
              highlight: false,
              hide: false,
            }
        }

        this.getGroupTag = this.getGroupTag.bind(this)
        this.createGraph = this.createGraph.bind(this)
    }

    static getOptions() {

      return {
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
                    background: 'rgb(98, 118, 131)',
                    border: 'rgb(98, 118, 131)',
                    hover: {
                        background: 'rgb(92, 162, 180)',
                        border: 'rgb(122, 192, 210)',
                    },
                    highlight: {
                        background: 'rgb(122, 192, 210)',
                        border: 'rgb(122, 192, 210)',
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
                default: {
                    color: {
                        background: 'rgb(98, 118, 131)',
                        border: 'rgb(98, 118, 131)',
                    },
                },
                active: {
                    color: {
                        background: 'rgb(122, 192, 210)',
                        border: 'rgb(122, 192, 210)',
                    },
                },
                input: {
                    color: {
                        background: 'rgb(177, 147, 18)',
                        border: 'rgb(177, 147, 18)',
                    },
                },
                output: {
                    color: {
                        background: 'rgb(128, 177, 18)',
                        border: 'rgb(128, 177, 18)',
                    },
                },
                lonely: {
                    color: {
                        background: 'rgb(163, 105, 105)',
                        border: 'rgb(163, 105, 105)',
                    },
                },
            },
            autoResize: true
        };
    }

    getGroupTag(view, type, node) {
      let group = "default"

      // Lonely node
      if (this.state.lonely.highlight &&
        type === "topic" &&
        node.publishers.length + node.subscribers.length === 1 ) group = "lonely"

      if (view !== undefined) {
        if (view.type === type && view.active && view.active.name === node.name) group = "active"
        else if (view.relations && view.relations.in.includes(node.name)) group = "input"
        else if (view.relations && view.relations.out.includes(node.name)) group = "output"
      }

      return group
    }

    createGraph(rosGraph, view) {
      let edges = []
      let nodes = []

      if (!view) view = {
          toggled: [],
          hidden: [],
          relations: {
            in: [],
            out: [],
          }
        }

      // Deal with nodes
      rosGraph.nodes.nodes.forEach((node) => {
          if (view.hidden && view.hidden.includes(node.name)) return
          const graphId = "node_" + node.name
          const group = this.getGroupTag(view, "node", node)

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
          if (view.hidden.includes(node.name)) return
          const graphId = "topic_" + node.name
          const group = this.getGroupTag(view, "topic", node)
          nodes.push({id: graphId, label: node.name, shape: "ellipse", group: group})
      });

      const graph = {
          nodes: nodes,
          edges: edges,
        };

        return graph

    }

    render() {
        const graph = this.createGraph(this.props.rosGraph, this.props.view)
        const events = {
          click: (event) =>  {
            if (event.nodes.length > 0) {
              const index = event.nodes[0].indexOf('/')
              let name = event.nodes[0]
              let type = "node"
              if (index > 0) {
                name = event.nodes[0].slice(index)
                type = event.nodes[0].slice(0, index - 1)
              }
              const node = {
                id: name,
                name: name,
                type: type,
              }
              this.props.setNodeActive(node, true)
            }
          }
        }
        return (
        <div className="NodeGraph">
            <div style={{ flex: '1 1 auto', display: 'flex'}}>
                <Graph graph={graph} options={this.state.options} style={{flex: 1}} events={events} />
            </div>

            {this.props.children}
            <div className="ButtonPanel">
              <span className='SmallButton ColorTwo' onClick={() => {
                  let lonely = this.state.lonely
                  lonely.highlight = !this.state.lonely.highlight
                  this.setState({lonely: lonely})
                }}>{this.state.lonely.highlight ? "hide lonely" : "lonely"}</span>
            </div>
        </div>
        );
    }
}

NodeGraph.propTypes = {
  rosGraph: PropTypes.instanceOf(RosGraph.RosGraph).isRequired,
  view: PropTypes.instanceOf(RosGraphView).isRequired,
  children: PropTypes.element,
}

export default NodeGraph;
