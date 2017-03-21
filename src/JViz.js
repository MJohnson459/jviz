import React, { Component } from 'react';
import ROSLIB from 'roslib';
import NodeList from './NodeList';
import TopicList from './TopicList';
import Publisher from './Publisher';
import Subscriber from './Subscriber';
import './App.css';

class JViz extends Component {


    constructor(props) {
        super();
        console.log('Constructing JViz');

        this.state = {
            message: "empty",
            connected: false,
            subscribers: [],
        }

        this.ros = props.ros;
        this.createSubscriber = this.createSubscriber.bind(this)
    }

    createSubscriber(topic, type) {
      console.log("Creating subscriber", topic, type)
      const subscribers = this.state.subscribers;
      subscribers.push([topic, type]);
      this.setState({
        subscribers: subscribers,
      })
      console.log("Subscribers", subscribers);
    }

  render() {
    console.log('Rendering JViz', this.state);
    return (
      <div className="App">
        <div>
            <NodeList ros={this.ros} />
            <TopicList ros={this.ros} createSubscriber={this.createSubscriber}/>
            <Publisher ros={this.ros} />
            {
                this.state.subscribers.map((item) =>
                    <Subscriber key={item[0]} ros={this.ros} topic={item[0]} type={item[1]} />
                )
            }
        </div>
      </div>
    );
  }
}

export default JViz;
