// @flow
import * as React from 'react';
import ReactTooltip from 'react-tooltip';
import ROSLIB from 'roslib';

import * as RosGraph from './lib/RosGraph'
import Publisher from './Publisher';
import Subscriber from './Subscriber';

type TopicWidgetProps = {
  addWidget: (id: string, element: React.Element<any>, name?: string) => void,
  node: RosGraph.Topic,
  ros: ROSLIB.Ros,
}

function CreateSubscriberAction(props: TopicWidgetProps) {
  const id = "subscriber_" + props.node.path;
  return (
    <div>
      <ReactTooltip effect="solid" place="right" type="info"/>
      <div data-tip={"Subscribe to " + props.node.path} className="SmallButton ColorTwo" onClick={() => {
        props.addWidget(id, (
          <Subscriber key={id} ros={props.ros} topic={props.node.path} type={props.node.messageType}/>
        ), props.node.path + " subscriber")
      }}>
        Subscribe
      </div>
    </div>
  )
}

function CreatePublisherAction(props: TopicWidgetProps) {
  const id = "publisher_" + props.node.path;
  console.log("pub node", props.node)
  return (
    <div>
      <ReactTooltip effect="solid" place="right" type="info"/>
      <div data-tip={"Publish to " + props.node.path} className="SmallButton ColorThree" onClick={() => {
        props.addWidget(id, (
          <Publisher key={id} ros={props.ros} topic={props.node.path} type={props.node.messageType}/>
        ), props.node.path + " publisher")
      }}>
        Publish
      </div>
    </div>
  )
}

type Props = {
  addWidget: (id: string, element: React.Element<any>, name?: string) => void,
  children?: React.Node,
  node: ?RosGraph.Primitive,
  ros: ROSLIB.Ros,
}

function ButtonPanel(props: Props) {

  if (!props.node) {
    return (
      <div className="ButtonPanel">
        {props.children}
      </div>
    )
  }

  // TODO: This will be replaced by widget registration somehow
  var buttons = [];
  switch (props.node.type) {
    case "topic":
        const topic: RosGraph.Topic = props.node
        buttons.push(<CreatePublisherAction key={"publish_" + topic.path} ros={props.ros} addWidget={props.addWidget} node={topic} />)
        buttons.push(<CreateSubscriberAction key={"subscribe_" + topic.path} ros={props.ros} addWidget={props.addWidget} node={topic} />)
      break;
    case "node":

      break;
    case "service":

      break;
    case "action":

      break;
    default:
      // console.log("No actions for type: " + props.node.type);
      return false;
  }

  return (
    <div className="ButtonPanel">
      {props.children}
      {buttons}
    </div>)

}
export default ButtonPanel;
