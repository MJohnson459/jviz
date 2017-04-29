import React, { Component } from 'react';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
        name: props.name,
    }

    this.onRequestHide = this.onRequestHide.bind(this);
  }

  onRequestHide() {
    //   const hidden = this.state.hidden;
  }

  render() {
    return (
        <div {...this.props} className={'Widget'} >
            <div className={'WidgetHeader'} onClick={this.onRequestHide}>
                <div className={'HeaderName'}>{this.state.name}</div>
                <div className={'HeaderClose'} onClick={this.props.onRequestClose}>X</div>
            </div>
            <div className={'WidgetMain'}>
                {this.props.children}
            </div>
        </div>
    );
  }

}

export default Widget;
