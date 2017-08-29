import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Responsive, WidthProvider} from 'react-grid-layout';
import ROSLIB from 'roslib';
import _ from 'lodash';

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
            rosGraph: [],
            filteredGraph: [],
            autoExpand: true,
            hideDebug: true,
            metadata: {
              toggled: []
            }
        }

        this.addWidget = this.addWidget.bind(this)
        this.createWidget = this.createWidget.bind(this)
        this.removeWidget = this.removeWidget.bind(this)
        this.setNodeActive = this.setNodeActive.bind(this)
        this.filterNodeGraph = this.filterNodeGraph.bind(this)
        this.rosGraphUpdated = this.rosGraphUpdated.bind(this)

        RosGraph.getRosGraph(props.ros)
          .then(result => this.setState({
            rosGraph: result,
            filteredGraph: this.filterNodeGraph(result),
          }))
    }

    filterNodeGraph(nodes) {
      const debugNames = [
          '/clock',
          '/cpu_monitor',
          '/diag_agg',
          '/hd_monitor',
          '/monitor',
          '/pr2_dashboard',
          '/rosapi',
          '/rosout_agg',
          '/rosout',
          '/rqt',
          '/runtime_logger',
          '/rviz',
          '/rxloggerlevel',
          '/statistics',
      ];

      if (this.state.hideDebug) {
        return nodes.filter((node) => {
            return !debugNames.includes(node.fullname);
        })
      } else {
        return nodes
      }

    }

    setNodeActive(node, toggled) {
      let newGraph = this.state.rosGraph.map((item) => {
        item.relation = "None"
        item.active = false
        if (this.state.autoExpand) item.toggled = false
        return item
      });

      let metadata = {
        toggled: []
      }

      if (node.fullname) {
        // Set selected node to active
        let index = _.findIndex(newGraph, {fullname: node.fullname});
        newGraph[index].active = true;
        metadata.toggled.push(node.fullname)

        // Loop through input connections and set the relation string
        if (node.in) {
          node.in.forEach((fullname) => {
            let index = _.findIndex(newGraph, {fullname: fullname});
            if (index !== -1) {
              newGraph[index].relation = "Input";
              if (this.state.autoExpand) metadata.toggled.push(node.fullname);
            }
          })
        }

        // Loop through output connections and set the relation string
        if (node.out) {
          node.out.forEach((fullname) => {
            let index = _.findIndex(newGraph, {fullname: fullname});
            if (index !== -1) {
              newGraph[index].relation = "Output";
              if (this.state.autoExpand) metadata.toggled.push(node.fullname);
            }
          })
        }
      } else if (node.name){
        metadata.toggled.push(node.name)
      }
      this.rosGraphUpdated(newGraph)
      this.setState({
        metadata: metadata
      })
    }

    rosGraphUpdated(nextGraph) {
      const filteredGraph = this.filterNodeGraph(nextGraph)
      this.setState({
        rosGraph: nextGraph,
        filteredGraph: filteredGraph,
      })

      let activeGraph = []

      if (this.state.hideDebug) {
        activeGraph = filteredGraph
      } else {
        activeGraph = nextGraph
      }

      // TODO: horrible and hacky. Find out how to call a method on react components
      this.state.widgets.forEach((widget) => {
        if (widget.element.props.nodeList !== undefined) {
          widget.element = React.cloneElement(
            widget.element,
            {nodeList: activeGraph},
          )
        }
      })
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
            <NodeList ros={this.props.ros} addWidget={this.addWidget} hidden={false} rosGraph={this.state.filteredGraph} metadata={this.state.metadata} setNodeActive={this.setNodeActive} />
            <TopicList ros={this.props.ros} addWidget={this.addWidget} hidden={false} rosGraph={this.state.filteredGraph} metadata={this.state.metadata} setNodeActive={this.setNodeActive} />
        </div>
        <div className="JViz-main">
          <ResponsiveReactGridLayout
              breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
              className="JViz-main"
              cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
              draggableHandle=".HeaderName"
              margin={[5, 5]}
              onLayoutChange={(layout, layouts) => {
                this.setState({
                  layouts: layouts,
                })
              }}
              rowHeight={30}
              >
              {this.state.widgets.map(this.createWidget)}
          </ResponsiveReactGridLayout>
          <div className="ButtonPanel">
            <div className="SmallButton ColorThree" onClick={() => this.setState({
                  hideDebug: !this.state.hideDebug,
                  filteredGraph: this.filterNodeGraph(this.state.rosGraph),
                })}>
              Toggle Debug
            </div>
          </div>
        </div>
      </div>
    );
  }
}

JViz.propTypes = {
  ros: PropTypes.instanceOf(ROSLIB.Ros).isRequired,
}

export default JViz;
