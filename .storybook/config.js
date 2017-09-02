/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import {configure} from '@storybook/react';

const req = require.context('../src/stories', true, /\.js$/)

function loadStories() {
  req.keys()
    .forEach((filename) => req(filename))
}

configure(loadStories, module);
