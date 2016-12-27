import React = require('react');
import Moment = require('moment');

import {Finish} from './vwFinish';
import {Check} from './vwCheck';

export class AStart extends React.Component<any, any>{

    constructor() {
        super();
        this.state = {
        };
    }

    render() {
        let out_html: JSX.Element = null;

        if (this.props.oper_page == OperatorType.Set) {
            out_html = <Check {...this.props} />;
        }

        if (this.props.oper_page == OperatorType.Finish) {
            out_html = <Finish {...this.props} />;
        }

        return out_html;
    }
}


