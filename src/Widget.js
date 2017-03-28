import React, { Component } from 'react';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
        hidden: false,
    }

    this.onRequestHide = this.onRequestHide.bind(this);
  }

  onRequestHide() {
      this.setState({
            hidden: !this.state.hidden,
      });
  }

  render() {
    return (
        <div className={'Widget'}>
            <div className={'WidgetHeader'} onClick={this.onRequestHide}>
                <div className={'HeaderName'}>{this.props.name}</div>
                <div className={'HeaderClose'} onClick={this.props.onRequestHide}>X</div>
            </div>
            { this.state.hidden ||
                <div className={'WidgetMain'}>
                    {this.props.children}
                </div>
            }
        </div>
    );
  }

}

export default Widget;
