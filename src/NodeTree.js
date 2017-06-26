import _ from 'lodash';

class NodeTree {

  static insert(data, path) {
    const name = '/' + path[0]
    if (path.length === 1) {
      data.push({
        name: name
      });
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
    return NodeTree.insert(data[index].children, path.slice(1));
  }

  static addNode(data, name) {
    const path = name.split("/").slice(1)
    console.log("Adding node: ", data, name, path)
    return NodeTree.insert(data, path);
  }

  static getNodeTree(nodes) {
    var data = [];
    nodes.forEach((item) => NodeTree.addNode(data, item.name));
    return data;
  }

}

export default NodeTree;
