// @flow
import * as React from 'react';

type Props = {
  children: React.Element<any>,
  name: string,
}

class SidebarItem extends React.Component<Props> {
  render() {
    return (
        <div {...this.props} className={'SidebarItem'} >
            <div className={'WidgetHeader'}>
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

export default SidebarItem;
