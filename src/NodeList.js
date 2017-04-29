import React, { Component } from 'react';
import SidebarItem from './SidebarItem.js';
import { Scrollbars } from 'react-custom-scrollbars';

class NodeList extends Component {

    updateNodeList() {
        this.props.ros.getNodes((list) => {
          // console.log(list);
            this.setState({
                nodes: list,
            });
        }, (message) => {
            console.log('NodeList updateNodeList failed: ' + message);
        });

    }

    constructor(props) {
        super(props);

        this.state = {
            nodes: [],
            hidden: props.hidden,
        }

        this.updateNodeList = this.updateNodeList.bind(this);
        this.updateNodeList();
    }

    render() {
        return (
        <SidebarItem name="Node List" hidden={this.state.hidden}>
            <Scrollbars className="NodeList" style={{ height: "inherit", backgroundColor: "#DDDDDD" }}>
                <ul className="App-intro">
                    {this.state.nodes.map((item) =>
                      <li key={item} style={{textAlign: "left"}}>{item}</li>
                    )}
                </ul>
            </Scrollbars>
            <div className="SmallButton ColorThree" onClick={this.updateNodeList}>
                Update
            </div>
        </SidebarItem>
        );
    }
}

export default NodeList;
