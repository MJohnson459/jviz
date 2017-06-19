import React, { Component } from 'react';
import _ from 'lodash';

class Message extends Component {
  constructor(props) {
    super(props);

    this.MessageField = this.MessageField.bind(this);
    this.MessageFieldArray = this.MessageFieldArray.bind(this);
    this.MessageType = this.MessageType.bind(this);
    this.MessageHeader = this.MessageHeader.bind(this);
  }

  MessageField(props) {
    return (
      <div className="MessageLine" key={props.messageIndex + '_'+ props.fieldIndex}>
        <span className="MessageLabel">{props.name} ({this.props.messageDetails[props.messageIndex].fieldtypes[props.fieldIndex]}):</span>
        <input className="MessageTypeInput"
          type="text"
          value={this.props.values[props.messageIndex][props.fieldIndex]}
          onChange={
            (event) => {
              // Update message
              const message = this.props.message;
              _.set(message, props.path, event.target.value);

              const values = this.props.values;
              values[props.messageIndex][props.fieldIndex] = event.target.value;

              this.props.updateState({
                message: message,
                values: values,
              });
            }
          }/>
        </div>
      )
    }

    MessageFieldFloat(props) {
      return (
        <div className="MessageLine" key={props.messageIndex + '_'+ props.fieldIndex}>
          <span className="MessageLabel">{props.name} ({this.props.messageDetails[props.messageIndex].fieldtypes[props.fieldIndex]}):</span>
          <input className="MessageTypeInput"
            type="text"
            value={this.props.values[props.messageIndex][props.fieldIndex]}
            onChange={
              (event) => {
                // Update message
                const message = this.props.message;
                _.set(message, props.path, parseFloat(event.target.value, 10));

                const values = this.props.values;
                values[props.messageIndex][props.fieldIndex] = parseFloat(event.target.value, 10);

                this.props.updateState({
                  message: message,
                  values: values,
                });
              }
            }/>
        </div>
      )
    }

    MessageFieldInteger(props) {
      return (
        <div className="MessageLine" key={props.messageIndex + '_'+ props.fieldIndex}>
          <span className="MessageLabel">{props.name} ({this.props.messageDetails[props.messageIndex].fieldtypes[props.fieldIndex]}):</span>
          <input className="MessageTypeInput"
            type="text"
            value={this.props.values[props.messageIndex][props.fieldIndex]}
            onChange={
              (event) => {
                // Update message
                const message = this.props.message;
                _.set(message, props.path, parseInt(event.target.value, 10));

                const values = this.props.values;
                values[props.messageIndex][props.fieldIndex] = parseInt(event.target.value, 10);

                this.props.updateState({
                  message: message,
                  values: values,
                });
              }
            }/>
        </div>
      )
    }

    MessageFieldArray(props) {
      const message = this.props.messageDetails[props.index];
      const primitivesFloat = [
        "float32",
        "float64",
      ];
      const primitivesInteger = [
        "int8",
        "uint8",
        "int16",
        "uint16",
        "int32",
        "uint32",
        "int64",
        "uint64",
      ];
      const primitives = [
        "byte",
        "bool",
        "string",
      ];

      const x = message.fieldtypes.map((field, i)=>{
        const name = message.fieldnames[i];
        const path = [...props.path, name];
        if (primitives.includes(field)) {
          return this.MessageField({name: name, fieldIndex: i, messageIndex: props.index, path: path});
        } else if (primitivesFloat.includes(field)) {
          return this.MessageFieldFloat({name: name, fieldIndex: i, messageIndex: props.index, path: path});
        } else if (primitivesInteger.includes(field)) {
          return this.MessageFieldInteger({name: name, fieldIndex: i, messageIndex: props.index, path: path});
        } else if (field === "std_msgs/Header") {
          return this.MessageHeader({name: name, index: props.index + 1, path: path});
        } else {
          return this.MessageType({name: name, index: props.index + 1, path: path});
        }
      })

      return (
        <div style={{marginLeft: 10}}>{x}</div>
      )
    }

    MessageType(props) {
      return (
        <div key={props.messageIndex + '_'+ props.fieldIndex}>
          <div className="MessageLabel" style={{marginRight: 5}}>{props.name}:</div>
          {this.MessageFieldArray({index: props.index, path: props.path})}
        </div>
      );
    }

    MessageHeader(props) {
      return (
        <div key={props.messageIndex + '_'+ props.fieldIndex}>
          <div className="MessageLine">
            <span className="MessageLabel">{props.name}:</span>
            <select className="MessageTypeInput" value={this.props.auto} onChange={(event) => this.props.updateState({auto: event.target.value === "true"})}>
              <option value={true}>auto</option>
              <option value={false}>manual</option>
            </select>
          </div>
          {this.props.auto || this.MessageFieldArray({index: props.index, path: props.path})}
        </div>
      )
    }

    render() {
      return this.MessageFieldArray({...this.props, index: 0, path: []});
    }
  }

  export default Message;
