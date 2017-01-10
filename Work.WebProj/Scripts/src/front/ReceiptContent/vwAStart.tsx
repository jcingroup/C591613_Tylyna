import React = require('react');
import Moment = require('moment');
import {PWButton, TagShowAndHide} from '../../components';
import {config, UIText} from '../../ts-comm/def-data';
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
                        如有訂單等問題，請來電洽詢 0979-777-270 或 03-4275832<br/>
                        轉帳匯帳請於 <strong className="text-danger">5</strong> 日內付款，完成匯款後才成立此筆訂單
                        <a href={gb_approot + "User/Receipt_list"} className="font-lg float-r">回列表</a>
                    </header>

                    <table className="payment-list">
                        <caption className="text-left p-a-8 bg-primary font-xl text-white">訂單編號：{field.purchase_no}</caption>
                        <thead>
                            <tr>
                                <th></th>
                                <th className="text-left">商品明細</th>
                                <th className="text-right">單價</th>
                                <th>數量</th>
                                <th className="text-right p-r-32" style={{ width: '135px' }}>小計</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                field.Deatil.map((item, i) => {
                                    return <tr key={i}>
                                        <td className="pic">
                                            <a href={gb_approot + "Products/Detail?id=" + item.product_id + "#main"} className="text-success">
                                                <img src={item.img_src} alt={item.p_name} />
                                            </a>
                                        </td>
                                        <td className="text-left">
                                            產品編號: {item.p_d_sn}
                                            <h5>{item.p_name}</h5>
                                            規格型號: {item.p_d_pack_name }
                                        </td>
                                        <td className="text-right"><small>NT$</small> {fmt_money(item.price) }</td>
                                        <td>{fmt_money(item.qty) }</td>
                                        <td className="text-right p-r-32"><small>NT$</small> {fmt_money(item.sub_total) }</td>
                                    </tr>;
                                })
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="4" className="text-right">運費
                                    {/*<TagShowAndHide TagName={TagName.Span} show={field.pay_type == IPayType.CashOnDelivery}>、手續費</TagShowAndHide>*/}
                                </td>
                                {/*<td className="text-left"><small>NT$</small> {fmt_money(field.ship_fee + field.bank_charges) }</td>*/}
                                <td className="text-right p-r-32"><small>NT$</small> {fmt_money(field.ship_fee) }</td>
                            </tr>
                            <TagShowAndHide TagName={TagName.Tr} show={field.pay_type == IPayType.CashOnDelivery}>
                                <td colSpan={4} className="text-right">手續費</td>
                                <td className="text-right p-r-32"><small>NT$</small> {fmt_money(field.bank_charges) }</td>
                            </TagShowAndHide>
                            <TagShowAndHide TagName={TagName.Tr} show={field.discount != 0 && field.discount != undefined && field.discount != null}>
                                <td colSpan={4} className="text-right">{field.discount_memo}</td>
                                <td className="text-right p-r-32"><small>NT$</small> {fmt_money(field.discount) }</td>
                            </TagShowAndHide>
                            <tr>
                                <td colSpan="4" className="text-right">總計</td>
                                <td className="text-right text-danger p-r-32"><small>NT$</small> {fmt_money(field.total) }</td>
                            </tr>
                        </tfoot>
                    </table>

                    <table className="payment-list m-t-32">
                        <caption className="text-left p-a-8 bg-primary text-white">收件資訊</caption>
                        <tbody>
                            <tr>
                                <th>收件人</th>
                                <th className="text-left">收件人電話</th>
                                <th className="text-left">收件地址</th>
                                <th className="text-left">出貨狀態</th>
                                <th className="text-left">付款明細</th>
                            </tr>
                            <tr>
                                <td>{field.receive_name}</td>
                                <td className="text-left">{field.receive_tel}</td>
                                <td className="text-left">{field.receive_zip + " " + field.receive_address}</td>
                                <td className="text-left">
                                    {(field.ship_date != null && field.ship_date != undefined) ? "出貨時間：" + Moment(field.ship_date).format(config.dateFT) : "尚未出貨" }
                                </td>
                                <td className="text-left">
                                    <TagShowAndHide TagName={TagName.Span} show={field.pay_type == IPayType.Remit && !(field.remit_date != null && field.remit_date != undefined) }>
                                        【待付款】，若付款完成請填寫 <a href={gb_approot + "Order/Reply?no=" + field.purchase_no} className="btn btn-sm bg-danger">已付款通知</a> 或來電告知帳號後五碼
                                    </TagShowAndHide>
                                    <TagShowAndHide TagName={TagName.Span} show={field.pay_type == IPayType.Remit && (field.remit_date != null && field.remit_date != undefined) }>
                                        【轉帳匯款】日期：{Moment(field.remit_date).format(config.dateFT) } 帳號後5碼：{field.remit_no}
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


