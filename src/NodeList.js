import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import {Treebeard} from 'react-treebeard';
import ROSLIB from 'roslib';
import _ from 'lodash';

import NodeTree from './NodeTree';
import SidebarItem from './SidebarItem';
import NodeGraph from './NodeGraph';
import ButtonPanel from './ButtonPanel';

import styles from './styles/treebeard-theme';

class NodeList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tree: NodeTree.getNodeTree(_.filter(props.rosGraph, {type: "node"})),
        }

        this.addNodeGraph = this.addNodeGraph.bind(this);
        this.onToggleTree = this.onToggleTree.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        tree: NodeTree.getNodeTree(_.filter(nextProps.rosGraph, {type: "node"})),
      })
    }

    addNodeGraph() {
        this.props.addWidget("node_graph", (
            <NodeGraph key={"node_graph"} ros={this.props.ros} nodeList={this.props.rosGraph} />
        ))
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
        <SidebarItem name="Node List" hidden={this.props.hidden}>
            <Treebeard
                data={this.state.tree}
                onToggle={this.onToggleTree}
                style={styles}
             />
           <ButtonPanel ros={this.props.ros} addWidget={this.props.addWidget}>
              <ReactTooltip effect="solid" place="right" type="info"/>
              <div data-tip="Refresh the list of nodes" className="SmallButton ColorThree" onClick={this.updateNodeList}>
                  Refresh
              </div>
              <div data-tip="Create a Node Graph Widget" className="SmallButton ColorTwo" onClick={this.addNodeGraph}>
                  Node Graph
              </div>
            </ButtonPanel>

        </SidebarItem>
        );
    }
}

NodeList.propTypes = {
  ros: PropTypes.instanceOf(ROSLIB.Ros).isRequired,
  addWidget: PropTypes.func.isRequired,
  hidden: PropTypes.bool,
}

export default NodeList;
