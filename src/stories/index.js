import React, { Component } from 'react';
import ROSLIB from 'roslib';
import {Treebeard} from 'react-treebeard';
import _ from 'lodash';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { Welcome } from '@storybook/react/demo';

import NodeTree from '../NodeTree';
import RosGraph from '../RosGraph';
import NodeGraph from '../NodeGraph';
import Widget from '../Widget';

import styles from '../styles/treebeard-theme';
import '../App.css';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

class MockTopicList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tree: [],
    }

    const ros = new ROSLIB.Ros({
      url : "ws://localhost:9090",
    });


    ros.on('connection', () => {
      console.log('Connected to websocket server.');

      RosGraph.getRosGraph(ros).then((graph) => {
        console.table(graph)
        this.setState({
          tree: NodeTree.getNodeTree(_.filter(graph, {type: "node"})),
        });
      });
    });
  }

  render() {
    return (<Treebeard
        data={this.state.tree}
        onToggle={() => console.log("toggled")}
        style={styles}
     />)
  }
}

storiesOf('RosGraph', module)
  .add('basic', () => <MockTopicList />);

function connectRos(ros) {
  return new Promise((resolve) => {
    ros.on('connection', () => {
      return resolve()
    })
  })
}

storiesOf('NodeGraph', module)
  .add('basic', () => {
    const ros = new ROSLIB.Ros({
      url : "ws://localhost:9090",
    });

    const promise = connectRos(ros)
      .then(RosGraph.getRosGraph(ros))
      .then((graph) => {
        return NodeTree.getNodeTree(_.filter(graph, {type: "node"}));
      });

    console.table(promise);

    return(
      <Widget key={"Node_Graph"} name={"Node Graph"} onRequestClose={() => console.log("Remove Node Graph")}>
        <NodeGraph nodeList={promise.state === "fulfilled" ? promise.value : []} />
      </Widget>
    )
  });
