﻿import React = require('react');
import Moment = require('moment');

import {Grid} from './vwGrid';
import {Edit} from './vwEdit';
import {HeadView} from '../ts-comm/vwHeadView';

export class AStart extends React.Component<any, any>{

    constructor() {
        super();
        this.state = {};
    }
    componentWillMount() {
        this.props.getInitData();
    }
    render() {
        let out_html: JSX.Element = null;
        let out_main_view = null;

        if (this.props.edit_type == IEditType.none) {
            out_main_view = <Grid {...this.props} />;
        }

        if (this.props.edit_type == IEditType.update || this.props.edit_type == IEditType.insert) {
            out_main_view = <Edit {...this.props} />;
        }

        out_html =
            (
                <div>
                    <HeadView />
                    {out_main_view}
                </div>
            );

        return out_html;
    }
}