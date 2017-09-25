// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

type Path = Array<string>
type Index = number

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

type ReplaceMe = {
  fieldIndex: Index,
  messageIndex: Index,
  name: string,
  path: Path,
  type: string,
}

type Props = {
  auto: boolean,
  message: RosMessage,
  messageDetails: Array<Details>,
  updateState: ({message?: RosMessage, values?: Array<Array<mixed>>, auto?: boolean}) => void,
  values: Array<Array<mixed>>,
}

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

class Message extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  MessageField = ({fieldIndex, messageIndex, name, path, type}: ReplaceMe): React.Element<any> => {
    return (
      <div className="MessageLine">
        <span className="MessageLabel">{name} ({this.props.messageDetails[messageIndex].fieldtypes[fieldIndex]}):</span>
        <input className="MessageTypeInput"
          type="text"
          value={this.props.values[messageIndex][fieldIndex]}
          onChange={
            (event) => {
              // Update message
              const message = this.props.message;
              var value = null

              if (primitives.includes(type)) {
                value = event.target.value
              } else if (primitivesFloat.includes(type)) {
                value = parseFloat(event.target.value)
              } else if (primitivesInteger.includes(type)) {
                value = parseInt(event.target.value, 10)
              } else {
                console.log("I was not expecting this message type", type)
                return
              }

              _.set(message, path, value);

              const values = this.props.values;
              values[messageIndex][fieldIndex] = value;

              this.props.updateState({
                message: message,
                values: values,
              });
            }
          }/>
        </div>
      )
    }

    MessageFieldArray = ({messageIndex, path}: {messageIndex: Index, path: Path}): React.Element<any> => {
      const message = this.props.messageDetails[messageIndex];

      const x: Array<React.Element<any>> = message.fieldtypes.map((field, i) => {
        const name = message.fieldnames[i];
        const newPath = path.concat(name);
        if (primitives.includes(field) || primitivesFloat.includes(field) || primitivesInteger.includes(field)) {
          return this.MessageField({name: name, fieldIndex: i, messageIndex: messageIndex, path: newPath, type: field});
        } else if (field === "std_msgs/Header") {
          return this.MessageHeader({name: name, messageIndex: messageIndex + 1, path: newPath});
        } else {
          return this.MessageType({name: name, messageIndex: messageIndex + 1, path: newPath});
        }
      })

      return (
        <div style={{marginLeft: 10}}>{x}</div>
      )
    }

    MessageType = ({messageIndex, name, path}: {messageIndex: Index, name: string, path: Path}): React.Element<any> => {
      return (
        <div>
          <div className="MessageLabel" style={{marginRight: 5}}>{name}:</div>
          {this.MessageFieldArray({messageIndex: messageIndex, path: path})}
        </div>
      );
    }

    MessageHeader = ({messageIndex, name, path}: {messageIndex: Index, name: string, path: Path}): React.Element<any> => {
      return (
        <div>
          <div className="MessageLine">
            <span className="MessageLabel">{name}:</span>
            <select className="MessageTypeInput" value={this.props.auto} onChange={(event: {target: {value: boolean}}) => this.props.updateState({auto: event.target.value === "true"})}>
              <option value={true}>auto</option>
              <option value={false}>manual</option>
            </select>
          </div>
          {this.props.auto || this.MessageFieldArray({messageIndex: messageIndex, path: path})}
        </div>
      )
    }

    render() {
      return this.MessageFieldArray({messageIndex: 0, path: []});
    }
}

export default Message;
