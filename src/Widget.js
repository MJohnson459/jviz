import React, { Component } from 'react';

function Widget(props) {
  return (
    <div className={'Widget'}>
      {props.children}
    </div>
  );
}

export default Widget;
