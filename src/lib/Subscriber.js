// @flow
import ROSLIB from 'roslib';

type Message = {}

type Props = {
  onReceiveMessage: ({messages: Array<Message>, messageCount: number}) => void,
  ros: ROSLIB.Ros,
  topic: string,
  type: string,
}

class Subscriber {
  MAX_BUFFER: number = 500
  MAX_HISTORY: number = 1000
  UPDATE_DURATION: number = 500 // Time between drawing new messages in milliseconds

  messageBuffer: Array<Message> = [] // Where to store new messages between draws
  messageCount: number = 0
  messages: Array<Message> = []
  nextUpdate: number = Date.now() + this.UPDATE_DURATION // ms
  subscriber: ROSLIB.Topic
  topic: string



  constructor(props: Props) {
    this.topic = props.topic
    this.subscriber = new ROSLIB.Topic({
      ros: props.ros,
      name: props.topic,
      messageType: props.type,
    })

    this.subscriber.subscribe((message: Message) => {
      this.messageBuffer.unshift(message);
      this.messageCount += 1;

      // Two ways that will force a flush
      const bufferFull = this.messageBuffer.length >= this.MAX_BUFFER;
      const timePassed = Date.now() >= this.nextUpdate;

      if (bufferFull || timePassed) {
        this.messages.unshift(...this.messageBuffer)

        if (this.messages.length > this.MAX_HISTORY) {
          this.messages = this.messages.slice(0, this.MAX_HISTORY)
        }

        // Clear buffer
        this.messageBuffer = [];
        this.nextUpdate = Date.now() + this.UPDATE_DURATION;

        props.onReceiveMessage({messages: this.messages, messageCount: this.messageCount})
      }
    })
  }
}

export default Subscriber;
