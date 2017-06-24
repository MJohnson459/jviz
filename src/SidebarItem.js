import React, { Component } from 'react';

class SidebarItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
        hidden: props.hidden,
        name: props.name,
    }

    this.onRequestHide = this.onRequestHide.bind(this);
  }

  onRequestHide() {

  }

  render() {
    return (
        <div {...this.props} className={'SidebarItem'} >
            <div className={'WidgetHeader'} onClick={this.onRequestHide}>
                <div className={'HeaderName'}>{this.state.name}</div>
            </div>
            { this.state.hidden ||
                <div className={'SidebarItemMain'}>
                    {this.props.children}
                </div>
            }
        </div>
    );
  }

}

export default SidebarItem;
