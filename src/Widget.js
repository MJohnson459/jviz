// @flow
import * as React from 'react'

type Props = {
  name: string,
  onRequestClose?: () => void,
  children: React.Element<any>,
  state?: string
}

type State = {
  minimised: bool,
}

class Widget extends React.Component<Props, State> {
  state = {
    minimised: false
  }

  formatName = (name: string) => {
    const maxlen = 25
    if (name.length > maxlen) return name.slice(0, maxlen-3) + "..."
    return name
  }

  render() {
    return (
    <div className={'Widget'} >
      <div className={'Header'} onClick={() => this.setState({minimised: !this.state.minimised})}>
        { this.props.state ? <div className={"State" + this.props.state}></div> : false}
        <div className={'Name'}>{this.formatName(this.props.name)}</div>
        {this.props.onRequestClose ? <div className={'Close'} onClick={this.props.onRequestClose}>x</div> : false}
      </div>
      {this.state.minimised ? false : <div className={'Main'}>{this.props.children}</div>}
    </div>
    );
  }
}

export default Widget;
