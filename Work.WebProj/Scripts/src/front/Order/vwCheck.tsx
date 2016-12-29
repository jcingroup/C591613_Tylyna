import $ = require('jquery');
import React = require('react');
import Moment = require('moment');
import {TagShowAndHide, InputNum, PWButton} from '../../components';
import {ac_type_comm} from '../../action_type';
import {UIText, config, IPayTypeData} from '../../ts-comm/def-data';
import {fmt_money, makeInputValue, htmlbr} from '../../ts-comm/comm-func';

interface CheckState {
    Account?: string,
    ReceiptList?: string,
    Product?: string,
    Order?: string
}

export class Check extends React.Component<any, CheckState>{

    constructor() {
        super();
        this.state = {
            Account: gb_approot + "User/Account",
            ReceiptList: gb_approot + "User/Receipt_list",
            Product: gb_approot + "Products",
            Order: gb_approot + "Order/Reply"
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
        let ship: Array<server.Shipment> = this.props.ship;
        out_html =
            (
                <section className="text-left">
                    <h4>
                        <i className="icon-checkmark font-xl text-success m-r-12"></i>
                        訂單成功送出，謝謝您的訂購！訂單資料可至
                        <a href={this.state.Account} className="text-success">會員資料</a> 的
                        <a href={this.state.ReceiptList} className="text-success">歷史訂單</a> 查詢
                    </h4>
                    <table className="payment-list">
                        <caption className="text-left p-b-8">訂單編碼: {field.purchase_no}</caption>
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
                                            <a href={this.state.Product + "/Detail" + item.product_id + "#main"} className="text-success">
                                                <img src={item.img_src} alt={item.p_name} />
                                            </a>
                                        </td>
                                        <td className="text-left">
                                            產品編號: {item.p_d_sn}
                                            <h5>{item.p_name}</h5>
                                            規格型號: {item.p_d_pack_name }
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

                    <ul className="payment-infor">
                        <li><small>收件人姓名</small>{field.receive_name}</li>
                        <li><small>聯絡電話</small>{field.receive_tel} <small className="m-l-24">手機</small>{field.receive_mobile}</li>
                        <li><small>收件地址</small>{field.receive_zip + field.receive_address}</li>
                        <li><small>付款方式</small> {this.getName(IPayTypeData, field.pay_type) }</li>
                        <li>
                            <small>備註</small>
                            <span dangerouslySetInnerHTML={{ __html: htmlbr(field.receive_memo) } }></span>
                        </li>
                    </ul>
                    <p className="icon-error">
                        請至您的 Email 收取訂單相關資料。若您採用轉帳匯款，請於 <strong className="text-danger">{config.remitLimitDay}</strong> 日內付款完成，並填寫
                        <a href={this.state.Order + "?no=" + field.purchase_no} className="btn btn-sm bg-danger m-x-4">已付款通知</a>
                        或來電告知帳號後五碼，貨品將於完成付款後<strong className="text-danger">{config.shipLimitDay}</strong>個工作天內送達。
                    </p>
                    <footer className="submit">
                        <a href={this.state.Product} className="float-r btn font-lg btn-success">繼續購物 <i className="icon-navigate_next"></i></a>
                    </footer>
                </section>
            );

        return out_html;
    }
}


