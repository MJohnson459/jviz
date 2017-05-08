import React, { Component } from 'react';
import ROSLIB from 'roslib';
import SyntaxHighlighter from 'react-syntax-highlighter';
import YAML from 'yamljs';
// import { Scrollbars } from 'react-custom-scrollbars';
import './styles/dark.css';
import {List, AutoSizer} from 'react-virtualized';

function Message(props) {
    return (
        <div className="Message">
            <SyntaxHighlighter language="yaml" className="Message" useInlineStyles={false}>
                {YAML.stringify(props.message, 2)}
            </SyntaxHighlighter>
        </div>
    )
}

class Subscriber extends Component {

    constructor(props) {
        super(props);

        this.updateDuration = 500; //ms
        this.messageBuffer = [];

        this.state = {
            messages: [],
            message: {},
            scrolled: false,
        }

        this.nextUpdate = Date.now() + this.updateDuration; // ms

        this.rowRenderer = this.rowRenderer.bind(this);
        this.onRowsRendered = this.onRowsRendered.bind(this);
        this.calculateRowHeight = this.calculateRowHeight.bind(this);
    }

    calculateRowHeight({
        index
    }) {
        const rowHeight = 15;
        const message = this.state.messages[index];
        const yamlMessage = YAML.stringify(message, 2);
        const size = yamlMessage.split(/\r\n|\r|\n/).length
        return  size * rowHeight;
    }

    componentDidMount() {
        this.subscribe();
    }

    componentWillUnmount() {
        this.subscriber.unsubscribe();
    }

    subscribe() {
        this.subscriber = new ROSLIB.Topic({
            ros : this.props.ros,
            name : this.props.topic,
            messageType : this.props.type,
        });

        this.subscriber.subscribe((message) => {
            this.messageBuffer = [...this.messageBuffer, message];
            // console.log("messagebuffer", this.messageBuffer);

            // Check if time to update
            if (Date.now() >= this.nextUpdate) {

                this.setState(prevState => ({
                    messages: [...prevState.messages, ...this.messageBuffer],
                    message: message,
                }));

                // Clear buffer
                this.messageBuffer = [];
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
    }) {
        const message = this.state.messages[index];

        return (
            <div
              key={key}
              style={style}
            >
                <Message message={message}/>
            </div>)
    }

    onRowsRendered({
        overscanStartIndex,
        overscanStopIndex,
        startIndex,
        stopIndex
    }) {
       this.setState({
            scrolled: stopIndex !== this.state.messages.length - 1,
        })
    }

    render() {
        // console.log('Rendering Subscriber', this.state.messages.length);

        // Auto-scroll at the bottom only if the user hasn't scrolled up
        var scroll = {}
        if (!this.state.scrolled) {
            scroll = {
                scrollToIndex: this.state.messages.length-1,
                scrollToAlignment: "end",
            }
        }

        return (
        <div className='Subscriber'>
            <div style={{ flex: '1 1 auto' }}>
                <AutoSizer>
                  {({ height, width }) => (
                    <List
                        height={height}
                        rowHeight={this.calculateRowHeight}
                        rowCount={this.state.messages.length}
                        rowRenderer={this.rowRenderer}
                        width={width}
                        onRowsRendered={this.onRowsRendered}
                        {...scroll}

                    />
                  )}
                </AutoSizer>
            </div>
            <div style={{margin: 5}}>Received: {this.state.messages.length}</div>
            {this.props.children}
        </div>
        );
    }
}

export default Subscriber;
