import React from 'react';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { Welcome } from '@storybook/react/demo';

import NodeTree from '../NodeTree';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

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
