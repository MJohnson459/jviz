import React, { Component } from 'react';

class Message extends Component {
    constructor(props) {
        super(props);

        const defaultValues = this.props.messages.map((message, i) => {
          return message.examples;
        })

        this.state = {
            auto: true,
            values: defaultValues,
        }

        this.MessageField = this.MessageField.bind(this);
        this.MessageFieldArray = this.MessageFieldArray.bind(this);
        this.MessageType = this.MessageType.bind(this);
        this.MessageHeader = this.MessageHeader.bind(this);
        this.DisplayMessage = this.DisplayMessage.bind(this);
    }

    MessageField(props) {
        return (
            <div className="MessageLine" key={'' + props.messageIndex + '_'+ props.fieldIndex}>
                <span style={{marginRight: 5}}>{props.name}: </span>
                <input className="MessageTypeInput" style={{width: "100%" }} type="text" value={this.state.values[props.messageIndex][props.fieldIndex]} onChange={
                    (event) => {
                      const values = this.state.values;

                    //   props.keys.reduce()
                      //
                    //   this.message[key1][key2][...]

                      values[props.messageIndex][props.fieldIndex] = event.target.value;
                      this.setState({
                        values: values,
                    })}
                  }/>
            </div>
        )
    }

    MessageFieldArray(props) {
        const message = this.props.messages[props.index];
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
                return this.MessageField({name: message.fieldnames[i], fieldIndex: i, messageIndex: props.index});
            } else if (field === "std_msgs/Header") {
                return this.MessageHeader({name: message.fieldnames[i], index: props.index + 1});
            } else {
                return this.MessageType({name: message.fieldnames[i], index: props.index + 1});
            }
        })

        return (
            <div style={{marginLeft: 10}}>{x}</div>
        )
    }

    MessageType(props) {
        return (
            <div key={'' + props.messageIndex + '_'+ props.fieldIndex}>
                <span className="MessageLine" style={{marginRight: 5}}>{props.name}: </span>
                {this.MessageFieldArray({index: props.index})}
            </div>
        );
    }

    MessageHeader(props) {
        return (
            <div key={'' + props.messageIndex + '_'+ props.fieldIndex}>
                <div className="MessageLine">
                    <span style={{marginRight: 5}}>{props.name}: </span>
                    <select className="MessageTypeInput" onChange={(event)=>this.setState({auto: !this.state.auto})}>
                        <option>auto</option>
                        <option>manual</option>
                    </select>
                </div>
                {this.state.auto || this.MessageFieldArray({index: props.index})}
            </div>
        )
    }

    DisplayMessage(message) {
        var x = [];
        for (const field in message) {
            if (typeof(field) === "boolean" ||
                typeof(field) === "number" ||
                typeof(field) === "string") {
                console.log("DisplayMessage1", field, typeof(field))
                x.push((<p>{field}</p>))
            } else if (typeof(field) === "object") {
                console.log("DisplayMessage2", field, typeof(field))
                x.push(this.DisplayMessage(field))
            } else {
                console.log("DisplayMessage3", field, typeof(field))
            }
        }
        return <div>{x}</div>;
    }

    render() {

        // return this.DisplayMessage(this.props.message);


      return this.MessageFieldArray({...this.props, index: 0});
    }
}
export default Message;
