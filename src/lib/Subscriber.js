// @flow
import ROSLIB from 'roslib';

type Message = {}

type Props = {
  ros: ROSLIB.Ros,
  topic: string,
  type: string,
}

class Subscriber {
  messages: Array<Message>
  messageCount: number
  subscriber: ROSLIB.Topic

  updateDuration = 500  // Time between drawing new messages in milliseconds
  messageBuffer = [] // Where to store new messages between draws
  messageCount = 0 // Max size of the message list
  messages = []
  nextUpdate = Date.now() + this.updateDuration // ms


  MAX_HISTORY = 1000
  MAX_BUFFER = 500

  state = {
    messages: [],
    messageCount: 0,
  }

  constructor(props: Props) {
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
        const totalSize = this.state.messages.length + this.messageBuffer.length;
        if (totalSize > this.MAX_HISTORY) {
          this.messages.slice(0, this.MAX_HISTORY - totalSize)
        }

        this.messages.unshift(...this.messageBuffer)

        // Clear buffer
        this.messageBuffer = [];
        this.nextUpdate = Date.now() + this.updateDuration;
      }
    })
  }
}

export default Subscriber;
