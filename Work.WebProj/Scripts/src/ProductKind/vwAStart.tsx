import React = require('react');
import Moment = require('moment');

import {Grid} from './vwGrid';
import {HeadView} from '../ts-comm/vwHeadView';

export class AStart extends React.Component<any, any>{

    constructor() {
        super();
        this.state = {};
    }

    render() {
        let out_html: JSX.Element = null;
        let out_main_view = null;
        out_main_view = <Grid {...this.props} />;

        out_html =
            (
                <div>
                    <HeadView />
                    <h3 className="h3">
                        {gb_caption}
                    </h3>
                    {out_main_view}
                </div>
            );

        return out_html;
    }
}