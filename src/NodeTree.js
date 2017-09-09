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
  static insert(data, path, path_index, metadata, type) {
    const name = '/' + path[path_index]
    const id = path.slice(0, path_index + 1).join('/')

    const active = metadata.type === type && metadata.active.name === id

    // Add node and stop recursion if root node
    if (path_index === path.length - 1) {
      let treeNode = {
        active: active,
        id: id,
        name: name,
        type: type,
      }
      NodeTree.addDecorator(treeNode, metadata.relations)
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
        toggled: metadata.toggled[type] && metadata.toggled[type].includes(id),
        type: type,
      }) - 1;
    }

    return NodeTree.insert(data[index].children, path, ++path_index, metadata, type);
  }

  /**
   * Create a new tree from a list of nodes
   * @param {string} nodes - The list of nodes
   * @param {array} metadata.toggled - The list of nodes that are toggled (expanded)
   * @param {array} metadata.relations.in - The list of nodes that are inputs (expanded)
   * @param {array} metadata.relations.out - The list of nodes that are outputs (expanded)
   * @return {object} A new full tree
   */
  static getNodeTree(nodes = [], metadata, type = "") {
    if (metadata === undefined) {
      metadata = {
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
      if (!metadata.hidden.includes(node.name)) {
        const path = node.name.split("/")
        NodeTree.insert(data, path, 1, metadata, type);
      }
    });
    return data;
  }

}

export default NodeTree;
