// @flow
import * as React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import jsyaml from 'js-yaml';
// import { Scrollbars } from 'react-custom-scrollbars';
import './styles/dark.css';
import {List, AutoSizer} from 'react-virtualized';

type Message = {}

function YamlMessage(props: {message: Message}) {
  return (
    <div className="Message">
      <SyntaxHighlighter language="yaml" className="Message" useInlineStyles={false}>
        {jsyaml.dump(props.message)}
      </SyntaxHighlighter>
    </div>
  )
}

type Props = {
  messages: Array<Message>,
  messageCount: number,
}

type State = {
  autoscroll: boolean,
  index: number,
}

class SubscriberFeed extends React.Component<Props, State> {
  listComponent: ?React.Element<any> = undefined

  state = {
    autoscroll: true,
    index: -1,
  }

  calculateRowHeight = ({index}: {index: number}) => {
    const rowHeight = 15;
    const message = this.props.messages[index];
    const yamlMessage: string = jsyaml.dump(message);
    const size: number = yamlMessage.split(/\r\n|\r|\n/).length;
    return  size * rowHeight ;
  }

  // draw a single message row
  rowRenderer = ({key, index, isScrolling, isVisible, style}: {key: string, index: number, isScrolling: boolean, isVisible: boolean, style: {}}) => {
    const message = this.props.messages[index];
    return (
      <div key={key} style={style}>
        <YamlMessage message={message}/>
      </div>
    )
  }

  onRowsRendered = ({overscanStartIndex, overscanStopIndex, startIndex, stopIndex}: {overscanStartIndex: number, overscanStopIndex: number, startIndex: number, stopIndex: number}) => {
    this.setState({
      index: this.state.autoscroll ? 0 : startIndex,
    })
  }

  render() {
    return (
    <div className='SubscriberFeed'>
      <div style={{ flex: '1 1 auto' }}>
        <AutoSizer>
          {({ height, width }: {height: number, width: number}) => (
            <List
              ref={(input) => {this.listComponent = input}}
              height={height}
              rowHeight={this.calculateRowHeight}
              rowCount={this.props.messages.length}
              rowRenderer={this.rowRenderer}
              width={width}
              onRowsRendered={this.onRowsRendered}
              messageCount={this.props.messageCount}
              scrollToIndex={this.state.index}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>
      </div>
      <div style={{margin: 5, display: "flex", marginRight: 20}}>
        <div style={{flex: 1}}>Received: {this.props.messageCount}</div>
        <div style={{flex: 1, textAlign: "right", cursor: "pointer", color: this.state.autoscroll ? "red" : "green"}} onClick={() => this.setState({autoscroll: !this.state.autoscroll})}>{this.state.index + 1} / {this.props.messages.length}</div>
      </div>
    </div>
    );
  }
}

export default SubscriberFeed;
