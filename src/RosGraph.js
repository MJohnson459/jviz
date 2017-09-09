import _ from 'lodash';

class Nodes {
  //   nodes: [{
  //     name: "",
  //     topics: {
  //       publishers: [""], // topics.name
  //       subscribers: [""] // topics.name
  //     },
  //     services: {
  //       servers: [""], // services.name
  //       clients: [""]  // services.name
  //     },
  //     actions: {
  //       servers: [""], // actions.name
  //       clients: [""]  // actions.name
  //     }
  //   }],

  constructor() {
    this.nodes = []
  }

  push({
    name,
    topics,
    services,
    actions
  }) {
    this.nodes.push({
      name: name,
      topics: topics,
      services: services,
      actions: actions,
    })
  }

  getTopicRelation(topicName) {
    let publishers = []
    let subscribers = []
    this.nodes.forEach((node) => {
      if (node.topics.publishers.includes(topicName)) publishers.push(node.name)
      if (node.topics.subscribers.includes(topicName)) subscribers.push(node.name)
    })
    return {
      publishers: publishers,
      subscribers: subscribers
    }
  }

  sort() {
    this.nodes = _.sortBy(this.nodes, 'name');
    return this
  }
}

class RosGraph {

  // {
  //   Nodes,
  //   Topics,
  //   services: [{
  //     name: "",
  //     type: "",
  //     server: "",   // nodes.name
  //     clients: [""] // nodes.name
  //   }],
  //   actions: [{
  //     name: "",
  //     type: "",
  //     server: "",   // nodes.name
  //     clients: [""] // nodes.name
  //   }]
  // }

  constructor(nodes = new Nodes(), topics = [], services = [], actions = []) {
    this.nodes = nodes
    this.topics = topics
    this.services = services
    this.actions = actions

    this.hidden = {
      nodes: [],
      topics: [],
      services: [],
      actions: []
    }
  }

  getRelations(name, type) {
    switch (type) {
      case "node":
        {
          const result = _.find(this.nodes.nodes, {
            name: name
          })
          if (result) return { in: result.topics.subscribers,
            out: result.topics.publishers,
            type: "topic"
          }
        }
        break
      case "topic":
        {
          const result = _.find(this.topics, {
            name: name
          })
          if (result) return { in: result.publishers,
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

  findNode(name, type) {
    switch (type) {
      case "node":
          return _.find(this.nodes.nodes, {
            name: name
          })
      case "topic":
          return _.find(this.topics, {
            name: name
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
      var newNodes = new Nodes()

      list.forEach((node) => {
        ros.getNodeDetails(node, (details) => {
          newNodes.push({
            name: node,
            topics: {
              publishers: details.publishing,
              subscribers: details.subscribing,
            },
            services: {
              clients: details.services
            }
          });

          if (++updatedNodesCount === list.length) {
            return resolve(newNodes.sort());
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
        const node = nodes.getTopicRelation(topicName)
        return {
          name: topicName,
          messageType: topics.types[i],
          publishers: node.publishers,
          subscribers: node.subscribers,
        }
      });
      const sortedTopics = _.sortBy(topicList, 'name');
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
