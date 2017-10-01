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

/**
 * Draws a list of nodes and gives options for interaction
 * @extends react.Component
 */
class NodeList extends React.Component<Props<*>> {

    render() {
      const tree = NodeTree.GetNodeTree(this.props.nodes, this.props.view, this.props.type)
        return (
        <SidebarItem name={this.props.name}>
            <Treebeard
                data={tree}
                onToggle={this.props.setNodeActive}
                style={styles}
             />
        </SidebarItem>
        );
    }
}

export default NodeList;
