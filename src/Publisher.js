import React, { Component } from 'react';
import ROSLIB from 'roslib';


class MessageHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            auto: true,
        }
    }

    render() {
        return (
            <div>
                <div className="MessageLine">
                    <span style={{marginRight: 5}}>{this.props.name}: </span>
                    <select className="MessageTypeInput" onChange={(event)=>this.setState({auto: !this.state.auto})}>
                        <option>auto</option>
                        <option>manual</option>
                    </select>
                </div>
                {
                    this.state.auto ||
                    <MessageFields messages={this.props.messages} index={this.props.index} />
                }
            </div>
        )
    }
}

function MessageField(props) {
    return (
        <div className="MessageLine" >
            <span style={{marginRight: 5}}>{props.name}: </span>
            <input className="MessageTypeInput" value={props.example} style={{width: "100%" }} />
        </div>
    )
}

function MessageFields(props) {
    const message = props.messages[props.index];
    const primitives = [
        "byte",
        "bool",
        "int8",
        "uint8",
        "int16",
        "uint16",
        "int32",
        "uint32",
        "int64",
        "uint64",
        "float32",
        "float64",
        "string",
        //time           // API gives time definition
        //duration      // API gives duration definition
    ];

    const x = message.fieldtypes.map((field, i)=>{
        if (primitives.includes(field)) {
            return (
                <MessageField name={message.fieldnames[i]} example={message.examples[i]} />
            );
        } else if (field === "std_msgs/Header") {
            return (
                <MessageHeader name={message.fieldnames[i]} messages={props.messages} index={props.index + 1} />
            )
        } else {
            return (
                <MessageType name={message.fieldnames[i]} messages={props.messages} index={props.index + 1}/>
            )
        }
    })

    return (
        <div style={{marginLeft: 10}}>{x}</div>
    )
}

function MessageType(props) {
    return (
        <div>
            <span className="MessageLine" style={{marginRight: 5}}>{props.name}: </span>
            <MessageFields messages={props.messages} index={props.index} />
        </div>
    );
}

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
                        <MessageType name={this.props.type} messages={this.state.messageDetails} index={0} indent={0} />
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
