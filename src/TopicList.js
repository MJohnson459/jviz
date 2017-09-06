import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import {Treebeard} from 'react-treebeard';
import ROSLIB from 'roslib';

import SidebarItem from './SidebarItem.js';
import NodeTree from './NodeTree';
import ButtonPanel from './ButtonPanel';

import styles from './styles/treebeard-theme';

class TopicList extends Component {

    constructor(props) {
        super(props);

        this.type = "topic"

        this.state = {
            tree: NodeTree.getNodeTree(props.topics, props.metadata, this.type),
        }
        
    }

    /**
     * Called before new props are loaded. Used to update the graph tree
     * @param {object} nextProps - New props to load
     */
    componentWillReceiveProps(nextProps) {
      this.setState({
        tree: NodeTree.getNodeTree(nextProps.topics, nextProps.metadata, this.type),
      })
    }

    render() {
      return (
        <SidebarItem name="Topic List">
          <Treebeard
            data={this.state.tree}
            onToggle={this.props.setNodeActive}
            style={styles}
           />
         <ButtonPanel ros={this.props.ros} addWidget={this.props.addWidget} node={this.state.cursor} />
        </SidebarItem>
      );
    }
}

TopicList.propTypes = {
  ros: PropTypes.instanceOf(ROSLIB.Ros).isRequired,
  addWidget: PropTypes.func.isRequired,
  topics: PropTypes.array.isRequired,
  setNodeActive: PropTypes.func.isRequired,
}

export default TopicList;
