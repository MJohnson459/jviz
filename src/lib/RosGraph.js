// @flow
import _ from 'lodash';

type Id = string

type PrimitiveType =
  | "action"
  | "node"
  | "service"
  | "topic"

type Node = {
  actions: Array<Id>,
  path: string,
  services: {
    clients: Array<Id>,
  },
  topics: {
    publishers: Array<Id>,
    subscribers: Array<Id>,
  },
  type: "node",
}

type Topic = {
  messageType: string,
  path: string,
  publishers: Array<Id>,
  subscribers: Array<Id>,
  type: "topic",
}

type Service = {
  path: string,
  type: "service",
}

type Action = {
  path: string,
  type: "action",
}

type Primitive = Node | Topic | Service | Action

type Relations = {
  in: Array<Id>,
  out: Array<Id>,
  type: PrimitiveType
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

  getRelations = (path: string, type: PrimitiveType): ?Relations => {
    switch (type) {
      case "node":
        {
          const result: ?Node = _.find(this.nodes, {path: path})
          if (result) {
            return {
                in: result.topics.subscribers,
                out: result.topics.publishers,
                type: "topic"
              }
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

  findNode(path: string, type: PrimitiveType): ?Node | Topic {
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

function getNodeDetails(ros: Object, node: string): Promise<Node> {
  return new Promise((resolve, reject) => {

    ros.getNodeDetails(node, (subscribing: Array<Id>, publishing: Array<Id>, services: Array<Id>) => {
      let detailedNode: Node = {
        path: node,
        actions: [],
        topics: {
          publishers: publishing,
          subscribers: subscribing,
        },
        services: {
          clients: services
        },
        type: "node",
      }

      resolve(detailedNode)

    // Failed callback
  }, (message: string) => {
      console.error("Failed to get node details", node, message)
      reject(message)
    })
  })
}

function getNodes(ros: Object): Promise<Array<Node>> {
  return new Promise((resolve, reject) => {
    ros.getNodes((list) => {
      let newNodes = list.map((node) => getNodeDetails(ros, node))

      Promise.all(newNodes.map(p => p.catch(() => undefined)))
        .then(values => {
          let filteredValues = values.filter((n) => n !== undefined)
          console.table(filteredValues)
          resolve(_.sortBy(filteredValues, 'path'))
        })

    }, (message) => {
      console.log('RosGraph updateRosGraph failed to getNodes: ' + message);
      return reject('RosGraph updateRosGraph failed to getNodes: ' + message);
    });
  })
}

function getTopicRelation(nodes: Array<Node>, topicName: string): {publishers: Array<Id>, subscribers: Array<Id>} {
  let publishers = []
  let subscribers = []
  nodes.forEach((node) => {
    if (node.topics && node.topics.publishers && node.topics.publishers.includes(topicName)) publishers.push(node.path)
    if (node.topics && node.topics.subscribers && node.topics.subscribers.includes(topicName)) subscribers.push(node.path)
  })
  return {
    publishers: publishers,
    subscribers: subscribers
  }
}

function getTopics(ros: Object, nodes: Array<Node>): Promise<{topics: Array<Topic>, nodes: Array<Node>}> {
  return new Promise((resolve, reject) => {
    ros.getTopics((topics) => {
      const topicList: Array<Topic> = topics.topics.map((topicName, i) => {
        const node = getTopicRelation(nodes, topicName)
        return {
          path: topicName,
          messageType: topics.types[i],
          publishers: node.publishers,
          subscribers: node.subscribers,
          type: "topic",
        }
      });
      const sortedTopics: Array<Topic> = _.sortBy(topicList, 'path');
      resolve({
        topics: sortedTopics,
        nodes: nodes
      });

    // Failed callback
    }, (message) => {
      console.error("Failed to get topic", message)
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

function filterGraph(rosGraph: RosGraph, filter: string): RosGraph {
  const nodes = _.filter(rosGraph.nodes, (p) => {return p.path.includes(filter)})
  const topics = _.filter(rosGraph.topics, (p) => {return p.path.includes(filter)})
  const services = _.filter(rosGraph.services, (p) => {return p.path.includes(filter)})
  const actions = _.filter(rosGraph.actions, (p) => {return p.path.includes(filter)})
  return new RosGraph(nodes, topics, services, actions)
}

export {RosGraph, GetRosGraph, filterGraph}
export type {Node, Topic, Service, Action, Relations, Id, Primitive, PrimitiveType}
export default {RosGraph, GetRosGraph}
