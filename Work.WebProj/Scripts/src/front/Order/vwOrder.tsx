import $ = require('jquery');
import React = require('react');
import Moment = require('moment');
import {TagShowAndHide, InputText, AreaText, PWButton} from '../../components';
import {ac_type_comm} from '../../action_type';
import {UIText, IPackTypeData} from '../../ts-comm/def-data';
import {fmt_money, makeInputValue} from '../../ts-comm/comm-func';

export class Order extends React.Component<any, any>{

    constructor() {
        super();
        this.showLogin = this.showLogin.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
        };
    }
    chgVal(name: string, value: any, e: React.SyntheticEvent) {
        this.props.setInputValue(ac_type_comm.chg_fld_val, name, value);
    }
    chgPayType(name: string, e: React.SyntheticEvent) {//付款方式切換
        let field: server.Purchase = this.props.field;
        let ship: Array<server.Shipment> = this.props.ship;
        let sub_total: number = field.Deatil.sum(x => x.sub_total);//產品小計
        let ship_fee: number = 0, bank_charges: number = 0;//運費、手續費

        let value = makeInputValue(e);

        let tmp = ship.filter(x => x.pay_type == value && x.limit_money > sub_total);
        ship_fee = tmp.length > 0 ? tmp[0].shipment_fee : ship_fee;
        bank_charges = tmp.length > 0 ? tmp[0].bank_charges : bank_charges;

        this.props.setInputValue(ac_type_comm.chg_fld_val, name, value);
        this.props.setInputValue(ac_type_comm.chg_fld_val, "ship_fee", ship_fee);
        this.props.setInputValue(ac_type_comm.chg_fld_val, "bank_charges", bank_charges);
        this.props.setInputValue(ac_type_comm.chg_fld_val, "total", sub_total + ship_fee + bank_charges);
    }
    getPackName(val: number): string {
        let res: string = "";
        let item = IPackTypeData.find(x => x.val === val);
        res = (item != null && item != undefined) ? item.Lname : res;
        return res;
    }
    showLogin() {
        $("#login").css('display', 'block');
        //按下登入會員按鈕時,頁簽一定要再第一個
        let tabContent = '.tab-content';
        $("#MLogin").fadeIn().siblings(tabContent).hide();
    }
    handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        let field: server.Purchase = this.props.field;
        if (field.pay_type != IPayType.Remit && field.pay_type != IPayType.CashOnDelivery) {
            alert("請選擇「付款方式」！");
            return;
        }
        this.props.callSumbit(field);
        return;
    }
    render() {
        let out_html: JSX.Element = null;
        let field: server.Purchase = this.props.field;
        let ship: Array<server.Shipment> = this.props.ship;
        out_html =
            (<form onSubmit={this.handleSubmit}>
                <section className="m-b-32 text-left">
                    <h2 className="payment-title"><em>1</em>確定訂單明細</h2>
                    <table className="payment-list">
                        <thead>
                            <tr>
                                <th></th>
                                <th className="text-left">商品明細</th>
                                <th className="text-right">單價</th>
                                <th>數量</th>
                                <th className="text-right">小計</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                field.Deatil.map((item, i) => {
                                    let p_url: string = gb_approot + "Products/Detail?id=" + item.product_id + "#main";
                                    return <tr key={i}>
                                        <td className="pic">
                                            <a href={p_url} className="text-success">
                                                <img src={item.img_src} alt={item.p_name} />
                                            </a>
                                        </td>
                                        <td className="text-left">
                                            產品編號: {item.p_d_sn}
                                            <h5>{item.p_name}</h5>
                                            規格型號: {item.p_d_pack_name } <a href={p_url} className="text-success m-l-16">查看產品介紹</a>
                                        </td>
                                        <td className="text-right">NT$ {fmt_money(item.price) }</td>
                                        <td>{fmt_money(item.qty) }</td>
                                        <td className="text-right">NT$ {fmt_money(item.sub_total) }</td>
                                    </tr>;
                                })
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" className="text-left">
                                    <span className="radio-group">
                                        <input type="radio" name="pay" id="pay1"
                                            checked={field.pay_type == IPayType.Remit}
                                            value={IPayType.Remit} onChange={this.chgPayType.bind(this, 'pay_type') } />
                                        <label htmlFor="pay1" className="icon"></label>轉帳匯款
                                        {
                                            ship.filter(x => x.pay_type == IPayType.Remit).map((item, i) => {
                                                return <span key={i}>(未滿NT${fmt_money(item.limit_money) } 運費NT${fmt_money(item.shipment_fee) }) </span>;
                                            })
                                        }
                                    </span>
                                    {/*<span className="radio-group">
                                        <input type="radio" name="pay" id="pay2"
                                            checked={field.pay_type == IPayType.CashOnDelivery}
                                            value={IPayType.CashOnDelivery} onChange={this.chgPayType.bind(this, 'pay_type') } />
                                        <label htmlFor="pay2" className="icon"></label>貨到付款
                                        {//運費限制設為list怕之後要調整
                                            ship.filter(x => x.pay_type == IPayType.CashOnDelivery).map((item, i) => {
                                                return <span key={i}>(未滿NT${fmt_money(item.limit_money) } 運費NT${fmt_money(item.shipment_fee) } 手續費NT${fmt_money(item.bank_charges) }) </span>;
                                            })
                                        }
                                    </span>*/}
                                </td>
                                <td className="text-right">運費
                                    <TagShowAndHide TagName={TagName.Span} show={field.pay_type == IPayType.CashOnDelivery}>、手續費</TagShowAndHide>
                                </td>
                                <td className="text-right">NT$ {fmt_money(field.ship_fee + field.bank_charges) }</td>
                            </tr>
                            <tr>
                                <td colSpan="4" className="text-right">總計</td>
                                <td className="text-right text-danger">NT$ {fmt_money(field.total) }</td>
                            </tr>
                        </tfoot>
                    </table>
                </section>
                <section className="m-b-32 text-left">
                    <h2 className="payment-title"><em>2</em>填寫購買資訊</h2>
                    <div className="payment-data">
                        <dl className="row row-p-a">
                            <dt className="col-2">* E-mail</dt>
                            <dd className="col-10">
                                <InputText
                                    type="email"
                                    inputClassName="form-element"
                                    value={field.receive_email}
                                    inputViewMode={InputViewMode.edit}
                                    onChange={this.chgVal.bind(this, 'receive_email') }
                                    required={true}
                                    maxLength={128}
                                    patternString="[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}[.]{1}[a-zA-Z]{2,}(?:[.]{1}[a-zA-Z]{2,}|)$"
                                    patternInfo="Email格式錯誤,請修正!\n帳號長度至上3個字元以上\n「@」符號後面須為一個網域名稱"
                                    placeholder="請填寫常用的電子信箱，未來將以此做為預設登入帳號"
                                    />
                                <TagShowAndHide show={field.customer_id == 0} TagName={TagName.Span}>{/* 有登入就不用出現 */}
                                    初此購物免註冊，購買完成將自動升為會員，若已有會員請先
                                    <PWButton className="btn-link text-success" enable={true} onClick={this.showLogin}>會員登入</PWButton>
                                </TagShowAndHide>

                            </dd>
                        </dl>
                        <dl className="row row-p-a">
                            <dt className="col-2">* 收件人姓名</dt>
                            <dd className="col-10">
                                <InputText
                                    type="text"
                                    inputClassName="form-element"
                                    value={field.receive_name}
                                    inputViewMode={InputViewMode.edit}
                                    onChange={this.chgVal.bind(this, 'receive_name') }
                                    required={true}
                                    maxLength={64}
                                    placeholder="預設為會員名稱"
                                    />
                            </dd>
                        </dl>
                        <dl className="row row-p-a">
                            <dt className="col-2">* 手機</dt>
                            <dd className="col-4">
                                <InputText
                                    type="tel"
                                    inputClassName="form-element"
                                    value={field.receive_mobile}
                                    inputViewMode={InputViewMode.edit}
                                    onChange={this.chgVal.bind(this, 'receive_mobile') }
                                    required={true}
                                    maxLength={32}
                                    />
                            </dd>
                            <dt className="col-2">聯絡電話</dt>
                            <dd className="col-4">
                                <InputText
                                    type="tel"
                                    inputClassName="form-element"
                                    value={field.receive_tel}
                                    inputViewMode={InputViewMode.edit}
                                    onChange={this.chgVal.bind(this, 'receive_tel') }
                                    required={false}
                                    maxLength={32}
                                    />
                            </dd>
                        </dl>
                        <dl className="row row-p-a">
                            <dt className="col-2">* 收件地址</dt>
                            <dd className="col-2">
                                <InputText
                                    type="text"
                                    inputClassName="form-element"
                                    value={field.receive_zip}
                                    inputViewMode={InputViewMode.edit}
                                    onChange={this.chgVal.bind(this, 'receive_zip') }
                                    required={true}
                                    patternString="^[0-9]*$"
                                    maxLength={5}
                                    placeholder="請輸入郵遞區號"
                                    />
                            </dd>
                            <dd className="col-8">
                                <InputText
                                    type="text"
                                    inputClassName="form-element"
                                    value={field.receive_address}
                                    inputViewMode={InputViewMode.edit}
                                    onChange={this.chgVal.bind(this, 'receive_address') }
                                    required={true}
                                    maxLength={256}
                                    />
                            </dd>
                        </dl>
                        <dl className="row row-p-a">
                            <dt className="col-2">備註</dt>
                            <dd className="col-10">
                                <AreaText
                                    rows={3}
                                    inputClassName="form-element"
                                    value={field.receive_memo}
                                    inputViewMode={InputViewMode.edit}
                                    onChange={this.chgVal.bind(this, 'receive_memo') }
                                    required={false}
                                    maxLength={256}/>
                            </dd>
                        </dl>
                        <p className="icon-error">
                            請至您的 Email 收取訂單相關資料。若您採用轉帳匯款，請於 <strong className="text-danger">5</strong> 日內付款完成，並填寫 <u>已付款通知</u> 或來電告知帳號後五碼，完成訂購。
                        </p>
                        <footer className="submit">
                            <a href={gb_approot + "Order/Cart"} className="float-l icon-navigate_before">繼續選購</a>

                            <PWButton
                                className="float-r btn font-lg btn-success"
                                type="submit"
                                enable={true}>填寫完成，送出訂單 <i className="icon-navigate_next"></i></PWButton>
                        </footer>
                    </div>
                </section>
            </form>
            );

        return out_html;
    }
}


