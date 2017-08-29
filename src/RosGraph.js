import _ from 'lodash';

class RosGraph {
  __init__() {
    this.graph = []
  }

  addNode(fullname, type, input, output) {
    this.graph.push({
      fullname: fullname,
      type: type,
      in: input,
      out: output,
    })
  }

  sort(field) {
    this.graph = _.sortBy(this.graph, field);
  }
}

function getNodes(ros) {
  return new Promise((resolve, reject) => {
    ros.getNodes((list) => {

      var updatedNodesCount = 0;
      var updatedNodes = []

      list.forEach((node) => {
        ros.getNodeDetails(node, (details) => {

          updatedNodes.push({
            fullname: node,
            type: "node",
            out: details.publishing,
            in: [...details.subscribing, ...details.services]
          });

          if (++updatedNodesCount === list.length) {
            const sortedNodes = _.sortBy(updatedNodes, 'fullname');
            return resolve(sortedNodes);
          }
        });
      });
    }, (message) => {
      console.log('RosGraph updateRosGraph failed to getNodes: ' + message);
      return reject('RosGraph updateRosGraph failed to getNodes: ' + message);
    });
  })
}

function getTopics(ros) {
  return new Promise((resolve, reject) => {
    ros.getTopics((topics) => {
      const topicList = topics.topics.map((item, i) => {
        return {
          fullname: item,
          type: "topic",
          messageType: topics.types[i],
        }
      });

      const sortedTopics = _.sortBy(topicList, 'fullname');
      resolve(sortedTopics);
    });
  })
}


export default {
  getRosGraph(ros) {
    var promises = [];

    promises.push(getNodes(ros));
    promises.push(getTopics(ros));

    return Promise.all(promises)
      .then((result) => {
        return _.flatten(result);
      });
  }
}
