import $ = require('jquery');
import React = require('react');
import Moment = require('moment');
import {config, UIText, IPayStateDataForRemit} from '../ts-comm/def-data';
import {PWButton, RadioBox} from '../components';
import { OrderButton } from '../ts-comm/OrderButton';
import {ac_type_comm} from '../action_type';
import {Search_Data} from './pub';
import {clone} from '../ts-comm/comm-func';


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
    chgCheck(e: React.SyntheticEvent) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let arr: Array<string> = clone(this.props.RemitCheck);

        if (input.checked) {
            arr.push(input.value);
        } else {
            let remove_index: number = arr.indexOf(input.value);
            arr.splice(remove_index, 1);
        }
        this.props.setRemitCheck(arr);
    }
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;
        let grid: Array<server.Purchase> = pp.grid;
        let RemitCheck: Array<String> = pp.RemitCheck;

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
                                    <label className="c-input c-checkbox">
                                        <input type="checkbox" value={item.purchase_no} onChange={this.chgCheck.bind(this) }
                                            checked={RemitCheck.indexOf(item.purchase_no) >= 0 }/>
                                        <span className="c-indicator"></span>
                                    </label>
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