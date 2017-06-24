import React from 'react';

function Widget(props) {
    const gridProps = Object.assign({}, props);
    delete gridProps.name;
    delete gridProps.onRequestClose;

    return (
        <div {...gridProps} className={'Widget'} >
            <div className={'WidgetHeader'}>
                <div className={'HeaderName'}>{props.name}</div>
                <div className={'HeaderClose'} onClick={props.onRequestClose}>x</div>
            </div>
            <div className={'WidgetMain'}>
                {props.children}
            </div>
        </div>
    );
}

export default Widget;
