import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import ROSLIB from 'roslib';

import Publisher from './Publisher.js';
import Subscriber from './Subscriber.js';

function CreateSubscriberAction(props) {
  const id = "subscriber_" + props.topic;
  return (
    <div>
      <ReactTooltip effect="solid" place="right" type="info"/>
      <div data-tip={"Subscribe to " + props.topic} className="SmallButton ColorOne" onClick={() => {
        props.addWidget(id, (
          <Subscriber key={id} ros={props.ros} topic={props.topic} type={props.type}/>
        ), props.topic + " subscriber")
      }}>
        Subscribe
      </div>
    </div>
  )
}

CreateSubscriberAction.propTypes = {
  topic: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  ros: PropTypes.instanceOf(ROSLIB.Ros).isRequired,
  addWidget: PropTypes.func.isRequired,
}

function CreatePublisherAction(props) {
  const id = "publisher_" + props.topic;
  return (
    <div>
      <ReactTooltip effect="solid" place="right" type="info"/>
      <div data-tip={"Publish to " + props.topic} className="SmallButton ColorTwo" onClick={() => {
        props.addWidget(id, (
          <Publisher key={id} ros={props.ros} topic={props.topic} type={props.type}/>
        ), props.topic + " publisher")
      }}>
        Publish
      </div>
    </div>
  )
}

CreatePublisherAction.propTypes = {
  topic: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  ros: PropTypes.instanceOf(ROSLIB.Ros).isRequired,
  addWidget: PropTypes.func.isRequired,
}

function ButtonPanel(props) {

  if (props.header === undefined) {
    return (
      <div className="ButtonPanel">
        {props.children}
      </div>
    )
  }

  const header = props.header;
  // {
  //   actionType: "topic",
  //   topic: "/test/sub",
  //   type: "std_msgs/String",
  // }

  // TODO: This will be replaced by widget registration somehow
  var widgets = [];
  switch (header.actionType) {
    case "topic":
        widgets = ["publish", "subscribe"];
      break;
    case "node":

      break;
    case "service":

      break;
    case "action":

      break;
    default:
      console.log("No actions for type: " + header.actionType);
      return false;
  }

  return (
    <div className="ButtonPanel">
      {props.children}
      {
        widgets.map((widget) => {
          switch (widget) {
            case "publish":
              return <CreatePublisherAction key={"publish_" + header.topic} ros={props.ros} addWidget={props.addWidget} {...header} />
            case "subscribe":
              return <CreateSubscriberAction key={"subscribe_" + header.topic} ros={props.ros} addWidget={props.addWidget} {...header} />
            default:
              console.log("Couldn't create action for type: " + widget);
              return false;
          }
        })
      }
    </div>)

}

ButtonPanel.propTypes = {
  header: PropTypes.object,
  ros: PropTypes.instanceOf(ROSLIB.Ros).isRequired,
  addWidget: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
}

export default ButtonPanel;
