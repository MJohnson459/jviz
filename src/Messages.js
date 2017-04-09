import React, { Component } from 'react';
import ROSLIB from 'roslib';

class Messages extends Component {

    constructor(props) {
        super();
        console.log('Constructing Messages');

        this.state = {
            topics: [], //props.topic,
            messageType: 'std_msgs/String', //props.type,
            message: "",
        }

        this.props.ros.getTopics((topicList) => {
            const listItems = topicList.topics.map((item, i) =>
                <option key={item} value={topicList.types[i]}>{item}</option>
            );
            this.setState({
                topics: topicList,
            });
            console.log('NodeList updateNodeList');
        });

        this.messages = new ROSLIB.Topic({
            ros : this.props.ros,
            name : this.state.topic,
            messageType : this.state.messageType,
        });

        this.messages.subscribe((message) => {
            this.setState({
              message: message.data,
            });
        });
    }

    render() {
        console.log('Rendering Messages');

        return (
        <div className="NodeList">
            <p>Topic: {this.state.topic}</p>
            <p>Type: {this.state.messageType}</p>
            <p>Message: {this.state.message}</p>
        </div>
        );
    }
}

export default Messages;
