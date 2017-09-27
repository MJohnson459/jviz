// @flow
import * as React from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
import ROSLIB from 'roslib';

import ButtonPanel from './ButtonPanel';
import NodeGraph from './NodeGraph';
import NodeList from './NodeList';
import * as RosGraph from './lib/RosGraph';
import RosGraphView from './lib/RosGraphView';
import Widget from './Widget';

import "../node_modules/react-grid-layout/css/styles.css";
import "../node_modules/react-resizable/css/styles.css";
import './styles/App.css';

const ResponsiveReactGridLayout  = WidthProvider(Responsive);

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
  filter: string,
  filteredGraph: ?RosGraph.RosGraph,
  layouts: ?Object,
  rosGraph: RosGraph.RosGraph,
  view: RosGraphView,
  widgets: Array<WidgetType>,
}

class JViz extends React.Component<Props, State> {
    state = {
      autoExpand: true,
      filter: "",
      filteredGraph: undefined,
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

    /**
     * @param widget {Widget} The widget to render
     * @param widget.id {string} Unique identifier
     * @param widget.layout {Layout} Grid layout
     * @param widget.name {string} Label of the widget
     * @param widget.element {React.Node} React component of the widget
     */
    renderWidget = (widget: WidgetType) => {
        return (
            <Widget key={widget.id} data-grid={widget.layout} name={widget.name || widget.id} onRequestClose={() => this.removeWidget(widget)}>
                {React.cloneElement(widget.element, {rosGraph: this.state.rosGraph, view: this.state.view})}
            </Widget>
        );
    }

    removeWidget = (widget: WidgetType) => {
        console.log("Removing", widget.id)

        const widgets = this.state.widgets.filter((item)=>{
            return item.id !== widget.id;
        });

        this.setState({
            widgets: widgets,
        })

    }

  handleFilter = (event: {target: {value: string}}) => {
    const filter = event.target.value;
    this.setState({
      filter: filter,
      filteredGraph: RosGraph.filterGraph(this.state.rosGraph, filter),
    });
  }


  render() {
    return (
      <div className="JViz">
        <div className="JViz-side">
          <div style={{padding: 5, display: "flex"}}><input type="text" style={{flex: 1}} onChange={this.handleFilter} placeholder="filter..." value={this.state.filter}/></div>
          <NodeList name="Node List" nodes={this.state.rosGraph.nodes} view={this.state.view} setNodeActive={this.setNodeActive} filter={this.state.filter} type="node"/>
          <NodeList name="Topic List" nodes={this.state.rosGraph.topics} view={this.state.view} setNodeActive={this.setNodeActive} filter={this.state.filter} type="topic"/>
          <ButtonPanel ros={this.props.ros} addWidget={this.addWidget} node={this.state.view.active} />
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

export default JViz;
