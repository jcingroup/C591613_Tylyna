import React = require('react');
import Moment = require('moment');

import {Grid} from './vwGrid';
import {HeadView} from '../ts-comm/vwHeadView';

export class AStart extends React.Component<any, any>{

    constructor() {
        super();
        this.state = {};
    }
    componentWillMount() {
        //this.props.getInitData();
    }
    render() {
        let out_html: JSX.Element = null;
        let out_main_view = <Grid {...this.props} />;

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