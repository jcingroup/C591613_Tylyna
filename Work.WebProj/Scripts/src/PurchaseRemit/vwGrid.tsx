import React = require('react');
import Moment = require('moment');
import {config, IPayStateData} from '../ts-comm/def-data';
import {ac_type_comm} from '../action_type';
//view
import {GridTableView} from './containers';
import {GridSearch} from './vwGridSearch';
import {NavPage} from '../components';

export class Grid extends React.Component<any, any>{

    constructor() {
        super();
        this.queryGridData = this.queryGridData.bind(this);

        this.addState = this.addState.bind(this);

        this.state = {
            Reply: gb_approot + "Order/Reply"
        };
    }
    queryGridData(page?: number) {//navpage 用
        let params = this.props.search;

        params['page'] = page == null ? this.props.page_operator.page : page;

        this.props.callGridLoad(params);
    }
    addState() {
        //沒新增
    }
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;
        let p_info: server.PageInfo = pp.page_operator;
        let grid: Array<server.ProductKind> = pp.grid;
        out_html =
            (
                <div>
                    <h3 className="h3">
                        {gb_caption}
                    </h3>
                    <div className="alert alert-warning text-sm">
                        <p>請至 <a href={this.state.Reply} className="btn btn-sm btn-primary" target="_blank">已付款通知頁面</a> 新增或填寫付款資訊</p>
                        <p>本系統僅顯示 「轉帳匯款」 的訂單，且該 「付款狀態」 為 <span className="w3-tag label-danger w3-round">已付款待確認</span> 或 <span className="w3-tag label-success w3-round">已付款</span> 的資料</p>
                    </div>
                    <GridSearch search={pp.search} page_operator={pp.page_operator} RemitCheck={pp.RemitCheck}
                        setInputValue={this.props.setInputValue}
                        callGridLoad={this.props.callGridLoad}
                        updateRemitState={this.props.updateRemitState}/>
                    <GridTableView />
                    <NavPage
                        page={p_info.page}
                        startcount={p_info.startcount}
                        endcount={p_info.endcount}
                        total={p_info.total}
                        records={p_info.records}
                        mapPage={this.queryGridData}
                        clickInsertState={this.addState}
                        showDelete={false}
                        showAdd={false}/>
                </div>
            );

        return out_html;
    }
}