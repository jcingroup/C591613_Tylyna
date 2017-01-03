import React = require('react');
import Moment = require('moment');
import {PWButton} from '../../components';
import {config, UIText, IPayTypeData, IPayStateData, IShipStateData} from '../../ts-comm/def-data';
import {fmt_money} from '../../ts-comm/comm-func';
import {ac_type_comm} from '../../action_type';
import { ReceiptList, Search_Data, IOrderStateData} from './pub';

export class AStart extends React.Component<any, any>{

    constructor() {
        super();
        this.state = {
        };
    }
    chgShVal(name: string, e: React.SyntheticEvent) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let value: any = input.value != null ? parseFloat(input.value) : null;
        let obj = IOrderStateData.find(x => x.id == value);
        this.props.setInputValue(ac_type_comm.chg_sch_val, name, value);
        this.props.setInputValue(ac_type_comm.chg_sch_val, "state", obj.state);
        this.props.setInputValue(ac_type_comm.chg_sch_val, "state_val", obj.state_val);

        let params = this.props.search;
        params["state"] = obj.state;
        params["state_val"] = obj.state_val;

        this.props.callGridLoad(params);
    }
    getName(arr: Array<server.OptionTemplate>, val: number): string {
        let res: string = "";
        let item = arr.find(x => x.val === parseInt(val.toString()));
        res = (item != null && item != undefined) ? item.Lname : res;
        return res;
    }
    goContent(no: string) {
        this.props.callItem(no);
    }
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;
        let search: Search_Data = pp.search;
        let grid: Array<ReceiptList> = this.props.grid;

        out_html =
            (<table className="full bg-white">
                <caption className="row row-x-0 p-b-8">
                    <h6 className="col-9 text-left m-t-8 m-b-0">轉帳匯帳請於 <strong className="text-danger">5</strong> 日內付款，完成匯款後才成立此筆訂單</h6>
                    <p className="col-3 text-right">
                        訂單狀態：
                        <select onChange={this.chgShVal.bind(this, 'id') }>
                            {
                                IOrderStateData.map((item, i) => {
                                    if (item.id == search.id) {
                                        return <option key={i} value={item.id} defaultValue={item.id}>{item.name}</option>
                                    } else {
                                        return <option key={i} value={item.id}>{item.name}</option>
                                    }
                                })
                            }
                        </select>
                    </p>
                </caption>
                <tbody>
                    <tr>
                        <th>訂購日期</th>
                        <th className="text-left">訂單編號</th>
                        <th className="text-left">商品名稱</th>
                        <th>數量</th>
                        <th>付款方式</th>
                        <th>付款狀態</th>
                        <th>出貨狀態</th>
                    </tr>
                    {
                        grid.map((item, i) => {
                            return <tr key={i}>
                                <td>{Moment(item.order_date).format(config.dateFT) }</td>
                                <td className="text-left">
                                    <a href={gb_approot+"User/Receipt_content?no="+item.purchase_no} className="text-success">{item.purchase_no}</a>
                                </td>
                                <td className="text-left">{item.p_name}-{item.p_d_pack_name } </td>
                                <td>{fmt_money(item.qty) }</td>
                                <td>{this.getName(IPayTypeData, item.pay_type) }</td>
                                <td>{this.getName(IPayStateData, item.pay_state) }</td>
                                <td>{this.getName(IShipStateData, item.ship_state) }</td>
                            </tr>;
                        })
                    }
                </tbody>
            </table>
            );

        return out_html;
    }
}


