import React, { Component } from 'react';

function Widget(props) {
  return (
    <div className={'Widget'}>
        <div className={'Header'}>
            <div className={'HeaderName'}>{props.name}</div>
            <div className={'HeaderClose'} onClick={props.onRequestHide}>X</div>
        </div>
        <div className={'WidgetMain'}>
        {props.children}
        </div>
    </div>
  );
}

export default Widget;
