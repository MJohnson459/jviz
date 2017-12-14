// @flow
import * as React from 'react'

type Props = {
  name: string,
  onRequestClose?: () => void,
  children: React.Element<any>,
}

function Widget(props: Props) {
    const gridProps = Object.assign({}, props);
    delete gridProps.name;
    delete gridProps.onRequestClose;

    return (
        <div {...gridProps} className={'Widget'} >
            <div className={'Header'}>
                <div className={'Name'}>{props.name}</div>
                {props.onRequestClose ? <div className={'Close'} onClick={props.onRequestClose}>x</div> : false}
            </div>
            <div className={'Main'}>
                {props.children}
            </div>
        </div>
    );
}

export default Widget;
