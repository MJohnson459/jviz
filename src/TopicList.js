import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import {Treebeard} from 'react-treebeard';
import ROSLIB from 'roslib';

import SidebarItem from './SidebarItem.js';
import Publisher from './Publisher.js';
import Subscriber from './Subscriber.js';
import NodeTree from './NodeTree';
import ButtonPanel from './ButtonPanel';

import styles from './styles/treebeard-theme';

class TopicList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            topics: [],
            tree: [],
        }

        this.getTopics();

        this.getTopics = this.getTopics.bind(this);
        this.onToggleTree = this.onToggleTree.bind(this);
    }

    getTopics() {
        this.props.ros.getTopics((topics) => {
            const x = topics.topics.map((item, i) =>
                {
                    return {
                        name: item,
                        header: {
                            actionType: "topic",
                            topic: item,
                            type: topics.types[i],
                        }
                    }
                }
            )

            this.setState({
                tree: NodeTree.getNodeTree(x),
            });
        });
    }

    onToggleTree(node, toggled) {
      // eslint-disable-next-line
      if(this.state.cursor){this.state.cursor.active = false;}
      node.active = true;
      if(node.children){ node.toggled = toggled; }
      this.setState({ cursor: node });
    }

    render() {

      const header = this.state.cursor ? this.state.cursor.header : undefined;

      return (
        <SidebarItem name="Topic List">
          <Treebeard
            data={this.state.tree}
            onToggle={this.onToggleTree}
            style={styles}
           />
         <ButtonPanel ros={this.props.ros} addWidget={this.props.addWidget} header={header}>
            <div>
              <ReactTooltip effect="solid" place="right" type="info"/>
              <div data-tip="Refresh the list of topics" className="SmallButton ColorThree" onClick={this.getTopics}>
                Refresh
              </div>
            </div>
          </ButtonPanel>
        </SidebarItem>
      );
    }
}

export default TopicList;
