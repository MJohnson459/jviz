import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Responsive, WidthProvider} from 'react-grid-layout';
import ROSLIB from 'roslib';

import NodeList from './NodeList';
import TopicList from './TopicList';
import Widget from './Widget';
import RosGraph from './RosGraph';
import NodeGraph from './NodeGraph';

import "../node_modules/react-grid-layout/css/styles.css";
import "../node_modules/react-resizable/css/styles.css";
import './App.css';

const ResponsiveReactGridLayout  = WidthProvider(Responsive);

class JViz extends Component {
    constructor(props) {
        super(props);

        this.debugNames = [
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

        this.state = {
            subscribers: [],
            widgets: [],
            rosGraph: new RosGraph.RosGraph(),
            filteredGraph: [],
            autoExpand: true,
            hideDebug: true,
            metadata: {
              toggled: [],
              hidden: this.debugNames,
              relations: {
                in: [],
                out: [],
              }
            }
        }

        this.addWidget = this.addWidget.bind(this)
        this.createWidget = this.createWidget.bind(this)
        this.removeWidget = this.removeWidget.bind(this)
        this.setNodeActive = this.setNodeActive.bind(this)
        this.rosGraphUpdated = this.rosGraphUpdated.bind(this)

        RosGraph.getRosGraph(props.ros)
          .then(result => this.setState({
            rosGraph: result,
          }))
    }

    updateToggled(toggledList, id, toggled) {
      if (!toggledList) toggledList = []

      // Not in toggled list but meant to be
      if (toggled) {
        id.split("/").reduce((path, value) => {
          const subId = [path, value].join('/')
          const toggledIndex = toggledList.indexOf(subId)
          if (toggledIndex === -1) toggledList.push(subId)
          return subId
        })
      } else {
        // If we aren't meant to be toggled, remove element using splice
        // TODO: toggle all subtrees
        const toggledIndex = toggledList.indexOf(id)
        if (toggledIndex > -1) toggledList.splice(toggledIndex, 1)
      }

      return toggledList
    }

    setNodeActive(treeNode, toggled) {

      // cleanup
      let metadata = this.state.metadata
      metadata.relations = {
        in: [],
        out: []
      }

      // set node active
      metadata.active = treeNode
      metadata.type = treeNode.type
      metadata.relations = this.state.rosGraph.getRelations(treeNode.id, treeNode.type)

      // Toggled
      let newToggled = {}
      newToggled[treeNode.type] = this.updateToggled(this.state.metadata.toggled[treeNode.type], treeNode.id, toggled)
      newToggled[metadata.relations.type] = [...metadata.relations.in, ...metadata.relations.out].reduce((toggledList, relation) => this.updateToggled(toggledList, relation, true), [])

      metadata.toggled = newToggled

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
            <NodeList ros={this.props.ros} addWidget={this.addWidget} nodes={this.state.rosGraph.nodes} metadata={this.state.metadata} setNodeActive={this.setNodeActive} />
            <TopicList ros={this.props.ros} addWidget={this.addWidget} topics={this.state.rosGraph.topics} metadata={this.state.metadata} setNodeActive={this.setNodeActive} />
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
            <div data-tip="Create a Node Graph Widget" className="SmallButton ColorTwo" onClick={() => {
                this.addWidget("node_graph", (
                    <NodeGraph key={"node_graph"} ros={this.props.ros} rosGraph={this.state.rosGraph} metadata={this.state.metadata} />
                ))
              }}>
              Node Graph
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
