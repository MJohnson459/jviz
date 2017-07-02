import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ROSLIB from 'roslib';

class Messages extends Component {

    constructor(props) {
        super();

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
        return (
        <div className="NodeList">
            <p>Topic: {this.state.topic}</p>
            <p>Type: {this.state.messageType}</p>
            <p>Message: {this.state.message}</p>
        </div>
        );
    }
}

Messages.propTypes = {
  ros: PropTypes.instanceOf(ROSLIB.Ros).isRequired,
}

export default Messages;
