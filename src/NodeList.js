import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import {Treebeard} from 'react-treebeard';
import ROSLIB from 'roslib';

import NodeTree from './NodeTree';
import SidebarItem from './SidebarItem';
import ButtonPanel from './ButtonPanel';

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
            tree: NodeTree.getNodeTree(props.nodes.nodes, props.metadata, this.type),
        }
    }

    /**
     * Called before new props are loaded. Used to update the graph tree
     * @param {object} nextProps - New props to load
     */
    componentWillReceiveProps(nextProps) {
      this.setState({
        tree: NodeTree.getNodeTree(nextProps.nodes.nodes, nextProps.metadata, this.type),
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
           <ButtonPanel ros={this.props.ros} addWidget={this.props.addWidget} node={this.state.cursor}>
              <ReactTooltip effect="solid" place="right" type="info"/>
              <div data-tip="Refresh the list of nodes" className="SmallButton ColorThree" onClick={this.updateNodeList}>
                  Refresh
              </div>
            </ButtonPanel>

        </SidebarItem>
        );
    }
}

NodeList.propTypes = {
  ros: PropTypes.instanceOf(ROSLIB.Ros).isRequired,
  nodes: PropTypes.object.isRequired,
  addWidget: PropTypes.func.isRequired,
  hidden: PropTypes.bool,
  setNodeActive: PropTypes.func.isRequired
}

export default NodeList;
