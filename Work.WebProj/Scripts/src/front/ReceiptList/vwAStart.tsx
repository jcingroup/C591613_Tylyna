import React = require('react');
import Moment = require('moment');

import {List} from './vwList';
import {Content} from './vwContent';

export class AStart extends React.Component<any, any>{

    constructor() {
        super();
        this.state = {
        };
    }

    render() {
        let out_html: JSX.Element = null;

        if (this.props.oper_page == ListOperatorType.List) {
            out_html = <List {...this.props} />;
        }

        if (this.props.oper_page == ListOperatorType.Content) {
            out_html = <Content {...this.props} />;
        }

        return out_html;
    }
}


