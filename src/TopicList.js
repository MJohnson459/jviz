import React, { Component } from 'react';
import ROSLIB from 'roslib';
import { Scrollbars } from 'react-custom-scrollbars';
import Subscriber from './Subscriber';
import Widget from './Widget.js'

function Topic(props) {
    if (props.selected) {
        return (
            <div onClick={props.onClick} className={'Topic Active'} >
                <p style={{margin: 5, padding: 0, height: 20}}>{props.topic}</p>
                <p style={{margin: 5, padding: 0, height: 20}}>{props.type}</p>
            </div>
        )
    } else {
        return (
            <div onClick={props.onClick} className={'Topic'} >
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
            topics: [],
        }

        this.ros.getTopics((topics) => {
            console.log(topics);

            var x = topics.topics.map((item, i) =>
                {
                    return {
                        topic: item,
                        type: topics.types[i],
                        selected: false,
                    }
                }
            )

            this.setState({
                topics: x,
            });
        });

        this.handleChange = this.handleChange.bind(this);
        this.createSubscriber = props.createSubscriber;
    }

    handleChange(event) {

    }

    render() {
        console.log('Rendering TopicList');

        return (
        <Widget name="Topic List">
            <Scrollbars className="TopicList" style={{ height: "inherit" }}>
                {this.state.topics.map((item, i) =>
                    <Topic key={item.topic} topic={item.topic} type={item.type} selected={item.selected} onClick={() =>  {
                            item.selected=true;
                            this.createSubscriber(item.topic, item.type);
                        }} />
                )}
            </Scrollbars>
        </Widget>
        );
    }
}

export default TopicList;
