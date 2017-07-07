import _ from 'lodash';

class NodeTree {

  static insert(data, path, path_index, node) {
    const name = '/' + path[path_index]
    // Add node and stop recursion if root node
    if (path_index === path.length - 1) {
      node.name = name;
      data.push(node);
      return data;
    }
    var index = _.findIndex(data, (o) => o.name === name)
    if (index === -1) {
      /// add new element
      index = data.push({
        name: name,
        toggled: false,
        children: [],
      }) - 1;
    }
    return NodeTree.insert(data[index].children, path, ++path_index, node);
  }

  static addNode(data, node) {
    const path = node.fullname.split("/")
    // console.log("Adding node: ", data, name, path)
    // Start at 1 to remove empty first item as name begins
    // with a '/'
    return NodeTree.insert(data, path, 1, node);
  }

  static getNodeTree(nodes) {
    var data = [];
    nodes.forEach((node) => NodeTree.addNode(data, node));
    return data;
  }

}

export default NodeTree;
