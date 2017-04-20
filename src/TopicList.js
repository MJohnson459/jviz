import React, { Component } from 'react';
import ROSLIB from 'roslib';
import { Scrollbars } from 'react-custom-scrollbars';
import Subscriber from './Subscriber';
import SidebarItem from './SidebarItem.js'

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

        this.state = {
            topics: [],
        }

        this.getTopics();

        this.getTopics = this.getTopics.bind(this);
        this.createElement = this.createElement.bind(this);

    }

    getTopics() {
        this.props.ros.getTopics((topics) => {
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
    }

    createElement(el) {
        return (<Topic key={el.topic} topic={el.topic} type={el.type} selected={el.selected} onClick={() =>  {
                el.selected=true;
                this.props.createSubscriber(el.topic, el.type);
            }} />);
    }

    render() {
        console.log('Rendering TopicList');

        return (
        <SidebarItem name="Topic List">
            <Scrollbars className="TopicList" autoHeight autoHeightMax={350}>
                {this.state.topics.map(this.createElement)}
            </Scrollbars>
            <div className="TopicListFooter">
                <div className="smallButton" onClick={this.getTopics}>
                    refresh
                </div>
            </div>
        </SidebarItem>
        );
    }
}

export default TopicList;
