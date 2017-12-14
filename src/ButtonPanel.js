// @flow
import * as React from 'react';
import ReactTooltip from 'react-tooltip';
import ROSLIB from 'roslib';

import * as RosGraph from './lib/RosGraph'
import Publisher from './Publisher';
import Subscriber from './Subscriber';

type TopicWidgetProps = {
  addWidget: (id: string, element: React.Element<any>, name?: string) => void,
  removeWidget: (id: string) => void,
  node: RosGraph.Topic,
  ros: ROSLIB.Ros,
}

function CreateSubscriberButton(props: TopicWidgetProps) {
  const id = "subscriber_" + props.node.path;
  return (
    <div>
      <ReactTooltip effect="solid" place="right" type="info"/>
      <div data-tip={"Subscribe to " + props.node.path} className="SmallButton ColorTwo" onClick={() => {
        props.addWidget(id, (
          <Subscriber ros={props.ros} topic={props.node.path} type={props.node.messageType} onRequestClose={() => props.removeWidget(id)}/>
        ), props.node.path + " subscriber")
      }}>
        Subscribe
      </div>
    </div>
  )
}

function CreatePublisherButton(props: TopicWidgetProps) {
  const id = "publisher_" + props.node.path;
  return (
    <div>
      <ReactTooltip effect="solid" place="right" type="info"/>
      <div data-tip={"Publish to " + props.node.path} className="SmallButton ColorThree" onClick={() => {
        props.ros.getMessageDetails(props.node.messageType, (details) => {
          props.addWidget(id, (
            <Publisher ros={props.ros} details={details} topic={props.node.path} type={props.node.messageType} onRequestClose={() => props.removeWidget(id)} />
          ), props.node.path + " publisher")
        }, (message) => {
          console.log("Message details failed", this.props.type, message)
        })
      }}>
        Publish
      </div>
    </div>
  )
}

type HideProps = {
  path: string,
  type: string,
  hideItem: (path: string, type: string) => void,
}

function HideItemButton(props: HideProps) {
  return (
    <div>
      <ReactTooltip effect="solid" place="right" type="info"/>
      <div data-tip={"Hide " + props.path} className="SmallButton ColorOne" onClick={() => {
        props.hideItem(props.path, props.type)
      }}>
        Hide
      </div>
    </div>
  )
}

type Props = {
  addWidget: (id: string, element: React.Element<any>, name?: string) => void,
  removeWidget: (id: string) => void,
  hideItem: (path: string, type: string) => void,
  node: RosGraph.Primitive,
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
        buttons.push(<CreatePublisherButton key={"publish_" + topic.path} ros={props.ros} addWidget={props.addWidget} removeWidget={props.removeWidget} node={topic} />)
        buttons.push(<CreateSubscriberButton key={"subscribe_" + topic.path} ros={props.ros} addWidget={props.addWidget} removeWidget={props.removeWidget} node={topic} />)
        buttons.push(<HideItemButton key={"hide_" + topic.path} hideItem={props.hideItem} path={topic.path} type={props.node.type} />)
      break;
    case "node":
      const node: RosGraph.Node = props.node
      buttons.push(<HideItemButton key={"hide_" + node.path} hideItem={props.hideItem} path={node.path} type={props.node.type} />)
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
      {buttons}
    </div>)

}
export default ButtonPanel;
