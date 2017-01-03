import $ = require('jquery');
import React = require('react');
import Moment = require('moment');
import {config, UIText, IPayTypeData, IPayStateData, IShipStateData} from '../ts-comm/def-data';
import {PWButton, RadioBox} from '../components';
import { OrderButton } from '../ts-comm/OrderButton';
import {ac_type_comm} from '../action_type';
import {Init_Params, Search_Data} from './pub';


export class GridTable extends React.Component<any, any>{

    constructor() {
        super();
        this.setSort = this.setSort.bind(this);
        this.state = {
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
    deleteItem(id: number | string) {
        if (!confirm(UIText.delete_sure)) {
            return;
        }
        let params = this.props.search;
        params['page'] = this.props.page_operator.page;
        this.props.callDelete(id, params);
    }
    getName(arr: Array<server.OptionTemplate>, val: number): string {
        let res: string = "";
        let item = arr.find(x => x.val === parseInt(val.toString()));
        res = (item != null && item != undefined) ? item.Lname : res;
        return res;
    }
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;
        let grid: Array<server.Purchase> = pp.grid;

        out_html =
            (
                <table className="table table-sm table-bordered table-striped table-hover">
                    <colgroup>
                        <col style={{ "width": "4%" }} />
                        <col style={{ "width": "10%" }} />
                        <col style={{ "width": "30%" }} />
                        <col span="2" style={{ "width": "10%" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th className="text-xs-center">{UIText.view}</th>
                            <th>
                                <OrderButton
                                    title="訂單編號"
                                    field={"purchase_no"}
                                    sort={pp.page_operator.sort}
                                    now_field={pp.page_operator.field}
                                    setSort={this.setSort} />
                            </th>
                            <th>
                                產品料號/名稱
                            </th>
                            <th>
                                <OrderButton
                                    title="下單日期"
                                    field={"order_date"}
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
                            <th className="text-xs-center">
                                <OrderButton
                                    title="購買人"
                                    field={"receive_name"}
                                    sort={pp.page_operator.sort}
                                    now_field={pp.page_operator.field}
                                    setSort={this.setSort} />
                            </th>
                            <th>
                                <OrderButton
                                    title="付款方式"
                                    field={"pay_type"}
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
                            <th>
                                <OrderButton
                                    title="出貨狀態"
                                    field={"ship_state"}
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
                                        title={UIText.modify} enable={true} onClick={this.props.callUpdateItem.bind(this, item.purchase_no) } />
                                </td>
                                <td>{item.purchase_no}</td>
                                <td>
                                    {
                                        item.Deatil.map((detail, j) => {
                                            return <div key={j}>{detail.p_d_sn} {detail.p_name} {detail.p_d_pack_name } </div>;
                                        })
                                    }
                                </td>
                                <td className="text-xs-center">{Moment(item.order_date).format(config.dateFT) }</td>
                                <td className="text-xs-center">{(item.remit_date != null && item.remit_date != undefined) ? Moment(item.remit_date).format(config.dateFT) : "" }</td>
                                <td className="text-xs-center">{item.receive_name}</td>
                                <td className="text-xs-center">{this.getName(IPayTypeData, item.pay_type) }</td>
                                <td className="text-xs-center">
                                    <RadioBox
                                        inputViewMode={InputViewMode.view}
                                        name={"pay_state-" + i}
                                        id={"pay_state-" + i}
                                        value={item.pay_state}
                                        radioList={IPayStateData}
                                        />
                                </td>
                                <td className="text-xs-center">
                                    <RadioBox
                                        inputViewMode={InputViewMode.view}
                                        name={"ship_state-" + i}
                                        id={"ship_state-" + i}
                                        value={item.ship_state}
                                        radioList={IShipStateData}
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