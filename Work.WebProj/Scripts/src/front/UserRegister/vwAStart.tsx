import React = require('react');
import Moment = require('moment');

import {Register} from './vwRegister';
import {Finish} from './vwFinish';

export class AStart extends React.Component<any, any>{

    constructor() {
        super();
        this.state = {
        };
    }

    render() {
        let out_html: JSX.Element = null;

        if (this.props.oper_page == OperatorType.Set) {
            out_html = <Register {...this.props} />;
        }

        if (this.props.oper_page == OperatorType.Finish) {
            out_html = <Finish {...this.props} />;
        }

        return out_html;
    }
}


