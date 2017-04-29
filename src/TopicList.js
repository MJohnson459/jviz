import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import SidebarItem from './SidebarItem.js'
import Publisher from './Publisher.js'
import Subscriber from './Subscriber.js'

function Topic(props) {
    if (props.selected) {
        return (
            <div className={'Topic'} >
                <div classname='TopicOptions'>
                  <div className="TopicButton Active" onClick={props.createSubscriber}>Subscribe</div>
                  <div className="TopicButton Active" onClick={props.createPublisher}>Publish</div>
                </div>
                <div>
                    <div style={{margin: 5, padding: 0, height: 20}}>{props.topic}</div>
                    <div style={{margin: 5, padding: 0, height: 20}}>{props.type}</div>
                </div>
            </div>
        )
    } else {
        return (
            <div className={'Topic'} >
                <div classname='TopicOptions'>
                  <div className="TopicButton" onClick={props.createSubscriber}>Subscribe</div>
                  <div className="TopicButton" onClick={props.createPublisher}>Publish</div>
                </div>
                <div>
                    <div style={{margin: 5, padding: 0, height: 20}}>{props.topic}</div>
                    <div style={{margin: 5, padding: 0, height: 20}}>{props.type}</div>
                </div>
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
        return (<Topic key={el.topic} topic={el.topic} type={el.type} selected={el.selected}
            createSubscriber={() => {
                el.selected=true;
                const id = 'sub_' + el.topic
                this.props.createWidget(id, (
                  <Subscriber key={id} ros={this.props.ros} topic={el.topic} type={el.type}/>
                ))
            }}
            createPublisher={() => {
                el.selected=true;
                const id = 'pub_' + el.topic
                this.props.createWidget(id, (
                  <Publisher key={id} ros={this.props.ros}/>
            ))}}
            />);
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
