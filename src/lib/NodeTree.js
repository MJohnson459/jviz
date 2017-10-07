// @flow
import _ from 'lodash';
import React from 'react';

import RosGraphView from './RosGraphView';
import * as RosGraph from './RosGraph';


type NodeTreeObj = {
  active: boolean,
  children?: Array<NodeTreeObj>,
  decorators?: ?Object,
  name: string,
  path: string,
  toggled?: boolean,
  type: RosGraph.PrimitiveType,
}

type NodeTreeArr = Array<NodeTreeObj>
type NodeTree = NodeTreeObj | NodeTreeArr

function addDecorator(path: string, relations: ?RosGraph.Relations): ?Object {
  let className = null;

  if (relations) {
    if (relations.in.includes(path)) className = "NodeInput"
    if (relations.out.includes(path)) className = "NodeOutput"
  }

  if (className) {
    return {
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
 * @param {array} path - The full path
 * @param {number} pathIndex - Tracks the recursive level down the path
 * @param {array} toggled - A list of all toggled tree nodes
 */
function insert(data: NodeTreeArr = [], path: Array<string>, pathIndex: number, view: RosGraphView, type: RosGraph.PrimitiveType) {
  const name: string = '/' + path[pathIndex]
  const subpath: string = path.slice(0, pathIndex + 1).join('/')
  const active: boolean = view.active ? view.type === type && view.active.path === subpath : false

    // Add node and stop recursion if root node
  if (pathIndex === path.length - 1) {
    const decorator = active ? undefined : addDecorator(subpath, view.relations)
    const leaf: NodeTreeObj = {
      active: active,
      decorators: decorator,
      name: name,
      path: subpath,
      type: type,
    }
    data.push(leaf);
    return data;
  }

  // Not a root node so need to check it should be toggled
  var index: number = _.findIndex(data, (o) => o.path === subpath)
  var stem: ?NodeTreeObj = null
  if (index === -1) {
    const decorator = active ? undefined : addDecorator(subpath, view.relations)
    stem = {
      active: active,
      children: [],
      decorators: decorator,
      name: name,
      path: subpath,
      toggled: !!view.toggled[type] && view.toggled[type].includes(subpath),
      type: type,
    }
    data.push(stem)
  } else {
    stem = data[index]
    stem.children = stem.children || []
    stem.toggled = !!view.toggled[type] && view.toggled[type].includes(subpath)
  }

  return insert(stem.children, path, ++pathIndex, view, type);
}

/**
 * Create a new tree from a list of nodes
 * @param {string} nodes - The list of nodes
 * @param {array} view.toggled - The list of nodes that are toggled (expanded)
 * @param {array} view.relations.in - The list of nodes that are inputs (expanded)
 * @param {array} view.relations.out - The list of nodes that are outputs (expanded)
 * @return {object} A new full tree
 */
function GetNodeTree(nodes: Array<{path: string}> = [], view: RosGraphView = new RosGraphView(), type: RosGraph.PrimitiveType): NodeTree {

  var data: NodeTreeArr = [];
  nodes.forEach((node) => {
    if (!view.hidden.includes(node.path) && (view.search ? node.path.includes(view.search) : true)) {
      const path = node.path.split("/")
      insert(data, path, 1, view, type);
    }
  });
  return data;
}

export {GetNodeTree}
export type {NodeTree}
export default GetNodeTree;
