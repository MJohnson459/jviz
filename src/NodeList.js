// @flow
import * as React from 'react';
import {Treebeard} from 'react-treebeard';
import styles from './styles/treebeard-theme';

import * as NodeTree from './lib/NodeTree';
import * as RosGraph from './lib/RosGraph'
import RosGraphView from './lib/RosGraphView';
import SidebarItem from './SidebarItem';

import type {SimpleNode} from './lib/RosGraphView';

type Props<A> = {
  name: string,
  nodes: Array<A>,
  setNodeActive: (treeNode: SimpleNode, toggled: boolean) => void,
  type: RosGraph.PrimitiveType,
  view: RosGraphView,
}

type State = {
  tree: NodeTree.NodeTree,
}

/**
 * Draws a list of nodes and gives options for interaction
 * @extends react.Component
 */
class NodeList extends React.Component<Props<*>, State> {
    state = {
        tree: NodeTree.GetNodeTree(this.props.nodes, this.props.view, this.props.type),
    }

    /**
     * Called before new props are loaded. Used to update the graph tree
     * @param {object} nextProps - New props to load
     */
    componentWillReceiveProps(nextProps: Props<*>) {
      this.setState({
        tree: NodeTree.GetNodeTree(nextProps.nodes, nextProps.view, this.props.type),
      })
    }

    render() {
        return (
        <SidebarItem name={this.props.name}>
            <Treebeard
                data={this.state.tree}
                onToggle={this.props.setNodeActive}
                style={styles}
             />
        </SidebarItem>
        );
    }
}

export default NodeList;
