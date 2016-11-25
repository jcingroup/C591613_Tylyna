import React = require('react');
import Moment = require('moment');

import {Order} from './vwOrder';
import {Check} from './vwCheck';

export class AStart extends React.Component<any, any>{

    constructor() {
        super();
        this.state = {
        };
    }

    render() {
        let out_html: JSX.Element = null;

        if (this.props.oper_page == OrderOperatorType.Order) {
            out_html = <Order {...this.props} />;
        }

        if (this.props.oper_page == OrderOperatorType.Finish) {
            out_html = <Check {...this.props} />;
        }

        return out_html;
    }
}


