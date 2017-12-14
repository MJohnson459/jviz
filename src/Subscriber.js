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
    return (
      <Widget name={"Sub: " + this.props.topic + " (" + this.state.messageCount + ")"} onRequestClose={this.props.onRequestClose}>
        <div className='Subscriber'>
          <div style={{ flex: '1 1 auto' }}>
            <YamlMessage message={this.state.message} />
          </div>
        </div>
      </Widget>
    );
  }
}

export default Subscriber;
