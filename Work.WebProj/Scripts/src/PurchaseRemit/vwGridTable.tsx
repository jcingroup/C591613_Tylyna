import $ = require('jquery');
import React = require('react');
import Moment = require('moment');
import {config, UIText, IPayStateDataForRemit} from '../ts-comm/def-data';
import {PWButton, RadioBox} from '../components';
import { OrderButton } from '../ts-comm/OrderButton';
import {ac_type_comm} from '../action_type';
import {Init_Params, Search_Data} from './pub';


export class GridTable extends React.Component<any, any>{

    constructor() {
        super();
        this.setSort = this.setSort.bind(this);
        this.state = {
            Order: gb_approot + 'Active/OrderData/Main'
        };
    }
    setSort(field, sort) {
        let pinfo = this.props.page_operator;
        var parms = {
            page: pinfo.page,
            sort: sort,
            field: field
        };
        $.extend(parms, this.props.search);

        this.props.callGridLoad(parms);
    }
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;
        let grid: Array<server.Purchase> = pp.grid;

        out_html =
            (
                <table className="table table-sm table-bordered table-striped table-hover">
                    <colgroup>
                        <col style={{ "width": "6%" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th className="text-xs-center">{UIText.edit}</th>
                            <th>
                                <OrderButton
                                    title="訂單編號"
                                    field={"purchase_no"}
                                    sort={pp.page_operator.sort}
                                    now_field={pp.page_operator.field}
                                    setSort={this.setSort} />
                            </th>
                            <th>
                                <OrderButton
                                    title="購買人"
                                    field={"receive_name"}
                                    sort={pp.page_operator.sort}
                                    now_field={pp.page_operator.field}
                                    setSort={this.setSort} />
                            </th>
                            <th className="text-xs-center">
                                <OrderButton
                                    title="帳號後5碼"
                                    field={"remit_no"}
                                    sort={pp.page_operator.sort}
                                    now_field={pp.page_operator.field}
                                    setSort={this.setSort} />
                            </th>
                            <th className="text-xs-center">
                                <OrderButton
                                    title="付款金額"
                                    field={"remit_money"}
                                    sort={pp.page_operator.sort}
                                    now_field={pp.page_operator.field}
                                    setSort={this.setSort} />
                            </th>
                            <th>
                                <OrderButton
                                    title="付款日期"
                                    field={"remit_date"}
                                    sort={pp.page_operator.sort}
                                    now_field={pp.page_operator.field}
                                    setSort={this.setSort} />
                            </th>
                            <th>
                                <OrderButton
                                    title="付款狀態"
                                    field={"pay_state"}
                                    sort={pp.page_operator.sort}
                                    now_field={pp.page_operator.field}
                                    setSort={this.setSort} />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {grid.map((item, i) => {
                            return <tr key={i}>
                                <td className="text-xs-center">
                                    <PWButton iconClassName="fa-search-plus" className="btn btn-link btn-lg"
                                        title={UIText.modify} enable={true} />
                                </td>
                                <td><a href={this.state.Order + "?no=" + item.purchase_no}>{item.purchase_no}</a></td>
                                <td className="text-xs-center">{item.receive_name}</td>
                                <td className="text-xs-center">{item.remit_no}</td>
                                <td className="text-xs-center">{item.remit_money}</td>
                                <td className="text-xs-center">{(item.remit_date != null && item.remit_date != undefined) ? Moment(item.remit_date).format(config.dateTime) : "" }</td>
                                <td className="text-xs-center">
                                    <RadioBox
                                        inputViewMode={InputViewMode.view}
                                        name={"pay_state-" + i}
                                        id={"pay_state-" + i}
                                        value={item.pay_state}
                                        radioList={IPayStateDataForRemit}
                                        />
                                </td>
                            </tr>;
                        }) }
                    </tbody>
                </table>
            );

        return out_html;
    }
}