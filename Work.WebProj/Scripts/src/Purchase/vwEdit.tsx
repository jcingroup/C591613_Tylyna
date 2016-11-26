﻿import $ = require('jquery');
import React = require('react');
import Moment = require('moment');
import {config, UIText, IPayTypeData, IPayStateData, IPackTypeData, IPayStateDataForRemit, IYesOrNoData} from '../ts-comm/def-data';
import {ac_type_comm} from '../action_type';
import {InputText, RadioBox, PWButton, TagShowAndHide} from '../components';
import {Init_Params} from './pub';
import {fmt_money, htmlbr, clone} from '../ts-comm/comm-func';


export class Edit extends React.Component<any, any>{

    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            Reply: gb_approot + 'Active/OrderData/Remit'
        };
    }
    keep_field: server.Purchase = {};
    chgVal(name: string, value: any, e: React.SyntheticEvent) {
        this.props.setInputValue(ac_type_comm.chg_fld_val, name, value);
    }
    getName(arr: Array<server.OptionTemplate>, val: number): string {
        let res: string = "";
        let item = arr.find(x => x.val === parseInt(val.toString()));
        res = (item != null && item != undefined) ? item.Lname : res;
        return res;
    }
    chgShipState(val: IShipState) {
        this.props.setInputValue(ac_type_comm.chg_fld_val, "ship_state", val);
    }
    chgCancel(name: string, value: any, e: React.SyntheticEvent) {
        if (!confirm("確定變更「取消訂單」?\n變更後狀態無法復原")) {
            return;
        }

        this.props.setInputValue(ac_type_comm.chg_fld_val, name, value);
        if (value == 1) {
            this.keep_field = clone(this.props.field);//變更前先clone
            this.props.setInputValue(ac_type_comm.chg_fld_val, "pay_state", IPayState.cancel_order);
            this.props.setInputValue(ac_type_comm.chg_fld_val, "ship_state", IPayState.cancel_order);
        } else if (value == 0) {
            this.props.setInputValue(ac_type_comm.chg_fld_val, "pay_state", this.keep_field.pay_state);
            this.props.setInputValue(ac_type_comm.chg_fld_val, "ship_state", this.keep_field.ship_state);
        }
    }
    handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        let field: server.Product = this.props.field;
        let pp = this.props;


        this.props.callSubmit(pp.params.no, field, pp.edit_type);
        return;
    }
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;
        let field: server.Purchase = pp.field;
        let view_mode: InputViewMode = InputViewMode.edit;

        out_html =
            (
                <form className="form form-sm" onSubmit={this.handleSubmit}>
                    <h3 className="h3">
                        {gb_caption}<small className="sub"><i className="fa-angle-double-right"></i> {UIText.edit}</small>
                    </h3>
                    <div className="alert alert-warning">
                        有變更<strong>取消訂單</strong>或<strong>出貨狀態</strong> 要按下下方的
                        <button type="button" className="btn btn-primary btn-sm">
                            <i className="fa-check"></i> {UIText.save}
                        </button>
                        按鈕後才算完成修改
                    </div>
                    <fieldset>
                        <legend className="h4">訂單明細資料</legend>
                        <section className="form-group row">
                            <label className="col-xs-1 form-control-label text-xs-right">
                                <span className="text-danger">*</span> 訂單編號
                            </label>
                            <div className="col-xs-4">{field.purchase_no}</div>
                            <label className="col-xs-2 form-control-label text-xs-right">
                                <span className="text-danger">*</span> 購買人
                            </label>
                            <div className="col-xs-4">{field.customer_name}</div>
                        </section>

                        <section className="form-group row">
                            <label className="col-xs-1 form-control-label text-xs-right">
                                <span className="text-danger">*</span> 總金額
                            </label>
                            <div className="col-xs-4">NT${fmt_money(field.total) }</div>
                            <label className="col-xs-2 form-control-label text-xs-right">
                                <span className="text-danger">*</span> 下單日期
                            </label>
                            <div className="col-xs-4">{Moment(field.order_date).format(config.dateFT) }</div>
                        </section>

                        <section className="form-group row">
                            <label className="col-xs-1 form-control-label text-xs-right">
                                <span className="text-danger">*</span> 付款方式
                            </label>
                            <div className="col-xs-4">
                                <RadioBox
                                    inputViewMode={InputViewMode.view}
                                    name={"pay_type"}
                                    id={"pay_type"}
                                    value={field.pay_type}
                                    radioList={IPayTypeData}
                                    />
                            </div>
                            <label className="col-xs-2 form-control-label text-xs-right">
                                <span className="text-danger">*</span> 出貨日期
                            </label>
                            <div className="col-xs-4">
                                {(field.ship_date != null && field.ship_date != undefined) ? Moment(field.ship_date).format(config.dateFT) : "" }
                            </div>
                        </section>

                        <section className="form-group row">
                            <label className="col-xs-1 form-control-label text-xs-right">
                                <span className="text-danger">*</span> 付款狀態
                            </label>
                            <div className="col-xs-4">
                                <RadioBox
                                    inputViewMode={InputViewMode.view}
                                    name={"pay_state"}
                                    id={"pay_state"}
                                    value={field.pay_state}
                                    radioList={IPayStateData}
                                    />
                            </div>
                            <label className="col-xs-2 form-control-label text-xs-right">
                                <span className="text-danger">*</span> 出貨狀態
                            </label>
                            <div className="col-xs-4">
                                <TagShowAndHide TagName={TagName.Span} show={field.ship_state >= 0}>
                                    <PWButton
                                        className={"btn btn-sm margin-4 " + (field.ship_state === IShipState.unshipped ? "btn-danger" : "") }
                                        title="待出貨"
                                        enable={true}
                                        onClick={this.chgShipState.bind(this, IShipState.unshipped) }
                                        >待出貨</PWButton> { }
                                    <PWButton
                                        className={"btn btn-sm margin-4 " + (field.ship_state === IShipState.shipped ? "btn-danger" : "") }
                                        title="已出貨"
                                        enable={true}
                                        onClick={this.chgShipState.bind(this, IShipState.shipped) }
                                        >已出貨</PWButton>
                                </TagShowAndHide>
                                <TagShowAndHide TagName={TagName.Span} show={field.ship_state === IShipState.cancel_order} className="w3-tag label-default w3-round">
                                    取消訂單
                                </TagShowAndHide>
                            </div>
                        </section>

                        <section className="form-group row">
                            <label className="col-xs-1 form-control-label text-xs-right">
                                <span className="text-danger">*</span> 取消訂單
                            </label>
                            <div className="col-xs-4 form-inline">
                                <RadioBox
                                    inputViewMode={field.cancel_order == true ? InputViewMode.view : InputViewMode.edit}
                                    name={"cancel_order"}
                                    id={"cancel_order"}
                                    value={field.cancel_order}
                                    onChange= {this.chgCancel.bind(this, 'cancel_order') }
                                    required={true}
                                    labelClassName="c-input c-radio"
                                    spanClassName="c-indicator"
                                    textClassName="text-sm"
                                    radioList={IYesOrNoData}
                                    /> { }
                                <InputText
                                    type="text"
                                    inputClassName="form-control"
                                    inputViewMode={view_mode}
                                    value={field.cancel_reason}
                                    onChange= {this.chgVal.bind(this, 'cancel_reason') }
                                    required={field.cancel_order == true}
                                    disabled={field.cancel_order == false}
                                    maxLength={64}
                                    placeholder="若取消請輸入原因..."
                                    />
                            </div>
                        </section>
                    </fieldset>
                    <fieldset className="m-t-2">
                        <legend className="h4">收件資料明細</legend>
                        <dl className="form-group row">
                            <dt className="col-xs-1 text-xs-right">收件人</dt>
                            <dd className="col-xs-2">{field.receive_name}</dd>
                            <dt className="col-xs-1 text-xs-right">電話</dt>
                            <dd className="col-xs-2">{field.receive_tel}</dd>
                            <dt className="col-xs-1 text-xs-right">手機</dt>
                            <dd className="col-xs-2">{field.receive_mobile}</dd>
                        </dl>
                        <dl className="form-group row">
                            <dt className="col-xs-1 text-xs-right">地址</dt>
                            <dd className="col-xs-9">{field.receive_zip}-{field.receive_address}</dd>
                        </dl>
                        <dl className="form-group row">
                            <dt className="col-xs-1 text-xs-right">備註</dt>
                            <dd className="col-xs-9">
                                <div dangerouslySetInnerHTML={{ __html: htmlbr(field.receive_memo) } }></div>
                            </dd>
                        </dl>
                    </fieldset>
                    {/* 付款方式 為轉帳匯款才顯示 */}
                    <TagShowAndHide TagName={TagName.table} show={field.pay_type == IPayType.Remit} className="table table-sm table-bordered m-t-2">
                        <caption className="table-header w3-large">
                            <TagShowAndHide TagName={TagName.Span} show={field.pay_state > 0}>
                                已付款通知 <a href={this.state.Reply} className="btn btn-sm btn-success pull-xs-right"><i className="fa-check"></i> 確認款項</a>
                            </TagShowAndHide>
                            <TagShowAndHide TagName={TagName.Span} show={field.pay_state == IPayState.unpaid}>
                                尚無付款通知
                            </TagShowAndHide>
                        </caption>
                        {/* 付款狀態 為 已付款待確認:1、已付款:2 才顯示*/}
                        <TagShowAndHide TagName={TagName.Thead} show={field.pay_state > 0}>
                            <tr>
                                <th className="text-xs-center">核對帳款</th>
                                <th className="text-xs-center">匯款帳號後5碼</th>
                                <th className="text-xs-center">匯款時間</th>
                                <th className="text-xs-center">匯款金額</th>
                            </tr>
                        </TagShowAndHide>
                        <TagShowAndHide TagName={TagName.Tr} show={field.pay_state > 0}>
                            <td rowSpan="2" className="text-xs-center">
                                <RadioBox
                                    inputViewMode={InputViewMode.view}
                                    name={"pay_state-R"}
                                    id={"pay_state-R"}
                                    value={field.pay_state}
                                    radioList={IPayStateDataForRemit}
                                    />
                            </td>
                            <td>{field.remit_no}</td>
                            <td>{Moment(field.remit_date).format(config.dateTime) }</td>
                            <td>{fmt_money(field.remit_money) }</td>
                        </TagShowAndHide>
                        <TagShowAndHide TagName={TagName.Tr} show={field.pay_state > 0}>
                            <td colSpan="3">
                                備註：<div dangerouslySetInnerHTML={{ __html: htmlbr(field.remit_memo) } }></div>
                            </td>
                        </TagShowAndHide>
                    </TagShowAndHide>

                    <table className="table table-sm table-bordered table-striped table-hover m-t-2">
                        <caption className="table-header w3-large">訂購商品明細</caption>
                        <thead>
                            <tr>
                                <th className="text-xs-center">項次</th>
                                <th className="text-xs-center">料號</th>
                                <th className="text-xs-center">品名</th>
                                <th className="text-xs-center">單價</th>
                                <th className="text-xs-center">數量</th>
                                <th className="text-xs-center">小計</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                field.Deatil.map((item, i) => {
                                    return <tr key={i}>
                                        <td className="text-xs-center">{i + 1}</td>
                                        <td>{item.p_d_sn}</td>
                                        <td className="text-xs-left">
                                            {item.p_name} {this.getName(IPackTypeData, item.p_d_pack_type) }
                                        </td>
                                        <td className="text-xs-center">{fmt_money(item.price) }</td>
                                        <td className="text-xs-center">{item.qty}</td>
                                        <td className="text-xs-center">{fmt_money(item.sub_total) }</td>
                                    </tr>;
                                })
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="6" className="text-xs-right">
                                    運費+手續費: {fmt_money(field.ship_fee + field.bank_charges) }<br />
                                    總計: {fmt_money(field.total) }
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="form-action">
                        <PWButton iconClassName="fa-check" className="btn btn-primary btn-sm col-xs-offset-1"
                            title={UIText.save} enable={true} type="submit" >{UIText.save}</PWButton> { }
                        <PWButton iconClassName="fa-times" className="btn btn-secondary btn-sm"
                            title={UIText.save} enable={true} onClick={this.props.callGridLoad.bind(this, null) } >{UIText.return}</PWButton>
                    </div>

                </form>
            );

        return out_html;
    }
}