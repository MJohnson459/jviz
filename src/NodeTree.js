import _ from 'lodash';
import React from 'react';

/**
 * Create a NodeTree
 * @public
 */
class NodeTree {

  static addDecorator(node, relations) {
    let className = null;

    if (relations.in.includes(node.id)) className = "NodeInput"
    else if (relations.out.includes(node.id)) className = "NodeOutput"

    if (className) {
      node.decorators = {
        Header: (props) => {
          return (
            <div className={className} style={props.style.base}>
              <div style={props.style.title}>
                {props.node.name}
              </div>
            </div>
          );
        },
      };
    }
  }


  /**
   * Insert a new node at a location in the tree (recursive)
   * @private
   * @param {object} data - The tree in which to add the node
   * @param {string} path - The full path
   * @param {number} path_index - Tracks the recursive level down the path
   * @param {array} toggled - A list of all toggled tree nodes
   */
  static insert(data, path, path_index, view, type) {
    const name = '/' + path[path_index]
    const id = path.slice(0, path_index + 1).join('/')

    const active = view.type === type && view.active.name === id

    // Add node and stop recursion if root node
    if (path_index === path.length - 1) {
      let treeNode = {
        active: active,
        id: id,
        name: name,
        type: type,
      }
      NodeTree.addDecorator(treeNode, view.relations)
      data.push(treeNode);
      return data;
    }

    var index = _.findIndex(data, (o) => o.name === name)
    if (index === -1) {
      /// add new element
      index = data.push({
        active: active,
        children: [],
        id: id,
        name: name,
        toggled: view.toggled[type] && view.toggled[type].includes(id),
        type: type,
      }) - 1;
    }

    return NodeTree.insert(data[index].children, path, ++path_index, view, type);
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
      view = {
        toggled: [],
        hidden: [],
        relations: {
          in: [],
          out: [],
        }
      }
    }

    var data = [];
    nodes.forEach((node) => {
      if (!view.hidden.includes(node.name)) {
        const path = node.name.split("/")
        NodeTree.insert(data, path, 1, view, type);
      }
    });
    return data;
  }

}

export default NodeTree;
