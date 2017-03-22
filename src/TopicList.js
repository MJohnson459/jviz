import React, { Component } from 'react';
import ROSLIB from 'roslib';
import { Scrollbars } from 'react-custom-scrollbars';
import Subscriber from './Subscriber';
import Widget from './Widget.js'

function Topic(props) {
  if (props.selected) {
    return (
      <div onClick={props.onClick} style={{ width: 298, height: 60, backgroundColor: "#AAAAAA", border: 1, borderStyle: "solid" }}>
          <p style={{margin: 5, padding: 0, height: 20}}>{props.topic}</p>
          <p style={{margin: 5, padding: 0, height: 20}}>{props.type}</p>
      </div>
    )
  } else {
    return (
      <div onClick={props.onClick} style={{ width: 298, height: 60, backgroundColor: "#EEEEEE", border: 1, borderStyle: "solid" }}>
          <p style={{margin: 5, padding: 0, height: 20}}>{props.topic}</p>
          <p style={{margin: 5, padding: 0, height: 20}}>{props.type}</p>
      </div>
    )
  }


}

class TopicList extends Component {

    constructor(props) {
        super(props);
        console.log('Constructing TopicList');

        this.ros = props.ros;

        this.state = {
            topics: {topics: [], types: []},
        }

        this.ros.getTopics((topics) => {
            console.log(topics);
            this.setState({
                topics: topics,
            });
        });

        this.handleChange = this.handleChange.bind(this);
        this.createSubscriber = props.createSubscriber;
    }

    handleChange(event) {

    }

    createSubscriber(item, type) {
        console.log("TopicList create sub");
    }

    render() {
        console.log('Rendering TopicList');

        return (
        <Widget>
            <div className="NodeList">
                <h2>TopicList</h2>
                <Scrollbars className="TopicList" style={{ width: 300, height: 300, backgroundColor: "#DDDDDD" }}>
                    {this.state.topics.topics.map((item, i) =>
                        <Topic key={item} topic={item} type={this.state.topics.types[i]} selected={Math.random() < 0.5} onClick={() => this.createSubscriber(item, this.state.topics.types[i]
                          // <Subscriber key={item} ros={this.ros} topic={item} type={this.state.topics.types[i]} />
                        )} />
                    )}
                </Scrollbars>
            </div>
        </Widget>
        );
    }
}

export default TopicList;
