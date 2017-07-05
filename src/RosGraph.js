import ROSLIB from 'roslib';
import _ from 'lodash';

function getNodes(ros) {
  return new Promise((resolve, reject) => {
    ros.getNodes((list) => {

      var updatedNodesCount = 0;
      var updatedNodes = []

      list.forEach((node) => {
        ros.getNodeDetails(node, (details) => {

          updatedNodes.push({
            name: node,
            type: "node",
            out: details.publishing,
            in: [...details.subscribing, ...details.services]
          });

          if (++updatedNodesCount === list.length) {
              const sortedNodes = _.sortBy(updatedNodes, 'name');
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
      const topicList = topics.topics.map((item, i) =>
        {
          return {
            name: item,
            type: "topic",
            messageType: topics.types[i],
          }
        }
      );

      const sortedTopics = _.sortBy(topicList, 'name');
      resolve(sortedTopics);
    });
  })
}


export default {
  getRosGraph(ros) {
    var promises = [];

    promises.push(getNodes(ros));
    promises.push(getTopics(ros));

    return Promise.all(promises).then((result) => {
      return _.flatten(result);
    });
  }
}
