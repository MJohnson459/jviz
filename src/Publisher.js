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
            })
        }, (message)=>{
            console.log("msg details FAILED", this.props.type, message)
        });

        this.publish = this.publish.bind(this);
    }

    publish() {
        var message = new ROSLIB.Message({
            data: this.state.count.toString(),
        });

        this.publisher.publish(message);
        this.setState( {
            count: this.state.count + 1,
        });
    }

    render() {
        return (
            <div className="Publisher">
                { this.state.messageDetails === null ||
                <div style={{display: "flex", flexDirection: "column", flex: 1}}>
                      <div style={{padding: 5, overflowY: "auto", flex: 1}}>
                        <Message name={this.props.type} messages={this.state.messageDetails} index={0} indent={0} />
                      </div>
                      <div style={{display: "flex", flex: "0 0 25px", flexDirection: "row"}}>
                        <div className="SmallButton ColorOne" onClick={this.publish}>
                            publish {this.state.count}
                        </div>
                        <div className="SmallButton ColorTwo" onClick={this.publish}>
                            repeat
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
