import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import _ from 'lodash';

import { Button, Welcome } from '@storybook/react/demo';
import NodeTree from '../NodeTree';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>);

function insert(data, path) {
  if (path.length === 1) {
    data.push({
      name: path[0]
    });
    return data;
  }
  var index = _.findIndex(data, (o) => o.name === path[0])
  if (index === -1) {
    /// add new element
    index = data.push({
      name: path[0],
      toggled: false,
      children: [],
    }) - 1;
  }
  return insert(data[index].children, path.slice(1));
}

function add_node(data, name) {
  const path = name.split('/').slice(1)
  return insert(data, path);
}

storiesOf('NodeTree', module)
  .add('basic', () => {

    var nodes = [
      {name: '/t1/t2/t3/t5'},
      {name: '/t1/t2/t4'},
      {name: '/s1/s2/s3/s4'},
      {name: '/s1/s5/s6/s7'},
      {name: '/s1/s2/s5/s6'}
    ]

    return (
      <NodeTree nodes={nodes} />
    )
  });
