// @flow
import * as React from 'react';
import ROSLIB from 'roslib';
import SyntaxHighlighter from 'react-syntax-highlighter';
import YAML from 'yamljs';
// import { Scrollbars } from 'react-custom-scrollbars';
import './styles/dark.css';
import Widget from './Widget';

type Message = {}

function YamlMessage(props: {message: Message}) {
  return (
    <div className="Message">
      <SyntaxHighlighter language="yaml" className="Message" useInlineStyles={false}>
        {YAML.stringify(props.message, 2)}
      </SyntaxHighlighter>
    </div>
  )
}

type Props = {
  onRequestClose?: () => void,
  ros: ROSLIB.Ros,
  topic: string,
  type: string,
}

type State = {
  autoscroll: boolean,
  index: number,
  message: Message,
  messageCount: number,
}

class Subscriber extends React.Component<Props, State> {
  subscriber = new ROSLIB.Topic({
    ros: this.props.ros,
    name: this.props.topic,
    messageType: this.props.type,
  })

  state = {
    autoscroll: true,
    index: -1,
    message: {},
    messageCount: 0,
  }

  componentDidMount = () => {
    this.subscribe();
  }

  componentWillUnmount = () => {
    this.subscriber.unsubscribe();
  }

  subscribe = () => {
    this.subscriber.subscribe((message: Message) => {
      this.setState(prevState => ({
        message: message,
        messageCount: prevState.messageCount += 1,
      }));
    });
  }

  render() {
    let state = "Red"
    if (this.state.messageCount > 0) {
      if (this.state.message) state = "Green"
      else state = "Amber"
    }
    return (
      <Widget name={this.props.topic + " (" + this.state.messageCount + ")"} state={state} onRequestClose={this.props.onRequestClose}>
        <YamlMessage message={this.state.message} />
      </Widget>
    );
  }
}

export default Subscriber;
