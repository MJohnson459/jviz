import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import {Treebeard} from 'react-treebeard';

import NodeTree from './NodeTree';
import RosGraphView from './RosGraphView';
import SidebarItem from './SidebarItem';

import styles from './styles/treebeard-theme';

/**
 * Draws a list of nodes and gives options for interaction
 * @extends react.Component
 */
class NodeList extends Component {

    constructor(props) {
        super(props);

        this.type = "node"

        this.state = {
            tree: NodeTree.getNodeTree(props.nodes.nodes, props.view, this.type),
        }
    }

    /**
     * Called before new props are loaded. Used to update the graph tree
     * @param {object} nextProps - New props to load
     */
    componentWillReceiveProps(nextProps) {
      this.setState({
        tree: NodeTree.getNodeTree(nextProps.nodes.nodes, nextProps.view, this.type),
      })
    }

    render() {
        return (
        <SidebarItem name="Node List" hidden={this.props.hidden}>
            <Treebeard
                data={this.state.tree}
                onToggle={this.props.setNodeActive}
                style={styles}
             />
        </SidebarItem>
        );
    }
}

NodeList.propTypes = {
  view: PropTypes.instanceOf(RosGraphView).isRequired,
  nodes: PropTypes.object.isRequired,
  setNodeActive: PropTypes.func.isRequired,
}

export default NodeList;
