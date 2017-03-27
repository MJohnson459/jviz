import React, { Component } from 'react';

function Widget(props) {
  return (
    <div className={'Widget'}>
        <div className={'Header'}>
            <h2 className={'HeaderName'}>{props.name}</h2>
            <button className={'HeaderClose'} onClick={props.onRequestHide}>X</button>
        </div>
        {props.children}
    </div>
  );
}

export default Widget;
