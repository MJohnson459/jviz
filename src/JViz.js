import React, { Component } from 'react';
import ROSLIB from 'roslib';
import NodeList from './NodeList';
import TopicList from './TopicList';
import Publisher from './Publisher';
import Subscriber from './Subscriber';
import {Responsive, WidthProvider} from 'react-grid-layout';
var ReactGridLayout = require('react-grid-layout');
import "../node_modules/react-grid-layout/css/styles.css"
import "../node_modules/react-resizable/css/styles.css"
import './App.css';
import Widget from './Widget.js'

class JViz extends Component {
    constructor(props) {
        super();
        console.log('Constructing JViz');

        this.state = {
            message: "empty",
            connected: false,
            subscribers: [],
            layout: [
                {i: 'a', x: 0, y: 0, w: 3, h: 6},
            ],
        }

        this.ros = props.ros;
        this.createSubscriber = this.createSubscriber.bind(this)
    }

    createSubscriber(topic, type) {
        console.log("Creating subscriber", topic, type)
        const subscribers = this.state.subscribers;
        subscribers.push([topic, type]);
        this.setState(prevState => ({
            subscribers: subscribers,
            layout: [...prevState.layout, {i: topic, x: 3, y: 0, w: 3, h: 6}],
        }));
        console.log("Subscribers", subscribers);
    }

  render() {
    console.log('Rendering JViz', this.state);
    return (
      <div className="JViz">
        <div className="JViz-side">
            <NodeList ros={this.ros} hidden={true} />
            <TopicList ros={this.ros} createSubscriber={this.createSubscriber} hidden={true} />
        </div>
        <ReactGridLayout className="JViz-main" layout={this.state.layout} cols={12} rowHeight={30} width={1200}  onLayoutChange={(layout) => {
                this.setState({
                    layout: layout,
                })
            }}>
            <Publisher key={'a'} ros={this.ros}/>
            {this.state.subscribers.map((item) =>
                <Subscriber key={item[0]} ros={this.ros} topic={item[0]} type={item[1]}/>
            )}
        </ReactGridLayout>

      </div>
    );
  }
}

export default JViz;
