import React, { Component } from 'react';
import ROSLIB from 'roslib';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles';

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
            x = JSON.stringify(this.state.message,null,'\t');
        } catch(e) {
            x = this.state.message;
        }

        return (
        <div className="NodeList">
            <h2>{this.state.topic}</h2>
            <p>Type: {this.state.messageType}</p>
            <p>Message: </p>
            <SyntaxHighlighter language="javascript" style={docco}>
                {x}
            </SyntaxHighlighter>
        </div>
        );
    }
}

export default Subscriber;
