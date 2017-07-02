import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SidebarItem extends Component {
  constructor(props) {
    super(props);

    this.onRequestHide = this.onRequestHide.bind(this);
  }

  onRequestHide() {

  }

  render() {
    return (
        <div {...this.props} className={'SidebarItem'} >
            <div className={'WidgetHeader'} onClick={this.onRequestHide}>
                <div className={'HeaderName'}>{this.props.name}</div>
            </div>
            { this.props.hidden ||
                <div className={'SidebarItemMain'}>
                    {this.props.children}
                </div>
            }
        </div>
    );
  }

}

SidebarItem.propTypes = {
  children: PropTypes.react,
  hidden: PropTypes.bool,
  name: PropTypes.string.isRequired,
}

export default SidebarItem;
