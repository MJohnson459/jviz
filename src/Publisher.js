import React, { Component } from 'react';
import ROSLIB from 'roslib';
import Widget from './Widget.js'

class Publisher extends Component {

    publish() {
        console.log('Publishing ' + this.state.count);
        var message = new ROSLIB.Message({
            data: this.state.count.toString(),
        });

        this.publisher.publish(message);
        this.setState( {
            count: this.state.count + 1,
        });
    }

    constructor(props) {
        super();
        console.log('Constructing Publisher');


        this.ros = props.ros;

        this.state = {
            topic: '/listener', //props.topic,
            messageType: 'std_msgs/String', //props.type,
            count: 0,
            topics: "",
        }

        this.publisher = new ROSLIB.Topic({
            ros : this.ros,
            name : this.state.topic,
            messageType : this.state.messageType,
        });

        this.ros.getTopics((topicList) => {
            const listItems = topicList.topics.map((item, i) =>
                <option key={item} value={topicList.types[i]}>{item}</option>
            );
            this.setState({
                topics: listItems,
            });
            console.log('NodeList updateNodeList');
        });

        this.publish = this.publish.bind(this);
    }

    render() {
        console.log('Rendering Publisher');

        return (
        <Widget>
            <div className="Publisher">
              <h2>Publisher</h2>
                <select>
                {this.state.topics}
                </select>
                <p>Topic: {this.state.topic}</p>
                <p>Type: {this.state.messageType}</p>
                <button onClick={this.publish}>
                    publish {this.state.count}
                </button>
            </div>
        </Widget>
        );
    }
}

export default Publisher;
