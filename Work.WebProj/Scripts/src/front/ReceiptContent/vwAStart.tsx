import React = require('react');
import Moment = require('moment');
import {PWButton, TagShowAndHide} from '../../components';
import {config, UIText, IPackTypeData} from '../../ts-comm/def-data';
import {fmt_money} from '../../ts-comm/comm-func';

export class AStart extends React.Component<any, any>{

    constructor() {
        super();
        this.state = {
        };
    }
    getName(arr: Array<server.OptionTemplate>, val: number): string {
        let res: string = "";
        let item = arr.find(x => x.val === parseInt(val.toString()));
        res = (item != null && item != undefined) ? item.Lname : res;
        return res;
    }
    render() {
        let out_html: JSX.Element = null;
        let field: server.Purchase = this.props.field;

        out_html =
            (
                <div>
                    <header className="text-left underline">
                        <span className="font-xl text-danger">訂單編號：{field.purchase_no} </span>
                        如有訂單等問題，請來電洽詢 0979-777-270 或 03-4275832
                        <a href={gb_approot+"User/Receipt_list"} className="font-lg float-r">回列表</a>
                    </header>

                    <table className="payment-list">
                        <caption className="text-left p-a-8 bg-primary text-white">訂單明細</caption>
                        <thead>
                            <tr>
                                <th colSpan="2">商品</th>
                                <th>數量</th>
                                <th>單價</th>
                                <th className="text-left">小計</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                field.Deatil.map((item, i) => {
                                    return <tr key={i}>
                                        <td className="pic">
                                            <a href={this.state.Product + "/Detail?id=" + item.product_id + "#main"} className="text-success">
                                                <img src={item.img_src} alt={item.p_name} />
                                            </a>
                                        </td>
                                        <td className="text-left">
                                            產品編號: {item.p_d_sn}
                                            <h5>{item.p_name}</h5>
                                            規格型號: {this.getName(IPackTypeData, item.p_d_pack_type) }
                                        </td>
                                        <td>{fmt_money(item.qty) }</td>
                                        <td>NT$ {fmt_money(item.price) }</td>
                                        <td className="text-left">NT$ {fmt_money(item.sub_total) }</td>
                                    </tr>;
                                })
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="4" className="text-right">運費
                                    <TagShowAndHide TagName={TagName.Span} show={field.pay_type == IPayType.CashOnDelivery}>、手續費</TagShowAndHide>
                                </td>
                                <td className="text-left">NT$ {fmt_money(field.ship_fee + field.bank_charges) }</td>
                            </tr>
                            <tr>
                                <td colSpan="4" className="text-right">總計</td>
                                <td className="text-left text-danger">NT$ {fmt_money(field.total) }</td>
                            </tr>
                        </tfoot>
                    </table>

                    <table className="payment-list m-t-32">
                        <caption className="text-left p-a-8 bg-primary text-white">收件資訊</caption>
                        <tbody>
                            <tr>
                                <th>收件人</th>
                                <th>收件人電話</th>
                                <th>收件地址</th>
                                <th>出貨狀態</th>
                                <th className="text-left">付款明細</th>
                            </tr>
                            <tr>
                                <td>{field.receive_name}</td>
                                <td>{field.receive_tel}</td>
                                <td>{field.receive_zip + " " + field.receive_address}</td>
                                <td>出貨時間：{(field.ship_date != null && field.ship_date != undefined) ? Moment(field.ship_date).format(config.dateFT) : "" }</td>
                                <td className="text-left">
                                    <TagShowAndHide TagName={TagName.Span} show={field.pay_type == IPayType.Remit}>
                                    【轉帳匯款】日期：{(field.remit_date != null && field.remit_date != undefined) ? Moment(field.remit_date).format(config.dateFT) : "" } 帳號後5碼：{field.remit_no}
                                    </TagShowAndHide>                   
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );

        return out_html;
    }
}


