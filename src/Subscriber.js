import React, { Component } from 'react';
import ROSLIB from 'roslib';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles';
import Widget from './Widget.js';
import YAML from 'yamljs';

class Subscriber extends Component {

    constructor(props) {
        super(props);
        console.log('Constructing Subscriber');

        this.ros = props.ros;

        this.state = {
            topic: props.topic,
            messageType: props.type,
            message: {},
        }

        this.subscribe();
    }

    subscribe() {
      console.log("this.state.topic: " + this.state.topic)
      this.subscriber = new ROSLIB.Topic({
          ros : this.ros,
          name : this.state.topic,
          messageType : this.state.messageType,
      });

      this.subscriber.subscribe((message) => {
          this.setState({
              message: message,
          });
      });
    }

    render() {
        console.log('Rendering Subscriber');
        var x = "";
        try {
            x = YAML.stringify(this.state.message, 2);
        } catch(e) {
            x = this.state.message;
        }

        return (
        <Widget>
            <div className="Subscriber">
                <h2>{this.state.topic}</h2>
                <p>Type: {this.state.messageType}</p>
                <p>Message: </p>
                <SyntaxHighlighter language="yaml" style={docco}>
                    {x}
                </SyntaxHighlighter>
            </div>
        </Widget>
        );
    }
}

export default Subscriber;
