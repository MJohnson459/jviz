import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import {Treebeard} from 'react-treebeard';

import NodeTree from './lib/NodeTree';
import RosGraphView from './lib/RosGraphView';
import SidebarItem from './SidebarItem';

import styles from './styles/treebeard-theme';

/**
 * Draws a list of nodes and gives options for interaction
 * @extends react.Component
 */
class NodeList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tree: NodeTree.getNodeTree(props.nodes, props.view, props.type),
        }
    }

    /**
     * Called before new props are loaded. Used to update the graph tree
     * @param {object} nextProps - New props to load
     */
    componentWillReceiveProps(nextProps) {
      this.setState({
        tree: NodeTree.getNodeTree(nextProps.nodes, nextProps.view, this.props.type),
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
  nodes: PropTypes.array.isRequired,
  setNodeActive: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  view: PropTypes.instanceOf(RosGraphView).isRequired,
}

export default NodeList;
