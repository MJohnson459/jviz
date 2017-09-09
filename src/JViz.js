import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Responsive, WidthProvider} from 'react-grid-layout';
import ROSLIB from 'roslib';

import ButtonPanel from './ButtonPanel';
import NodeGraph from './NodeGraph';
import NodeList from './NodeList';
import RosGraph from './RosGraph';
import RosGraphView from './RosGraphView';
import Widget from './Widget';

import "../node_modules/react-grid-layout/css/styles.css";
import "../node_modules/react-resizable/css/styles.css";
import './styles/App.css';

const ResponsiveReactGridLayout  = WidthProvider(Responsive);

class JViz extends Component {
    constructor(props) {
        super(props);

        this.state = {
            subscribers: [],
            widgets: [],
            rosGraph: new RosGraph.RosGraph(),
            autoExpand: true,
            view: new RosGraphView(),
        }

        this.addWidget = this.addWidget.bind(this)
        this.renderWidget = this.renderWidget.bind(this)
        this.removeWidget = this.removeWidget.bind(this)
        this.setNodeActive = this.setNodeActive.bind(this)
        this.updateRosGraph = this.updateRosGraph.bind(this)

        this.updateRosGraph()
    }

    updateRosGraph() {
      RosGraph.getRosGraph(this.props.ros)
        .then(result => this.setState({
          rosGraph: result,
        }))
    }

    /**
     * @param treeNode.name {string} Node's label
     * @param treeNode.path {string} Node's unique identifier
     * @param treeNode.type {string} "node" or "topic" (TODO: move to enum)
     * @param toggled {boolean} True if the node should be expanded
     */
    setNodeActive(treeNode, toggled = true) {
      this.setState({
        view: this.state.view.setNodeActive(treeNode, toggled, this.state.rosGraph)
      })
    }

    /**
     * @param id {string} Unique identifier of the new widget
     * @param element {React.Component} The react component to add to the window
     * @param name {string} The label to give the widget
     */
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

    /**
     * @param widget {Widget} The widget to render
     * @param widget.id {string} Unique identifier
     * @param widget.layout {Layout} Grid layout
     * @param widget.name {string} Label of the widget
     * @param widget.element {React.Component} React component of the widget
     */
    renderWidget(widget) {
        return (
            <Widget key={widget.id} data-grid={widget.layout} name={widget.name || widget.id} onRequestClose={() => this.removeWidget(widget)}>
                {React.cloneElement(widget.element, {rosGraph: this.state.rosGraph, view: this.state.view})}
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
            <NodeList nodes={this.state.rosGraph.nodes} view={this.state.view} setNodeActive={this.setNodeActive} type="node"/>
            <NodeList nodes={this.state.rosGraph.topics} view={this.state.view} setNodeActive={this.setNodeActive} type="topic"/>
            <ButtonPanel ros={this.props.ros} addWidget={this.addWidget} node={this.state.view.active} type={this.state.view.type}/>
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
              {this.state.widgets.map(this.renderWidget)}
          </ResponsiveReactGridLayout>
          <div className="ButtonPanel">
            <div data-tip="Refresh the entire ros graph" className="SmallButton ColorOne" onClick={this.updateRosGraph}>
                Refresh
            </div>
            <div className="SmallButton ColorTwo" onClick={() => {
                this.setState({
                    view: this.state.view.toggleDebug(),
                  })
              }}>
              {this.state.view.hideDebug ? "Show Debug" : "Hide Debug"}
            </div>
            <div data-tip="Create a Node Graph Widget" className="SmallButton ColorThree" onClick={() => {
                this.addWidget("Node Graph", (
                    <NodeGraph key={"node_graph"} rosGraph={this.state.rosGraph} view={this.state.view} setNodeActive={this.setNodeActive}/>
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
