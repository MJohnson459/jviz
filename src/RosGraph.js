import _ from 'lodash';

class Nodes {
  //   nodes: [{
  //     path: "",
  //     topics: {
  //       publishers: [""], // topics.path
  //       subscribers: [""] // topics.path
  //     },
  //     services: {
  //       servers: [""], // services.path
  //       clients: [""]  // services.path
  //     },
  //     actions: {
  //       servers: [""], // actions.path
  //       clients: [""]  // actions.path
  //     }
  //   }],

  static getTopicRelation(nodes, topicName) {
    let publishers = []
    let subscribers = []
    nodes.forEach((node) => {
      if (node.topics.publishers.includes(topicName)) publishers.push(node.path)
      if (node.topics.subscribers.includes(topicName)) subscribers.push(node.path)
    })
    return {
      publishers: publishers,
      subscribers: subscribers
    }
  }

  sort() {
    this.nodes = _.sortBy(this.nodes, 'path');
    return this
  }
}

class RosGraph {

  // {
  //   Nodes,
  //   Topics,
  //   services: [{
  //     path: "",
  //     type: "",
  //     server: "",   // nodes.path
  //     clients: [""] // nodes.path
  //   }],
  //   actions: [{
  //     path: "",
  //     type: "",
  //     server: "",   // nodes.path
  //     clients: [""] // nodes.path
  //   }]
  // }

  constructor(nodes = [], topics = [], services = [], actions = []) {
    this.nodes = nodes
    this.topics = topics
    this.services = services
    this.actions = actions
  }

  getRelations(path, type) {
    switch (type) {
      case "node":
        {
          const result = _.find(this.nodes, {path: path})
          if (result)
            return {
                in: result.topics.subscribers,
                out: result.topics.publishers,
                type: "topic"
              }
        }
        break
      case "topic":
        {
          const result = _.find(this.topics, {path: path})
          if (result)
            return {
              in: result.publishers,
              out: result.subscribers,
              type: "node"
            }
        }
        break
      default:
    }

    return {
        in: [],
        out: []
      }

  }

  findNode(path, type) {
    switch (type) {
      case "node":
          return _.find(this.nodes.nodes, {
            path: path
          })
      case "topic":
          return _.find(this.topics, {
            path: path
          })
      default:
    }

    return null
  }
}

function getNodes(ros) {
  return new Promise((resolve, reject) => {
    ros.getNodes((list) => {

      var updatedNodesCount = 0;
      var newNodes = []

      list.forEach((node) => {
        ros.getNodeDetails(node, (details) => {
          newNodes.push({
            path: node,
            topics: {
              publishers: details.publishing,
              subscribers: details.subscribing,
            },
            services: {
              clients: details.services
            }
          });

          if (++updatedNodesCount === list.length) {
            return resolve(_.sortBy(newNodes, 'path'));
          }
        });
      });
    }, (message) => {
      console.log('RosGraph updateRosGraph failed to getNodes: ' + message);
      return reject('RosGraph updateRosGraph failed to getNodes: ' + message);
    });
  })
}

function getTopics(ros, nodes) {
  return new Promise((resolve, reject) => {
    ros.getTopics((topics) => {
      const topicList = topics.topics.map((topicName, i) => {
        const node = Nodes.getTopicRelation(nodes, topicName)
        return {
          path: topicName,
          messageType: topics.types[i],
          publishers: node.publishers,
          subscribers: node.subscribers,
        }
      });
      const sortedTopics = _.sortBy(topicList, 'path');
      resolve({
        topics: sortedTopics,
        nodes: nodes
      });
    });
  })
}

export default {
  RosGraph,
  getRosGraph(ros) {
    return new Promise((resolve, reject) => {
      return getNodes(ros)
        .then((nodes) => getTopics(ros, nodes))
        .then(({
          topics,
          nodes
        }) => resolve(new RosGraph(nodes, topics)))
    })
  }
}
