import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import {Treebeard} from 'react-treebeard';
import styles from './styles/treebeard-theme';
import _ from 'lodash';

function insert(data, path) {
  if (path.length === 1) {
    data.push({
      name: path[0]
    });
    return data;
  }
  var index = _.findIndex(data, (o) => o.name === path[0])
  if (index === -1) {
    /// add new element
    index = data.push({
      name: path[0],
      toggled: false,
      children: [],
    }) - 1;
  }
  return insert(data[index].children, path.slice(1));
}

function add_node(data, name) {
  const path = name.split('/').slice(1)
  return insert(data, path);
}

class NodeTree extends Component {

  constructor(props) {
    super(props);

    var data = [];
    props.nodes.forEach((item) => add_node(data, item.name))

    this.state = {
      data: data,
    };

    this.onToggle = this.onToggle.bind(this);
  }

  onToggle(node, toggled) {
    if(this.state.cursor){this.state.cursor.active = false;}
    node.active = true;
    if(node.children){ node.toggled = toggled; }
    this.setState({ cursor: node });
  }

  render() {

    return (
      <Treebeard
          data={this.state.data}
          onToggle={this.onToggle}
          style={styles}
       />
    );
  }
}

export default NodeTree;
