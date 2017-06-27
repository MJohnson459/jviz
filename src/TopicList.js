import React, { Component } from 'react';

import SidebarItem from './SidebarItem.js';
import Publisher from './Publisher.js';
import Subscriber from './Subscriber.js';
import ReactTooltip from 'react-tooltip';

import NodeTree from './NodeTree';
import {Treebeard} from 'react-treebeard';
import styles from './styles/treebeard-theme';

function Topic(props) {

    const subClassName = "SmallButton ColorOne " + (props.subActive ? "Active" : "")
    const pubClassName = "SmallButton ColorTwo " + (props.pubActive ? "Active" : "")

    return (
        <div className={'Topic Item'} >
            <div className='TopicOptions'>
              <ReactTooltip effect="solid" place="right" type="info"/>
              <div data-tip="Create a Subscriber Widget" className={subClassName} onClick={props.createSubscriber}>Sub</div>
              <div data-tip="Create a Sublisher Widget" className={pubClassName} onClick={props.createPublisher}>Pub</div>
            </div>
            <div className='TopicName' style={{flex: 1}}>
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
            tree: [],
        }

        this.getTopics();

        this.getTopics = this.getTopics.bind(this);
        this.onToggleTree = this.onToggleTree.bind(this);
        this.createElement = this.createElement.bind(this);

    }

    getTopics() {
        this.props.ros.getTopics((topics) => {
            const x = topics.topics.map((item, i) =>
                {
                    return {
                        name: item,
                        type: topics.types[i],
                        selected: false,
                    }
                }
            )

            this.setState({
                topics: x,
                tree: NodeTree.getNodeTree(x),
            });
        });
    }

    createElement(el) {
        return (<Topic key={el.name} topic={el.name} type={el.type} selected={el.selected}
            createSubscriber={() => {
                el.selected=true;
                const id = 'sub_' + el.name
                this.props.addWidget(id, (
                  <Subscriber key={id} ros={this.props.ros} topic={el.name} type={el.type}/>
                ))
            }}
            createPublisher={() => {
                el.selected=true;
                const id = 'pub_' + el.name
                this.props.addWidget(id, (
                  <Publisher key={id} ros={this.props.ros} topic={el.name} type={el.type}/>
            ))}}
            />);
    }

    onToggleTree(node, toggled) {
      if(this.state.cursor){this.state.cursor.active = false;}
      node.active = true;
      if(node.children){ node.toggled = toggled; }
      this.setState({ cursor: node });
    }

    render() {
        return (
        <SidebarItem name="Topic List">
            <Treebeard
                data={this.state.tree}
                onToggle={this.onToggleTree}
                style={styles}
             />
            <div className="Footer">
                <ReactTooltip effect="solid" place="right" type="info"/>
                <div data-tip="Refresh the list of topics" className="SmallButton ColorThree" onClick={this.getTopics}>
                    Refresh
                </div>
            </div>
        </SidebarItem>
        );
    }
}

export default TopicList;
