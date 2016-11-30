import React = require('react');
import Moment = require('moment');
import {TagShowAndHide, InputNum, InputText, AreaText, PWButton} from '../../components';
import {ac_type_comm} from '../../action_type';
import { InputProps} from './pub';

export class List extends React.Component<any, any>{

    constructor() {
        super();
        this.state = {
        };
    }
    chgVal(name: string, value: any, e: React.SyntheticEvent) {
        this.props.setInputValue(ac_type_comm.chg_fld_val, name, value);
    }
    render() {
        let out_html: JSX.Element = null;
        let field: server.Purchase = this.props.field;

        out_html =
            (<table className="receipt-list full bg-white">
                <caption className="text-right p-b-12">
                    訂單狀態：
                    @* 點選後，下方清單會顯示那筆資料 * @
                    <select>
                        <option value="">全部</option>
                        <option value="">待付款</option>
                        <option value="">待出貨</option>
                        <option value="">已出貨</option>
                        <option value="">訂單已取消</option>
                        <option value="">完成訂單</option>
                    </select>
                </caption>
                <tr>
                    <th>訂購日期</th>
                    <th>訂單編號</th>
                    <th className="text-left">商品名稱</th>
                    <th>數量</th>
                    <th>訂單狀態</th>
                </tr>
                <tr>
                    <td>2016/10/13</td>
                    <td><a href="~/User/Receipt_content" className="text-success">P201610010001</a></td>
                    <td className="text-left">耶加雪菲-濾掛式(5入) </td>
                    <td>1</td>
                    <td>待付款</td>
                </tr>
                <tr>
                    <td>2016/10/13</td>
                    <td><a href="~/User/Receipt_content" className="text-success">P201610010001</a></td>
                    <td className="text-left">耶加雪菲-濾掛式(10入) </td>
                    <td>2</td>
                    <td>已出貨</td>
                </tr>
            </table>
            );

        return out_html;
    }
}


