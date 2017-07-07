import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Responsive, WidthProvider} from 'react-grid-layout';
import ROSLIB from 'roslib';


import NodeList from './NodeList';
import TopicList from './TopicList';
import Widget from './Widget';
import RosGraph from './RosGraph';


import "../node_modules/react-grid-layout/css/styles.css";
import "../node_modules/react-resizable/css/styles.css";
import './App.css';

const ResponsiveReactGridLayout  = WidthProvider(Responsive);

class JViz extends Component {
    constructor(props) {
        super(props);

        this.state = {
            subscribers: [],
            widgets: [],
            rosGraph: []
        }

        this.addWidget = this.addWidget.bind(this)
        this.createWidget = this.createWidget.bind(this)
        this.removeWidget = this.removeWidget.bind(this)

        RosGraph.getRosGraph(props.ros)
        .then(result => this.setState({
          rosGraph: result,
        }))
    }

    addWidget(id, element, name) {
        console.log("Adding widget: ", id, element, name)

        // TODO: calculate layout
        const layout =
        {
            i: id,
            x: 4,
            y: Infinity,
            w: 2,
            h: 6
        }

        this.setState(prevState => ({
            widgets: [...prevState.widgets, {
              id: id,
              element: element,
              name: name,
              layout: layout}],
        }));
    }

    createWidget(widget) {
        return (
            <Widget key={widget.id} data-grid={widget.layout} name={widget.name || widget.id} onRequestClose={() => this.removeWidget(widget)}>
                {widget.element}
            </Widget>
        );
    }

    removeWidget(widget) {
        console.log("Removing", widget.id)

        const widgets = this.state.widgets.filter((item)=>{
            return item.id !== widget.id;
        });

        this.setState({
            widgets: widgets,
        })

    }


  render() {

    return (
      <div className="JViz">
        <div className="JViz-side">
            <NodeList ros={this.props.ros} addWidget={this.addWidget} hidden={false} rosGraph={this.state.rosGraph} />
            <TopicList ros={this.props.ros} addWidget={this.addWidget} hidden={false} rosGraph={this.state.rosGraph} />
        </div>

        <ResponsiveReactGridLayout
            className="JViz-main"
            breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
            cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
            rowHeight={30}
            draggableHandle=".HeaderName"
            onLayoutChange={(layout, layouts) => {
                this.setState({
                    layouts: layouts,
                })
            }}>
            {this.state.widgets.map(this.createWidget)}
        </ResponsiveReactGridLayout>

      </div>
    );
  }
}

JViz.propTypes = {
  ros: PropTypes.instanceOf(ROSLIB.Ros).isRequired,
}

export default JViz;
