import React, { Component } from 'react';
import ROSLIB from 'roslib';
import NodeList from './NodeList';
import TopicList from './TopicList';
import Publisher from './Publisher';
import Subscriber from './Subscriber';
import {Responsive, WidthProvider} from 'react-grid-layout';
import "../node_modules/react-grid-layout/css/styles.css"
import "../node_modules/react-resizable/css/styles.css"
import './App.css';
import Widget from './Widget.js'

const ResponsiveReactGridLayout  = WidthProvider(Responsive);

class JViz extends Component {
    constructor(props) {
        super();
        console.log('Constructing JViz');

        this.state = {
            message: "empty",
            connected: false,
            subscribers: [],
        }

        this.ros = props.ros;
        this.addSubscriber = this.addSubscriber.bind(this)
        this.createElement = this.createElement.bind(this)
    }

    addSubscriber(topic, type) {
        console.log("Creating subscriber", topic, type)
        this.setState(prevState => ({
            subscribers: [...prevState.subscribers, {topic: topic, type: type, layout:
                {
                    i: topic,
                    x: 3,
                    y: Infinity,
                    w: 2,
                    h: 6
                }
            }],
        }));
    }

    createElement(el) {
        var removeStyle = {
          position: 'absolute',
          right: '2px',
          top: 0,
          cursor: 'pointer'
        };
        return (

            <Subscriber key={el.topic} data-grid={el.layout} ros={this.ros} topic={el.topic} type={el.topic}/>

        );
    }

  render() {
    console.log('Rendering JViz', this.state);

    const pubLayout = {i: 'a',
        x: 0,
        y: Infinity,
        w: 2,
        h: 6
    }

    return (
      <div className="JViz">
        <div className="JViz-side">
            <NodeList ros={this.ros} hidden={true} />
            <TopicList ros={this.ros} createSubscriber={this.addSubscriber} hidden={true} />
        </div>

        <ResponsiveReactGridLayout
            className="JViz-main"
            breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
            cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
            rowHeight={30}
            onLayoutChange={(layout, layouts) => {
                this.setState({
                    layouts: layouts,
                })
                console.log(layouts)
            }}>
            <Publisher key={'a'} ros={this.ros} data-grid={pubLayout}/>
            {this.state.subscribers.map(this.createElement)}
        </ResponsiveReactGridLayout>

      </div>
    );
  }
}

export default JViz;
