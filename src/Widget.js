import React, { Component } from 'react';

function Widget(props) {
    return (
        <div {...props} className={'Widget'} >
            <div className={'WidgetHeader'}>
                <div className={'HeaderName'}>{props.name}</div>
                <div className={'HeaderClose'} onClick={props.onRequestClose}>X</div>
            </div>
            <div className={'WidgetMain'}>
                {props.children}
            </div>
        </div>
    );
}

export default Widget;
