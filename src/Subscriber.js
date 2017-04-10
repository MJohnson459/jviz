import React, { Component } from 'react';
import ROSLIB from 'roslib';
import SyntaxHighlighter from 'react-syntax-highlighter';
import Widget from './Widget.js';
import YAML from 'yamljs';
import { Scrollbars } from 'react-custom-scrollbars';
import './styles/dark.css';
import {List, AutoSizer} from 'react-virtualized'

function Message(props) {
    return (
        <SyntaxHighlighter language="yaml" className={"Message"} useInlineStyles={false}>
            {YAML.stringify(props.message, 2)}
        </SyntaxHighlighter>
    )
}

class Subscriber extends Component {

    constructor(props) {
        super(props);
        console.log('Constructing Subscriber');

        this.state = {
            messages: [],
            message: {},
        }

        this.subscribe();
        this.rowRenderer = this.rowRenderer.bind(this);
    }

    // componentWillUnmount() {
    //     // this.subscriber.unsubscribe();
    // }

    subscribe() {
        console.log("this.props: ", this.props)
        this.subscriber = new ROSLIB.Topic({
            ros : this.props.ros,
            name : this.props.topic,
            messageType : this.props.type,
        });

        this.subscriber.subscribe((message) => {
            this.setState(prevState => ({
                messages: [...prevState.messages, message],
                message: message,
          }));
        });
    }

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

    render() {
        console.log('Rendering Subscriber');

        return (
        <Widget {...this.props} name={this.props.topic}>
            <div>{this.state.messages.length}</div>
            <div style={{ flex: '1 1 auto' }}>
            <AutoSizer>
              {({ height, width }) => (
                <List
                    height={height}
                    rowHeight={60}
                    rowCount={this.state.messages.length}
                    rowRenderer={this.rowRenderer}
                    width={width}
                />
              )}
            </AutoSizer>
            </div>
            {this.props.children}
        </Widget>
        );
    }
}

export default Subscriber;
