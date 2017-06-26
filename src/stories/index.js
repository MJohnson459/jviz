import React from 'react';
import ROSLIB from 'roslib';

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

storiesOf('NodeTree', module)
  .add('basic', () => {

    const nodes = [
      {
        details: {},
        id: "n_/listener_one",
        name: "/listener_one/t1/t3",
        selected: false,
      },{
        details: {},
        id: "n_/listener_two",
        name: "/listener_two/t5/t1",
        selected: false,
      },
    ];

    return (
      <NodeTree nodes={nodes} />
    )
  });
