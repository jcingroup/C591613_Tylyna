import $ = require('jquery');
import React = require('react');
import Moment = require('moment');
import {config, UIText, IPackTypeData} from '../ts-comm/def-data';
import {PWButton, RadioBox} from '../components';
import { OrderButton } from '../ts-comm/OrderButton';
import {ac_type_comm} from '../action_type';
import {Search_Data, ShipData} from './pub';
import {clone, fmt_money} from '../ts-comm/comm-func';


export class GridTable extends React.Component<any, any>{

    constructor() {
        super();
        this.setSort = this.setSort.bind(this);
        this.state = {
            Order: gb_approot + 'Active/OrderData/Main'
        };
    }
    setSort(i: number, field, sort) {
        let grid: Array<ShipData> = this.props.grid;
        var parms = {
            sort: sort,
            field: field,
            p_name: grid[i].p_name
        };
        $.extend(parms, this.props.search);

        this.props.callDetailLoad(i, parms);
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
        let grid: Array<ShipData> = pp.grid;

        out_html =
            (
                <div>
                    {
                        grid.map((item, i) => {
                            return <table key={i} className="table table-sm table-bordered table-striped table-hover m-b-1">
                                <caption className="w3-blue w3-padding">品名：{item.p_name}</caption>
                                <colgroup>
                                    <col style={{ "width": "20%" }} />
                                    <col style={{ "width": "23%" }} />
                                    <col span="2" style={{ "width": "13%" }} />
                                    <col style={{ "width": "16%" }} />
                                    <col style={{ "width": "15%" }} />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>
                                            <OrderButton
                                                title="訂單編號"
                                                field={'purchase_no'}
                                                sort={item.sort}
                                                now_field={item.field}
                                                setSort={this.setSort.bind(this, i) } />
                                        </th>
                                        <th>
                                            <OrderButton
                                                title="產品包裝"
                                                field={'p_d_pack_type'}
                                                sort={item.sort}
                                                now_field={item.field}
                                                setSort={this.setSort.bind(this, i) } />
                                        </th>
                                        <th className="text-xs-center">
                                            <OrderButton
                                                title="下單日期"
                                                field={'order_date'}
                                                sort={item.sort}
                                                now_field={item.field}
                                                setSort={this.setSort.bind(this, i) } />
                                        </th>
                                        <th className="text-xs-center">
                                            <OrderButton
                                                title="購買人"
                                                field={'receive_name'}
                                                sort={item.sort}
                                                now_field={item.field}
                                                setSort={this.setSort.bind(this, i) } />
                                        </th>
                                        <th className="text-xs-center">
                                            <OrderButton
                                                title="重量(g)"
                                                field={'weight'}
                                                sort={item.sort}
                                                now_field={item.field}
                                                setSort={this.setSort.bind(this, i) } />
                                        </th>
                                        <th className="text-xs-center">
                                            <OrderButton
                                                title="數量"
                                                field={'qty'}
                                                sort={item.sort}
                                                now_field={item.field}
                                                setSort={this.setSort.bind(this, i) } />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        item.Detail.map((detail, j) => {
                                            return <tr key={i + "-" + j}>
                                                <td><a href={this.state.Order + "?no=" + detail.purchase_no}>{detail.purchase_no}</a></td>
                                                <td>{this.getName(IPackTypeData, detail.p_d_pack_type) }</td>
                                                <td className="text-xs-center">{Moment(detail.order_date).format(config.dateFT) }</td>
                                                <td className="text-xs-center">{detail.customer_name}</td>
                                                <td className="text-xs-right">{fmt_money(detail.weight) }</td>
                                                <td className="text-xs-center">{fmt_money(detail.qty) }</td>
                                            </tr>;
                                        })
                                    }
                                </tbody>
                                <tfoot className="w3-pale-yellow">
                                    <tr>
                                        <td colSpan="4" className="text-xs-right">未出貨總計(g) </td>
                                        <td colSpan="2" className="text-xs-center">{fmt_money(item.Detail.sum(x => x.weight * x.qty)) }</td>
                                    </tr>
                                </tfoot>
                            </table>;

                        })
                    }
                </div>
            );

        return out_html;
    }
}