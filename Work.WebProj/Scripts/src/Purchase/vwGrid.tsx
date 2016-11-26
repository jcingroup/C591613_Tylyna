import React = require('react');
import Moment = require('moment');
import {Init_Data} from './pub';
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
        };
    }
    queryGridData(page?: number) {//navpage 用
        let params = this.props.search;

        params['page'] = page == null ? this.props.page_operator.page : page;

        this.props.callGridLoad(params);
    }
    addState() {
        let init_data: Init_Data = this.props.init_data;
        let data: server.Purchase = {
            purchase_no: '',
            customer_id: 0,
            order_date: null,
            ship_date: null,
            pay_type: 0,
            pay_state: IPayState.unpaid,
            ship_state: IShipState.unshipped,
            cancel_reason: null,
            total: 0,
            ship_fee: 0,
            bank_charges: 0,
            Deatil: []
        };
        this.props.editState(ac_type_comm.add, '', data);
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
                    <GridSearch search={pp.search} page_operator={pp.page_operator} init_data={pp.init_data}
                        setInputValue={this.props.setInputValue}
                        callGridLoad={this.props.callGridLoad}/>
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