// @flow

import * as React from 'react';
import Graph from 'react-graph-vis';

import * as RosGraph from './lib/RosGraph';
import RosGraphView from './lib/RosGraphView';
import type {SimpleNode} from './lib/RosGraphView';

type Edge = {
  from: string,
  to: string,
}

type Node = {
  id: string,
  label: string,
  shape: string,
  group: string,
}

type GraphType = {
  edges: Array<Edge>,
  nodes: Array<Node>,
}

type Props = {
  rosGraph: RosGraph.RosGraph,
  setNodeActive: (treeNode: SimpleNode, toggled: boolean) => void,
  view: RosGraphView,
}

type State = {
  options: Object,
  lonely: {
    highlight: boolean,
    hide: boolean,
  }
}

class NodeGraph extends React.Component<Props, State> {
  state = {
    options: NodeGraph.getOptions(),
    lonely: {
      highlight: false,
      hide: false,
    }
  }

  static getOptions() {
    return {
      layout: {
        hierarchical: {
          direction: 'LR',
          enabled: false,
          sortMethod: 'directed'
        }
      },
      edges: {
        color: "#d4d3d3",
        smooth: true
      },
      nodes: {
        color: {
          background: 'rgb(98, 118, 131)',
          border: 'rgb(98, 118, 131)',
          hover: {
            background: 'rgb(92, 162, 180)',
            border: 'rgb(122, 192, 210)'
          },
          highlight: {
            background: 'rgb(122, 192, 210)',
            border: 'rgb(122, 192, 210)'
          }
        },
        font: {
          color: 'rgb(223, 223, 223)'
        }
      },
      interaction: {
        hover: true
      },
      groups: {
        default: {
          color: {
            background: 'rgb(98, 118, 131)',
            border: 'rgb(98, 118, 131)'
          }
        },
        active: {
          color: {
            background: 'rgb(122, 192, 210)',
            border: 'rgb(122, 192, 210)'
          }
        },
        input: {
          color: {
            background: 'rgb(177, 147, 18)',
            border: 'rgb(177, 147, 18)'
          }
        },
        output: {
          color: {
            background: 'rgb(128, 177, 18)',
            border: 'rgb(128, 177, 18)'
          }
        },
        lonely: {
          color: {
            background: 'rgb(163, 105, 105)',
            border: 'rgb(163, 105, 105)'
          }
        }
      },
      autoResize: true
    };
  }

  getGroupTag = (view: RosGraphView, node: RosGraph.Primitive): string => {
    let group = "default"

    // Lonely node
    if (this.state.lonely.highlight && node.type === "topic") {
        if (node.publishers.length + node.subscribers.length === 1) group = "lonely"
    }

    if (view !== undefined) {
      if (view.type === node.type && view.active && view.active.path === node.path)
        group = "active"
      else if (view.relations && view.relations.in.includes(node.path))
        group = "input"
      else if (view.relations && view.relations.out.includes(node.path))
        group = "output"
    }

    return group
  }

  createGraph = (rosGraph: RosGraph.RosGraph, view: RosGraphView = new RosGraphView()): GraphType => {
    let edges: Array<Edge> = []
    let nodes: Array<Node> = []

      // Deal with nodes
    rosGraph.nodes.forEach((node) => {
      if (view.hidden && view.hidden.includes(node.path))
        return
      const graphId: string = "node_" + node.path
      const group: string = this.getGroupTag(view, node)

      // ***** Add edges ******
      // Assuming topics but links may be services or actions etc.
      node.topics.publishers.forEach((topic) => {
        edges.push({ from: graphId, to: "topic_" + topic })
      })

      node.topics.subscribers.forEach((topic) => {
        edges.push({ from: "topic_" + topic, to: graphId })
      })

      nodes.push({id: graphId, label: node.path, shape: "box", group: group})
    })

    rosGraph.topics.forEach((node) => {
      if (view.hidden.includes(node.path))
        return
      const graphId = "topic_" + node.path
      const group = this.getGroupTag(view, node)
      nodes.push({id: graphId, label: node.path, shape: "ellipse", group: group})
    });

    const graph = {
      nodes: nodes,
      edges: edges
    };

    return graph
  }

  render() {
    const graph = this.createGraph(this.props.rosGraph, this.props.view)
    const events = {
      click: (event) =>  {
        if (event.nodes.length > 0) {
          const index: number = event.nodes[0].indexOf('/')
          let path: string = event.nodes[0]
          let type: RosGraph.PrimitiveType = "node"
          if (index > 0) {
            path = event.nodes[0].slice(index)
            type = event.nodes[0].slice(0, index - 1)
          }
          const node: SimpleNode = {
            path: path,
            name: path,
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
      <div className="ButtonPanel">
        <span className='SmallButton ColorTwo' onClick={() =>
          {
            let lonely = this.state.lonely
            lonely.highlight = !this.state.lonely.highlight
            this.setState({lonely: lonely})
          }
        }>{this.state.lonely.highlight ? "hide lonely" : "lonely"}</span>
      </div>
    </div>
    );
  }
}

export default NodeGraph;
