// @flow
import * as React from 'react';
import ROSLIB from 'roslib';

import ButtonPanel from './ButtonPanel';
import NodeGraph from './NodeGraph';
import NodeList from './NodeList';
import * as RosGraph from './lib/RosGraph';
import RosGraphView from './lib/RosGraphView';

import "../node_modules/react-grid-layout/css/styles.css";
import "../node_modules/react-resizable/css/styles.css";
import './styles/App.css';

type TreeNode = {
  name: string,
  path: string,
  type: RosGraph.PrimitiveType,
}

type Props = {
  ros: ROSLIB.Ros,
}

type WidgetType = {
  element: React.Element<any>,
  id: string,
  layout: Object,
  name: ?string,
}

type State = {
  autoExpand: boolean,
  layouts: ?Object,
  rosGraph: RosGraph.RosGraph,
  view: RosGraphView,
  widgets: Array<WidgetType>,
}

class JViz extends React.Component<Props, State> {
    state = {
      autoExpand: true,
      layouts: {},
      rosGraph: new RosGraph.RosGraph(),
      view: new RosGraphView(),
      widgets: [],
    }

    constructor(props: Props) {
        super(props);
        this.updateRosGraph()
    }

    updateRosGraph = () => {
      RosGraph.GetRosGraph(this.props.ros)
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
    setNodeActive = (treeNode: TreeNode, toggled: boolean = true) => {
      this.setState({
        view: this.state.view.setNodeActive(treeNode, toggled, this.state.rosGraph)
      })
    }

    /**
     * @param id {string} Unique identifier of the new widget
     * @param element {React.Node} The react component to add to the window
     * @param name {string} The label to give the widget
     */
    addWidget = (id: string, element: React.Element<any>, name: ?string) => {
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

  renderWidget = (widget: WidgetType) => {
    return (widget.element);
  }

  removeWidget = (id: string) => {
    console.log("Removing", id)

    const widgets = this.state.widgets.filter((item)=>{
      return item.id !== id;
    });

    this.setState({
      widgets: widgets,
    })
  }

  handleSearch = (event: {target: {value: string}}) => {
    this.setState({
      view: this.state.view.searchFor(event.target.value),
    });
  }

  hideItem = (path: string, type: string) => {
    this.setState({view: this.state.view.hideItem(path, type)})
  }


  render() {
    return (
      <div className="JViz">
        <div className="Sidebar">
          <div style={{padding: 5, display: "flex"}}><input type="text" style={{flex: 1}} onChange={this.handleSearch} placeholder="search..." value={this.state.view.search}/></div>
          <NodeList name="Node List" nodes={this.state.rosGraph.nodes} view={this.state.view} setNodeActive={this.setNodeActive} type="node"/>
          <NodeList name="Topic List" nodes={this.state.rosGraph.topics} view={this.state.view} setNodeActive={this.setNodeActive} type="topic"/>
          {this.state.view.active ? <ButtonPanel ros={this.props.ros} addWidget={this.addWidget} removeWidget={this.removeWidget} hideItem={this.hideItem} node={this.state.view.active} /> : false}
        </div>
        <div className="JViz-main">
          <NodeGraph key={"node_graph"} rosGraph={this.state.rosGraph} view={this.state.view} setNodeActive={this.setNodeActive}/>
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
            <div className="SmallButton ColorOne" onClick={() => {
                const view = this.state.view
                view.hidden = []
                this.setState({
                    view: view,
                  })
              }}>
              Unhide
            </div>
          </div>
        </div>
        {this.state.widgets.length ? <div className="Sidebar">{this.state.widgets.map(widget => widget.element)}</div> : false}
      </div>
    );
  }
}

export default JViz;
