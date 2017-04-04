import React, { Component } from 'react';
import ROSLIB from 'roslib';
import SyntaxHighlighter from 'react-syntax-highlighter';
import Widget from './Widget.js';
import YAML from 'yamljs';
import { Scrollbars } from 'react-custom-scrollbars';
import './styles/dark.css';

class Subscriber extends Component {

    constructor(props) {
        super(props);
        console.log('Constructing Subscriber');

        this.ros = props.ros;

        this.state = {
            topic: props.topic,
            messageType: props.type,
            messages: [],
            message: {},
        }

        this.subscribe();
    }

    // componentWillUnmount() {
    //     // this.subscriber.unsubscribe();
    // }

    subscribe() {
      console.log("this.state.topic: " + this.state.topic)
      this.subscriber = new ROSLIB.Topic({
          ros : this.ros,
          name : this.state.topic,
          messageType : this.state.messageType,
      });

      this.subscriber.subscribe((message) => {
          this.setState(prevState => ({
            // messages: [...prevState.messages, message],
            message: message,
          }));
      });
    }

    render() {
        console.log('Rendering Subscriber');

        // console.log("Subscriber render: ", this.state.messages);

        // <ul>
        // {
        //     this.state.messages.map((message, i) =>
        //         <li key={i}>
        //             <SyntaxHighlighter language="yaml" style={docco}>
        //                 {YAML.stringify(message, 2)}
        //             </SyntaxHighlighter>
        //         </li>
        //     )
        // }
        // </ul>

        return (
        <Widget {...this.props} name={this.state.topic}>
            <Scrollbars className={"Subscriber"} style={{ height: "100%" }}>
                <SyntaxHighlighter language="yaml" className={"Message"} useInlineStyles={false}>
                    {YAML.stringify(this.state.message, 2)}
                </SyntaxHighlighter>
                {this.props.children}
            </Scrollbars>
        </Widget>
        );
    }
}

export default Subscriber;
