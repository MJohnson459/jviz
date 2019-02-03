// @flow
import * as React from 'react';
import ROSLIB from 'roslib';
import Message from './Message'
import Widget from './Widget';

type RosMessage = {
  header?: {
    stamp: {
      secs: number,
      nsecs: number,
    }
  }
}

type Details = {
  examples: Array<mixed>,
  fieldarraylen: Array<number>,
  fieldnames: Array<string>,
  fieldtypes: Array<string>,
  type: string,
}

type Props = {
  details: Array<Details>,
  onRequestClose?: () => void,
  ros: ROSLIB.Ros,
  topic: string,
  type: string,
}

type State = {
  auto: boolean,
  message: RosMessage,
  repeat: number,
  values: Array<Array<mixed>>,
}

class Publisher extends React.Component<Props, State> {
  state = {
    auto: false,
    message: this.decodeTypeDefsRec(this.props.details[0], this.props.details),
    repeat: 0,
    values: this.props.details.map((message) => message.examples),
  }

  intervalId: ?IntervalID = null

  frequency = [
    {interval: 0, display: "Single"},
    {interval: 10000, display: "0.1 Hz"},
    {interval: 5000, display: "0.5 Hz"},
    {interval: 1000, display: "1 Hz"},
    {interval: 200, display: "5 Hz"},
    {interval: 100, display: "10 Hz"}]

  publisher = new ROSLIB.Topic({
    ros : this.props.ros,
    name : this.props.topic,
    messageType : this.props.type,
  })

  // calls itself recursively to resolve type definition using hints.
  decodeTypeDefsRec(theType: Details, hints: Array<Details>) {
    var typeDefDict = {};
    for (var i = 0; i < theType.fieldnames.length; i++) {
      const arrayLen: number = theType.fieldarraylen[i];
      const fieldName: string = theType.fieldnames[i];
      const fieldType: string = theType.fieldtypes[i];
      var fieldExample: any = theType.examples[i];
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

  componentWillUnmount = () => {
    if (this.state.repeat && this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.setState({repeat: 0})
  }

  publish = () => {
    if (!this.state.message) return
    var messageObj: RosMessage = this.state.message;

    if (this.state.auto) {
      const time = Date.now()
      if (messageObj.header) messageObj.header.stamp = {
          secs: time / 1000,
          nsecs: time % 1000,
      }
    }

    const message = new ROSLIB.Message(messageObj);

    this.publisher.publish(message);
  }

  toggleRepeat = () => {
    const index = (this.state.repeat + 1) % this.frequency.length
    if (this.intervalId) clearInterval(this.intervalId)

    if (index !== 0) {
      this.intervalId = setInterval(this.publish, this.frequency[index].interval); // publish at 1Hz
    }

    this.setState({
      repeat: index,
    })
  }

  render() {
    return (
      <Widget name={"Pub: " + this.props.topic} onRequestClose={this.props.onRequestClose}>
        <div className="Publisher">
          <div style={{display: "flex", flexDirection: "column", flex: 1}}>
            <div style={{padding: 5, overflowY: "auto", flex: 1}}>
              <Message
                auto={this.state.auto}
                message={this.state.message}
                messageDetails={this.props.details}
                name={this.props.type}
                updateState={(state) => this.setState(state)}
                values={this.state.values}
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
        </div>
      </Widget>
    );
  }
}

export default Publisher;
