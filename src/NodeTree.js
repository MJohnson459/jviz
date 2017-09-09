import _ from 'lodash';
import React from 'react';

import RosGraphView from './RosGraphView';

/**
 * Create a NodeTree
 * @public
 */
class NodeTree {

  static addDecorator(node, relations) {
    let className = null;

    if (relations.in.includes(node.path)) className = "NodeInput"
    else if (relations.out.includes(node.path)) className = "NodeOutput"

    if (className) {
      node.decorators = {
        Header: props => (
          <div className={className} style={props.style.base}>
            <div style={props.style.title}>{props.node.name}</div>
          </div>
        )
      };
    }
  }


  /**
   * Insert a new node at a location in the tree (recursive)
   * @private
   * @param {object} data - The tree in which to add the node
   * @param {string} path - The full path
   * @param {number} pathIndex - Tracks the recursive level down the path
   * @param {array} toggled - A list of all toggled tree nodes
   */
  static insert(data = [], path, pathIndex, view, type) {
    const name = '/' + path[pathIndex]
    const subpath = path.slice(0, pathIndex + 1).join('/')

    const active = view.type === type && view.active.path === subpath

    let treeNode = {
      name: name,
      active: active,
      path: subpath,
      type: type,
    }

    // Add node and stop recursion if root node
    if (pathIndex === path.length - 1) {
      NodeTree.addDecorator(treeNode, view.relations)
      data.push(treeNode);
      return data;
    }

    // Not a root node so need to check it should be toggled
    var index = _.findIndex(data, (o) => o.path === subpath)
    if (index === -1) {
      treeNode.toggled = view.toggled[type] && view.toggled[type].includes(subpath)
      treeNode.children = []
      index = data.push(treeNode) - 1
    }

    return NodeTree.insert(data[index].children, path, ++pathIndex, view, type);
  }

  /**
   * Create a new tree from a list of nodes
   * @param {string} nodes - The list of nodes
   * @param {array} view.toggled - The list of nodes that are toggled (expanded)
   * @param {array} view.relations.in - The list of nodes that are inputs (expanded)
   * @param {array} view.relations.out - The list of nodes that are outputs (expanded)
   * @return {object} A new full tree
   */
  static getNodeTree(nodes = [], view, type = "") {
    if (view === undefined) {
      view = new RosGraphView()
    }

    var data = [];
    nodes.forEach((node) => {
      if (!view.hidden.includes(node.path)) {
        const path = node.path.split("/")
        NodeTree.insert(data, path, 1, view, type);
      }
    });
    return data;
  }

}

export default NodeTree;
