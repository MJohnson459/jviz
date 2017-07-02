import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ROSLIB from 'roslib';
import Message from './Message'

class Publisher extends Component {

  constructor(props) {
    super(props);

    this.state = {
      messageDetails: null,
      auto: false,
      repeat: 0,
    }

    this.frequency = [
      {interval: 0, display: "Single"},
      {interval: 10000, display: "0.1 Hz"},
      {interval: 5000, display: "0.5 Hz"},
      {interval: 1000, display: "1 Hz"},
      {interval: 200, display: "5 Hz"},
      {interval: 100, display: "10 Hz"}]

    this.publisher = new ROSLIB.Topic({
      ros : this.props.ros,
      name : this.props.topic,
      messageType : this.props.type,
    });

    this.props.ros.getMessageDetails(this.props.type, (details)=>{
      this.setState({
        messageDetails: details,
        message: this.decodeTypeDefsRec(details[0], details),
        values: details.map((message) => message.examples),
      })
    }, (message)=>{
      console.log("msg details FAILED", this.props.type, message)
    });

    this.publish = this.publish.bind(this);
    this.decodeTypeDefsRec = this.decodeTypeDefsRec.bind(this);
    this.toggleRepeat = this.toggleRepeat.bind(this);
  }

  // calls itself recursively to resolve type definition using hints.
  decodeTypeDefsRec(theType, hints) {
    var typeDefDict = {};
    for (var i = 0; i < theType.fieldnames.length; i++) {
      const arrayLen = theType.fieldarraylen[i];
      const fieldName = theType.fieldnames[i];
      const fieldType = theType.fieldtypes[i];
      var fieldExample = theType.examples[i];
      if (fieldType.indexOf('/') === -1) { // check the fieldType includes '/' or not
        if (arrayLen === -1) {
          if (fieldType === "float64") {
            console.log("fieldExample", fieldExample, parseFloat(fieldExample))
            fieldExample = parseFloat(fieldExample);

          }
          typeDefDict[fieldName] = fieldExample;
        }
        else {
          typeDefDict[fieldName] = [fieldType];
        }
      }
      else {
        // lookup the name
        var sub = false;
        for (var j = 0; j < hints.length; j++) {
          if (hints[j].type.toString() === fieldType.toString()) {
            sub = hints[j];
            break;
          }
        }
        if (sub) {
          const subResult = this.decodeTypeDefsRec(sub, hints);
          if (arrayLen === -1) {
            typeDefDict[fieldName] = subResult;
          }
          else {
            typeDefDict[fieldName] = [subResult];
          }
        }
        else {
          console.log('error', 'Cannot find ' + fieldType + ' in decodeTypeDefs');
        }
      }
    }
    return typeDefDict;
  }

  componentWillUnmount() {
    if (this.state.repeat) {
      clearInterval(this.intervalId);
    }
    this.setState({repeat: false})
  }

  publish() {
    var messageObj = this.state.message;

    if (this.state.auto) {
      const time = Date.now();
      messageObj.header.stamp = {
          secs: time / 1000,
          nsecs: time % 1000,
      }
    }

    const message = new ROSLIB.Message(messageObj);

    this.publisher.publish(message);
  }

  toggleRepeat() {
    const index = (this.state.repeat + 1) % this.frequency.length
    clearInterval(this.intervalId)

    if (index !== 0) {
      this.intervalId = setInterval(this.publish, this.frequency[index].interval); // publish at 1Hz
    }

    this.setState({
      repeat: index,
    })
  }

  render() {
    return (
      <div className="Publisher">
        { this.state.messageDetails === null ||
          <div style={{display: "flex", flexDirection: "column", flex: 1}}>
            <div style={{padding: 5, overflowY: "auto", flex: 1}}>
              <Message name={this.props.type}
                values={this.state.values}
                messageDetails={this.state.messageDetails}
                message={this.state.message}
                auto={this.state.auto}
                updateState={(state) => this.setState(state)}
                />
            </div>
            <div className="ButtonPanel">
              <div className="SmallButton ColorOne" onClick={this.publish}>
                Publish
              </div>
              <div className="SmallButton ColorTwo" onClick={this.toggleRepeat}>
                {this.frequency[this.state.repeat].display}
              </div>
            </div>
          </div>
        }
        {this.props.children}
      </div>
    );
  }
}

Publisher.propTypes = {
  ros: PropTypes.instanceOf(ROSLIB.Ros).isRequired,
  topic: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  children: PropTypes.element,
}

export default Publisher;
