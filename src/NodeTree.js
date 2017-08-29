import _ from 'lodash';
import React from 'react';

/**
 * Create a NodeTree
 * @public
 */
class NodeTree {

  static addDecorator(node) {
    let className = null;
    if(node.highlight) className = "highlight"
    else if (node.active) className = "NodeActive"
    else if (node.relation === "Input") className = "NodeInput"
    else if (node.relation === "Output") className = "NodeOutput"

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
  static insert(data, path, path_index, toggled) {
    const name = '/' + path[path_index]
    const fullname = '/' + path.slice(1, path_index + 1).join('/')

    // Add node and stop recursion if root node
    if (path_index === path.length - 1) {
      let treeNode = {
        name: name,
        fullname: fullname
      }
      NodeTree.addDecorator(treeNode)
      data.push(treeNode);
      return data;
    }

    var index = _.findIndex(data, (o) => o.name === name)
    if (index === -1) {
      /// add new element
      index = data.push({
        name: name,
        fullname: fullname,
        toggled: toggled.includes(fullname),
        children: [],
      }) - 1;
    }

    // // Maintain active states
    // if (metadata.active === name) {
    //   data[index].toggled = true;
    // }
    //
    // if (node.highlight) {
    //   NodeTree.addDecorator(data[index])
    // }

    return NodeTree.insert(data[index].children, path, ++path_index, toggled);
  }

  /**
   * Add a new node to the tree
   * @param {object} data - The tree in which to add the node
   * @param {object} node - Data to add at the node location (the leaf)
   * @param {string} node.name - Data to add at the node location (the leaf)
   * @return {object} Updated tree
   */
  static addNode(data, node, toggled) {
    const path = node.name.split("/")
    // console.log("Adding node: ", data, name, path)
    // Start at 1 to remove empty first item as name begins
    // with a '/'
    return NodeTree.insert(data, path, 1, toggled);
  }

  /**
   * Create a new tree from a list of nodes
   * @param {string} nodes - The list of nodes
   * @param {array} metadata.toggled - The list of nodes that are toggled (expanded)
   * @return {object} A new full tree
   */
  static getNodeTree(nodes = [], metadata) {
    if (metadata === undefined) {
      metadata = {
        toggled: [],
        hidden: [],
      }
    }

    var data = [];
    nodes.forEach((node) => {
      if (!metadata.hidden.includes(node.name)) NodeTree.addNode(data, node, metadata.toggled)
    });
    return data;
  }

}

export default NodeTree;
