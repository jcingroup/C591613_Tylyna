import React = require('react');
import Moment = require('moment');
import {config} from '../ts-comm/def-data';
import {ac_type_comm} from '../action_type';
import {TagShowAndHide, PWButton} from '../components';
//view
import {GridTableView} from './containers';
import {GridSearch} from './vwGridSearch';

export class Grid extends React.Component<any, { infoShow: boolean }>{

    constructor() {
        super();
        this.state = {
            infoShow: true
        };
    }
    hideInfo(e) {
        this.setState({ infoShow: false });
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
                    <TagShowAndHide show={this.state.infoShow} TagName={TagName.div} className="alert alert-warning text-sm">
                        <PWButton className="close" iconClassName="fa-times" enable={true} onClick={this.hideInfo.bind(this) } />
                        <h5 className="h5">本系統僅統計</h5>
                        <p>- 轉帳匯款：「付款狀態」為 <span className="w3-tag label-success w3-round">已付款</span> 、「出貨狀態」為 <span className="w3-tag label-danger w3-round">待出貨</span></p>
                        <p>- 貨到付款：「出貨狀態」為 <span className="w3-tag label-danger w3-round">待出貨</span></p>
                    </TagShowAndHide>
                    <GridSearch search={pp.search}
                        setInputValue={this.props.setInputValue}
                        callGridLoad={this.props.callGridLoad}/>
                    <GridTableView />
                </div>
            );

        return out_html;
    }
}