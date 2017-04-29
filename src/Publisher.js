import React, { Component } from 'react';
import ROSLIB from 'roslib';
import Widget from './Widget.js'

// MessageType
import SyntaxHighlighter from 'react-syntax-highlighter';
import YAML from 'yamljs';

class MessageHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            auto: true,
        }
    }

    render() {
        const message = this.props.messages[this.props.index];
        return (
            <div>
                <span style={{marginRight: 5}}>{this.props.name}: </span>
                    <select className="MessageTypeInput" onChange={(event)=>this.setState({auto: !this.state.auto})}>
                        <option>auto</option>
                        <option>manual</option>
                    </select>
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
        <div style={{display: "flex"}}>
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
        } else if (field == "std_msgs/Header") {
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

class MessageType extends Component {

    constructor(props) {
        super(props);



    }

    render() {
        console.log("props", this.props)

        return (
            <div>
                <span style={{marginRight: 5}}>{this.props.name}: </span>
                <MessageFields messages={this.props.messages} index={this.props.index} />
            </div>
        );
    }

}

class Publisher extends Component {

    constructor(props) {
        super(props);
        console.log('Constructing Publisher');

        this.state = {
            topic: "-1",
            count: 0,
            topics: {
                topics: [],
                types: [],
            },
            messageDetails: "",
            connected: false,
        }

        this.getTopics();

        this.publish = this.publish.bind(this);
        this.getTopics = this.getTopics.bind(this);
        this.changeTopic = this.changeTopic.bind(this);
    }

    publish() {
        console.log('Publishing ' + this.state.count);
        var message = new ROSLIB.Message({
            data: this.state.count.toString(),
        });

        this.publisher.publish(message);
        this.setState( {
            count: this.state.count + 1,
        });
    }

    getTopics() {
        this.props.ros.getTopics((topicList) => {
            this.setState({
                topics: topicList,
            });
            console.log('NodeList updateNodeList');
        });
    }

    changeTopic(event) {
        console.log(event)
        const topic_index = event.target.value

        this.setState({
            topic: topic_index,
            connected: false,
        });

        if (topic_index !== -1) {
            const topicName = this.state.topics.topics[topic_index];
            const topicType = this.state.topics.types[topic_index];
            this.publisher = new ROSLIB.Topic({
                ros : this.props.ros,
                name : topicName,
                messageType : topicType,
            });

            this.props.ros.getMessageDetails(topicType, (details)=>{
                this.setState({
                    messageDetails: details,
                    connected: true,
                })
                console.log("messageDetails", details)
            }, (message)=>{
                console.log(topicType)
                console.log("msg details FAILED", topicType, message)
            });



        } else {
            this.publisher.unadvertise();
        }
    }


    render() {
        console.log('Rendering Publisher');

        return (
        <Widget {...this.props} name="Publisher">
            <div className="Publisher">
                <select className="MessageTypeInput" onChange={this.changeTopic} style={{height: 25, flex: "0 0 2em"}}>
                    <option key={null} value={-1}>select topic...</option>
                {this.state.topics.topics.map((item, i) =>
                    <option key={item} value={i}>{item}</option>
                )}
                </select>
                { !this.state.connected ||
                <div style={{display: "flex", flexDirection: "column"}}>
                    <div style={{backgroundColor: "#444444", padding: 5, overflowY: "auto"}}>
                        <MessageType name={this.state.messageDetails[0].type} messages={this.state.messageDetails} index={0} indent={0} />
                    </div>

                    <div style={{display: "flex", flex: "0 0 25px", flexDirection: "row-reverse"}}>
                        <div className="smallButton" onClick={this.publish} >
                            publish {this.state.count}
                        </div>
                        <div className="smallButton" onClick={this.publish} style={{backgroundColor: "rgba(128, 177, 18, 0.67)"}} >
                            repeat
                        </div>
                    </div>
                </div>
                }
                {this.props.children}
            </div>
        </Widget>
        );
    }
}

export default Publisher;
