// @flow

import _ from 'lodash';

type Id = string

type Node = {
  path: string,
  topics: Object,
  services: Object,
  actions: Object,
}

type Topic = {

}

type Service = {

}

type Action = {

}

type RosType = Node | Topic | Service | Action

type Relations = {
  in: Array<Id>,
  out: Array<Id>,
  type: string
}

class RosGraph {
  nodes: Array<Node>
  topics: Array<Topic>
  services: Array<Service>
  actions: Array<Action>

  constructor(nodes: Array<Node> = [], topics: Array<Topic> = [], services: Array<Service> = [], actions: Array<Action> = []) {
    this.nodes = nodes
    this.topics = topics
    this.services = services
    this.actions = actions
  }

  getRelations(path: string, type: string): ?Relations {
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
  }

  findNode(path: string, type: string): ?Node | Topic {
    switch (type) {
      case "node":
          return _.find(this.nodes, {
            path: path
          })
      case "topic":
          return _.find(this.topics, {
            path: path
          })
      default:
    }
  }
}

function getNodes(ros: Object): Promise<Array<Node>> {
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

function getTopicRelation(nodes: Array<Node>, topicName: string) {
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

function getTopics(ros: Object, nodes: Array<Node>): Promise<{topics: Array<Topic>, nodes: Array<Node>}> {
  return new Promise((resolve, reject) => {
    ros.getTopics((topics) => {
      const topicList = topics.topics.map((topicName, i) => {
        const node = getTopicRelation(nodes, topicName)
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

function GetRosGraph(ros: RosGraph): Promise<RosGraph> {
  return new Promise((resolve, reject) => {
    return getNodes(ros)
      .then((nodes) => getTopics(ros, nodes))
      .then(({topics,nodes}) => resolve(new RosGraph(nodes, topics)))
  })
}

export {RosGraph, GetRosGraph}
export type {Node, Topic, Service, Action, Relations, Id, RosType}
export default {RosGraph, GetRosGraph}
