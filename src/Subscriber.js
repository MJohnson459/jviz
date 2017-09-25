// @flow
import * as React from 'react';
import ROSLIB from 'roslib';
import SyntaxHighlighter from 'react-syntax-highlighter';
import YAML from 'yamljs';
// import { Scrollbars } from 'react-custom-scrollbars';
import './styles/dark.css';
import {List, AutoSizer} from 'react-virtualized';

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
  messageCount: number,
  messages: Array<Message>,
}

class Subscriber extends React.Component<Props, State> {
  updateDuration = 500  // Time between drawing new messages in milliseconds
  messageBuffer = [] // Where to store new messages between draws
  messageCount = 0 // Max size of the message list
  listComponent = undefined


  nextUpdate = Date.now() + this.updateDuration // ms

  subscriber = new ROSLIB.Topic({
      ros : this.props.ros,
      name : this.props.topic,
      messageType : this.props.type,
  })

  MAX_HISTORY = 1000
  MAX_BUFFER = 500

  state: State = {
    messages: [],
    autoscroll: true,
    index: -1,
    messageCount: 0,
  }

    constructor(props: Props) {
      super(props);
    }

    calculateRowHeight({index}: {index: number}) {
        const rowHeight = 15;
        const message = this.state.messages[index];
        const yamlMessage = YAML.stringify(message, 2);
        const size = yamlMessage.split(/\r\n|\r|\n/).length;
        return  size * rowHeight ;
    }

    componentDidMount() {
        this.subscribe();
    }

    componentWillUnmount() {
        this.subscriber.unsubscribe();
    }

    subscribe() {
        this.subscriber.subscribe((message: string) => {
            this.messageBuffer.unshift(message);
            this.messageCount += 1;

            // Two ways that will force a flush
            // Buffer is full:
            const bufferFull = this.messageBuffer.length >= this.MAX_BUFFER;
            // Autoscrolling and updateDuration has passed:
            const timePassed = this.state.autoscroll && Date.now() >= this.nextUpdate;

            if (bufferFull || timePassed) {
                const totalSize = this.state.messages.length + this.messageBuffer.length;
                if (totalSize <= this.MAX_HISTORY) {
                    this.setState(prevState => ({
                        messages: [...this.messageBuffer, ...prevState.messages],
                        messageCount: this.messageCount,
                    }));
                } else {
                    this.setState(prevState => ({
                        messages: [...this.messageBuffer, ...prevState.messages.slice(totalSize - this.MAX_HISTORY)],
                        index: prevState.index > this.messageBuffer.length ? prevState.index - this.messageBuffer.length : 0,
                        messageCount: this.messageCount,
                    }));
                }

                // Clear buffer
                this.messageBuffer = [];
                if (this.listComponent) this.listComponent.recomputeRowHeights();
                this.nextUpdate = Date.now() + this.updateDuration;
            }
        });
    }

    // draw a single message row
    rowRenderer({
      key,         // Unique key within array of rows
      index,       // Index of row within collection
      isScrolling, // The List is currently being scrolled
      isVisible,   // This row is visible within the List (eg it is not an overscanned row)
      style        // Style object to be applied to row (to position it)
    } : {key: string, index: number, isScrolling: boolean, isVisible: boolean, style: any}) {
        const message = this.state.messages[index];

        return (
            <div
              key={key}
              style={style}
            >
                <YamlMessage message={message}/>
            </div>)
    }

    onRowsRendered({
        overscanStartIndex,
        overscanStopIndex,
        startIndex,
        stopIndex
    }: {overscanStartIndex: number, overscanStopIndex: number, startIndex: number, stopIndex: number}) {
        this.setState({
            index: this.state.autoscroll ? 0 : startIndex,
        })
    }

    render() {
        // console.log('Rendering Subscriber', this.state.messages.length);

        return (
        <div className='Subscriber'>
            <div style={{ flex: '1 1 auto' }}>
                <AutoSizer>
                  {({ height, width }: {height: number, width: number}) => (
                    <List
                        ref={(input) => {this.listComponent = input}}
                        height={height}
                        rowHeight={this.calculateRowHeight}
                        rowCount={this.state.messages.length}
                        rowRenderer={this.rowRenderer}
                        width={width}
                        onRowsRendered={this.onRowsRendered}
                        messageCount={this.state.messageCount}
                        scrollToIndex={this.state.index}
                        scrollToAlignment="start"
                    />
                  )}
                </AutoSizer>
            </div>
            <div style={{margin: 5, display: "flex", marginRight: 20}}>
                <div style={{flex: 2}}>Received: {this.state.messageCount}</div>
                <div style={{flex: "0 0 100px", textAlign: "right", cursor: "pointer", color: this.state.autoscroll ? "red" : "green"}} onClick={() => this.setState({autoscroll: !this.state.autoscroll})}>{this.state.index + 1} / {this.state.messages.length}</div>
            </div>
        </div>
        );
    }
}

export default Subscriber;
