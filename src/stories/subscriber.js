import React, { Component } from 'react';
import ROSLIB from 'roslib';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Widget from '../Widget';
import SubscriberFeed from '../SubscriberFeed'
import Subscriber from '../lib/Subscriber'
import '../styles/App.css';

function connectRos() {
  const ros = new ROSLIB.Ros({
    url : "ws://localhost:9090",
  });
  return new Promise((resolve) => {
    ros.on('connection', () => {
      return resolve(ros)
    })
    ros.on('error', (error) => {
      console.log(error)
      return reject()
    })
  })
}

class TestSubscriberComponent extends Component {
  constructor() {
    super();
    this.state = {
      subscriber: null,
    }
  }

  componentDidMount() {
    connectRos()
      .then((ros) => {
        this.setState({subscriber: new Subscriber(ros, "/chatter", "std_msgs/String")})
      })
      .catch(console.log("shits on fire, yo!"))

  }

  render() {
    if (!this.state.subscriber) return false
    return (<SubscriberFeed subscriber={this.state.subscriber} />)
  }
}

storiesOf('Subscriber', module)
  .add('full', () => {
    return(
      <Widget key={"Subscriber"} name={"Node Graph"} style={{flex: 1}} onRequestClose={() => console.log("Remove Node Graph")}>
        <TestSubscriberComponent/>
      </Widget>
    )
  })
  .add('basic', () => {
    return(<TestSubscriberComponent/>)
  })
