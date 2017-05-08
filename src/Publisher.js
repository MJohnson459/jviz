import React, { Component } from 'react';
import ROSLIB from 'roslib';
import Message from './Message'

class Publisher extends Component {

    constructor(props) {
        super(props);

        this.state = {
            count: 0,
            messageDetails: null,
        }

        this.publisher = new ROSLIB.Topic({
            ros : this.props.ros,
            name : this.props.topic,
            messageType : this.props.type,
        });

        this.props.ros.getMessageDetails(this.props.type, (details)=>{


            this.setState({
                messageDetails: details,
                message: this.decodeTypeDefsRec(details[0], details),
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
        const fieldExample = theType.examples[i];
        if (fieldType.indexOf('/') === -1) { // check the fieldType includes '/' or not
          if (arrayLen === -1) {
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
        const message = new ROSLIB.Message(this.state.message);

        this.publisher.publish(message);
        this.setState( {
            count: this.state.count + 1,
        });
    }

    toggleRepeat() {
      if (this.state.repeat) {
        // Toggle off
        clearInterval(this.intervalId)
      } else {
        // Toggle on
        this.intervalId = setInterval(this.publish, 1000); // publish at 1Hz
      }

      this.setState({
        repeat: !this.state.repeat,
      })
    }

    render() {
        return (
            <div className="Publisher">
                { this.state.messageDetails === null ||
                <div style={{display: "flex", flexDirection: "column", flex: 1}}>
                      <div style={{padding: 5, overflowY: "auto", flex: 1}}>
                        <Message name={this.props.type} messages={this.state.messageDetails} updateMessage={(message) => this.setState({message: message})} message={this.state.message} />
                      </div>
                      <div style={{display: "flex", flex: "0 0 25px", flexDirection: "row"}}>
                        <div className="SmallButton ColorOne" onClick={this.publish}>
                            publish {this.state.count}
                        </div>
                        <div className="SmallButton ColorTwo" onClick={this.toggleRepeat}>
                            {this.state.repeat ? "1 Hz" : "repeat"}
                        </div>
                    </div>
                </div>
                }
                {this.props.children}
            </div>
        );
    }
}

export default Publisher;
