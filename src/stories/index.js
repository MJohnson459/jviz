import React, { Component } from 'react';
import ROSLIB from 'roslib';
import {Treebeard} from 'react-treebeard';
import _ from 'lodash';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { Welcome } from '@storybook/react/demo';

import NodeTree from '../lib/NodeTree';
import RosGraph from '../lib/RosGraph';

import styles from '../styles/treebeard-theme';
import '../styles/App.css';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

function connectRos(ros) {
  return new Promise((resolve) => {
    ros.on('connection', () => {
      return resolve()
    })
  })
}

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
          tree: NodeTree.getNodeTree(graph),
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
