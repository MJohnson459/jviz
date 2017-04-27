import React, { Component } from 'react';
import NodeList from './NodeList';
import TopicList from './TopicList';
import Publisher from './Publisher';
import Subscriber from './Subscriber';
import NodeGraph from './NodeGraph';
import {Responsive, WidthProvider} from 'react-grid-layout';
import "../node_modules/react-grid-layout/css/styles.css"
import "../node_modules/react-resizable/css/styles.css"
import './App.css';

const ResponsiveReactGridLayout  = WidthProvider(Responsive);

class JViz extends Component {
    constructor(props) {
        super();
        console.log('Constructing JViz');

        this.state = {
            subscribers: [],
        }

        this.addSubscriber = this.addSubscriber.bind(this)
        this.createElement = this.createElement.bind(this)
    }

    addSubscriber(topic, type) {
        console.log("Creating subscriber", topic, type)
        this.setState(prevState => ({
            subscribers: [...prevState.subscribers, {topic: topic, type: type, layout:
                {
                    i: topic,
                    x: 2,
                    y: Infinity,
                    w: 2,
                    h: 6
                }
            }],
        }));
    }

    createElement(el) {
        console.log(el)
        return (
            <Subscriber key={el.topic} data-grid={el.layout} ros={this.props.ros} topic={el.topic} type={el.type} onRequestClose={() => {
                    console.log("removing", el.topic)

                    const subscribers = this.state.subscribers.filter((item)=>{
                        console.log("comparison", item.topic, el.topic, item.topic !== el.topic)
                        return item.topic !== el.topic;
                    });

                    this.setState({
                        subscribers: subscribers,
                    })
                }}/>
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

    const topicGraphLayout = {i: 'nodegraph',
        x: 2,
        y: Infinity,
        w: 4,
        h: 12
    }

    return (
      <div className="JViz">
        <div className="JViz-side">
            <NodeList ros={this.props.ros} hidden={true} />
            <TopicList ros={this.props.ros} createSubscriber={this.addSubscriber} hidden={false} />
        </div>

        <ResponsiveReactGridLayout
            className="JViz-main"
            breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
            cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
            rowHeight={30}
            draggableCancel=".WidgetMain"
            onLayoutChange={(layout, layouts) => {
                this.setState({
                    layouts: layouts,
                })
                console.log(layouts)
            }}>
            <Publisher key={'a'} ros={this.props.ros} data-grid={pubLayout}/>
            <NodeGraph key={'nodegraph'} ros={this.props.ros} data-grid={topicGraphLayout} />
            {this.state.subscribers.map(this.createElement)}
        </ResponsiveReactGridLayout>

      </div>
    );
  }
}

export default JViz;
