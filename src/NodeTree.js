import _ from 'lodash';
import React from 'react';

/**
 * Create a NodeTree
 * @public
 */
class NodeTree {
  /**
   * Insert a new node at a location in the tree (recursive)
   * @private
   * @param {object} data - The tree in which to add the node
   * @param {string} path - The full path
   * @param {number} path_index - Tracks the recursive level down the path
   * @param {object} node - The information to add at the node location
   */
  static insert(data, path, path_index, node, metadata) {
    const name = '/' + path[path_index]
    // Add node and stop recursion if root node
    if (path_index === path.length - 1) {
      node.name = name;
      let className = null;
      if (node.active) className = "NodeActive"
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
      } else {
        node.decorators = undefined
      }
      data.push(node);
      return data;
    }
    var index = _.findIndex(data, (o) => o.name === name)
    if (index === -1) {
      let toggled = false
      if (metadata.toggled.includes(name)
        || node.active) toggled = true
      /// add new element
      index = data.push({
        name: name,
        toggled: toggled,
        children: [],
      }) - 1;
    }

    // Maintain active states
    if (node.active) {
      data[index].toggled = true;
    }

    if (node.highlight) {
      data[index].decorators = {
        Header: (props) => {
          return (
            <div className="highlight" style={props.style.base}>
              <div style={props.style.title}>
                {props.node.name}
              </div>
            </div>
          );
        },
      };
    }

    return NodeTree.insert(data[index].children, path, ++path_index, node, metadata);
  }

  /**
   * Add a new node to the tree
   * @param {object} data - The tree in which to add the node
   * @param {object} node - Data to add at the node location (the leaf)
   * @param {string} node.name - Data to add at the node location (the leaf)
   * @return {object} Updated tree
   */
  static addNode(data, node, metadata) {
    const path = node.name.split("/")
    // console.log("Adding node: ", data, name, path)
    // Start at 1 to remove empty first item as name begins
    // with a '/'
    return NodeTree.insert(data, path, 1, node, metadata);
  }

  /**
   * Create a new tree from a list of nodes
   * @param {string} nodes - The list of nodes
   * @param {array} metadata.toggled - The list of nodes that are toggled (expanded)
   * @return {object} A new full tree
   */
  static getNodeTree(nodes, metadata) {
    if (nodes === undefined) return {}
    if (metadata === undefined) {
      metadata = {
        toggled: []
      }
    }
    var data = [];
    nodes.forEach((node) => NodeTree.addNode(data, node, metadata));
    return data;
  }

}

export default NodeTree;
