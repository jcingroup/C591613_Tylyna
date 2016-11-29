import React = require('react');
import Moment = require('moment');
import {config} from '../ts-comm/def-data';
import {ac_type_comm} from '../action_type';
//view
import {GridTableView} from './containers';
import {GridSearch} from './vwGridSearch';

export class Grid extends React.Component<any, any>{

    constructor() {
        super();
        this.state = {
        };
    }

    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;

        out_html =
            (
                <div>
                    <h3 className="h3">
                        {gb_caption}
                    </h3>
                    <div className="alert alert-warning p-a-1">
                        下方僅列<br/>
                        「付款方式」為『轉帳匯款』且「付款狀態」為<span className="w3-tag label-success w3-round">已付款</span>、「出貨狀態」為<span className="w3-tag label-danger w3-round">待出貨</span><br />
                        「付款方式」為『貨到付款』且「出貨狀態」為<span className="w3-tag label-danger w3-round">待出貨</span>
                    </div>
                    <GridSearch search={pp.search} 
                        setInputValue={this.props.setInputValue}
                        callGridLoad={this.props.callGridLoad}/>
                    <GridTableView />
                </div>
            );

        return out_html;
    }
}