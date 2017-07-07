import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import {Treebeard} from 'react-treebeard';
import ROSLIB from 'roslib';
import _ from 'lodash';

import SidebarItem from './SidebarItem.js';
import NodeTree from './NodeTree';
import ButtonPanel from './ButtonPanel';

import styles from './styles/treebeard-theme';

class TopicList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tree: NodeTree.getNodeTree(_.filter(props.rosGraph, {type: "topic"})),
        }

        this.onToggleTree = this.onToggleTree.bind(this);
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        tree: NodeTree.getNodeTree(_.filter(nextProps.rosGraph, {type: "topic"})),
      })
    }

    onToggleTree(node, toggled) {
      // eslint-disable-next-line
      if(this.state.cursor){this.state.cursor.active = false;}
      node.active = true;
      if(node.children){ node.toggled = toggled; }
      this.setState({ cursor: node });
    }

    render() {

      return (
        <SidebarItem name="Topic List">
          <Treebeard
            data={this.state.tree}
            onToggle={this.onToggleTree}
            style={styles}
           />
         <ButtonPanel ros={this.props.ros} addWidget={this.props.addWidget} node={this.state.cursor}>
            <div>
              <ReactTooltip effect="solid" place="right" type="info"/>
              <div data-tip="Refresh the list of topics" className="SmallButton ColorThree" onClick={this.getTopics}>
                Refresh
              </div>
            </div>
          </ButtonPanel>
        </SidebarItem>
      );
    }
}

TopicList.propTypes = {
  ros: PropTypes.instanceOf(ROSLIB.Ros).isRequired,
  addWidget: PropTypes.func.isRequired,
  rosGraph: PropTypes.array.isRequired,
}

export default TopicList;
