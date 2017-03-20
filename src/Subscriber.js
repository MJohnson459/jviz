import React, { Component } from 'react';
import ROSLIB from 'roslib';

class Subscriber extends Component {

    constructor(props) {
        super();
        console.log('Constructing Subscriber');

        this.ros = props.ros;

        this.state = {
            topics: {topics: [], types: []},
            topic: '', //props.topic,
            messageType: '', //props.type,
            message: "",
        }

        this.ros.getTopics((topics) => {
            console.log(topics);
            this.setState({
                topics: topics,
            });

            if (topics.topics.length > 0) {
              this.subscribe(topics.topics[0], topics.types[0])
            }
        });

        this.handleChange = this.handleChange.bind(this);
        this.subscribe = this.subscribe.bind(this);
    }

    handleChange(event) {
        this.subscribe(this.state.topics.topics[event.target.value],
          this.state.topics.types[event.target.value]);
    }

    subscribe(topic, messageType) {
      if (this.subscriber != undefined) {
          console.log("Unsubscribing")
          this.subscriber.unsubscribe();
      }

      console.log("this.state.topic: " + this.state.topic)
      this.subscriber = new ROSLIB.Topic({
          ros : this.ros,
          name : topic,
          messageType : messageType,
      });

      this.subscriber.subscribe((message) => {
          this.setState({
              message: message.data,
          });
      });

      this.setState({
          topic: topic,
          messageType: messageType,
          message: "",
      });
    }

    render() {
        console.log('Rendering Subscriber');

        return (
        <div className="NodeList">
            <h2>Subscriber</h2>
            <select onChange={this.handleChange}>
                {this.state.topics.topics.map((item, i) =>
                    <option key={item} value={i}>{item}</option>
                )}
            </select>

            <p>Topic: {this.state.topic}</p>
            <p>Type: {this.state.messageType}</p>
            <p>Message: {this.state.message}</p>
        </div>
        );
    }
}

export default Subscriber;
