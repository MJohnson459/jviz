import React, { Component } from 'react';
import ROSLIB from 'roslib';

class Subscriber extends Component {

    constructor(props) {
        super();
        console.log('Constructing Subscriber');


        this.ros = props.ros;

        this.state = {
            topic: '/listener', //props.topic,
            messageType: 'std_msgs/String', //props.type,
            message: "",
        }

        this.subscriber = new ROSLIB.Topic({
            ros : this.ros,
            name : this.state.topic,
            messageType : this.state.messageType,
        });

        this.subscriber.subscribe((message) => {
            this.setState({
              message: message.data,
            });
        });
    }

    render() {
        console.log('Rendering Subscriber');

        return (
        <div className="NodeList">
            <p>Topic: {this.state.topic}</p>
            <p>Type: {this.state.messageType}</p>
            <p>Message: {this.state.message}</p>
        </div>
        );
    }
}

export default Subscriber;
