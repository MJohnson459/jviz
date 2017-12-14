// @flow
import * as React from 'react'

type Props = {
  name: string,
  onRequestClose?: () => void,
  children: React.Element<any>,
}

type State = {
  minimised: bool,
}

class Widget extends React.Component<Props, State> {
  state = {
    minimised: false
  }

  render() {
    return (
     <div className={'Widget'} >
       <div className={'Header'} onClick={() => this.setState({minimised: !this.state.minimised})}>
        <div className={'Name'}>{this.props.name}</div>
        {this.props.onRequestClose ? <div className={'Close'} onClick={this.props.onRequestClose}>x</div> : false}
      </div>
      {this.state.minimised ? false : <div className={'Main'}>{this.props.children}</div>}
    </div>
    );
  }
}

export default Widget;
