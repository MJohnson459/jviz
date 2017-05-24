import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import SidebarItem from './SidebarItem.js'
import Publisher from './Publisher.js'
import Subscriber from './Subscriber.js'

function Topic(props) {

    const subClassName = "SmallButton ColorOne " + (props.subActive ? "Active" : "")
    const pubClassName = "SmallButton ColorTwo " + (props.pubActive ? "Active" : "")

    return (
        <div className={'Topic'} >
            <div className='TopicOptions'>
              <div className={subClassName} onClick={props.createSubscriber}>sub</div>
              <div className={pubClassName} onClick={props.createPublisher}>pub</div>
            </div>
            <div style={{flex: 1}}>
                <div style={{margin: 5, padding: 0, height: 20}}>{props.topic}</div>
                <div style={{margin: 5, padding: 0, height: 20}}>{props.type}</div>
            </div>
        </div>
    )
}

class TopicList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            topics: [],
        }

        this.getTopics();

        this.getTopics = this.getTopics.bind(this);
        this.createElement = this.createElement.bind(this);

    }

    getTopics() {
        this.props.ros.getTopics((topics) => {
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
                this.props.addWidget(id, (
                  <Subscriber key={id} ros={this.props.ros} topic={el.topic} type={el.type}/>
                ))
            }}
            createPublisher={() => {
                el.selected=true;
                const id = 'pub_' + el.topic
                this.props.addWidget(id, (
                  <Publisher key={id} ros={this.props.ros} topic={el.topic} type={el.type}/>
            ))}}
            />);
    }

    render() {
        return (
        <SidebarItem name="Topic List">
            <Scrollbars className="TopicList" autoHeight autoHeightMax={350}>
                {this.state.topics.map(this.createElement)}
            </Scrollbars>
            <div className="Footer">
                <div className="SmallButton ColorThree" onClick={this.getTopics}>
                    refresh
                </div>
            </div>
        </SidebarItem>
        );
    }
}

export default TopicList;
