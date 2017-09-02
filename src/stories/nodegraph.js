import React, { Component } from 'react';
import ROSLIB from 'roslib';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import RosGraph from '../RosGraph';
import NodeGraph from '../NodeGraph';
import Widget from '../Widget';
import Graph from 'react-graph-vis';
import vis from 'vis';

import styles from '../styles/treebeard-theme';
import '../App.css';

function connectRos() {
  const ros = new ROSLIB.Ros({
    url : "ws://localhost:9090",
  });
  return new Promise((resolve) => {
    ros.on('connection', () => {
      return resolve(ros)
    })
  })
}

class TestNodeGraph extends Component{
  constructor() {super(); this.state = {rosGraph: null}}

  componentDidMount() {
    connectRos()
      .then((ros) => RosGraph.getRosGraph(ros))
      .then((rosGraph) => this.setState({rosGraph: rosGraph}))
  }

  render() {
    if (!this.state.rosGraph) return false
    return (<NodeGraph rosGraph={this.state.rosGraph} metadata={this.state.metadata} />)
  }
}

function TestSimpleNodeGraph() {
  const graph = {
    nodes: [{id: "one", label: "1"}, {id: "two", label: "2"}],
    edges: [{from: "one", to: "two"}],
  }
  const options = {autoResize: true};

  return (
    <div style={{flex: 1, display: "flex"}}>
      <div style={{ flex: 1, display: 'flex', backgroundColor: "grey"}}>
        <Graph graph={graph} options={options} style={{display: "flex", flex: 1, height: "100%"}}/>
      </div>
    </div>)
}

class TestVisNodeGraph extends Component {
  constructor() {
    super();

    this.state = {
      identifier: "TestVis",
    }
  }

  componentDidMount() {
    if (!this.container) return false

    const graph = {
      nodes: [{id: "one", label: "1"}, {id: "two", label: "2"}],
      edges: [{from: "one", to: "two"}],
    }
    const options = {autoResize: true};
    const network = new vis.Network(
        this.container,
        graph,
        options
      );
  }

  render() {
    return (
      <div style={{ flex: '1 1 auto', display: 'flex', backgroundColor: "grey"}}>
        <div id={this.state.identifier} ref={ref => this.container = ref} style={{flex: 1, height: "100%"}}>{this.state.identifier}</div>
      </div>);
  }
}

storiesOf('NodeGraph', module)
  .add('full', () => {
    return(
      <Widget key={"Node_Graph"} name={"Node Graph"} style={{flex: 1}} onRequestClose={() => console.log("Remove Node Graph")}>
        <TestNodeGraph/>
      </Widget>
    )
  })
  .add('basic', () => {
    return(<TestNodeGraph/>)
  })
  .add('graph', () => {
    return(<TestSimpleNodeGraph/>)
  })
  .add('vis', () => {
    return(<TestVisNodeGraph/>)
  });
