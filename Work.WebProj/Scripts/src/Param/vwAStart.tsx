import React = require('react');
import Moment = require('moment');
import {Init_Params, ajaxParams} from './pub';
import {ac_type_comm} from '../action_type';
import {HeadView} from '../ts-comm/vwHeadView';
import {InputText, InputNum, PWButton} from '../components';
import {config, UIText} from '../ts-comm/def-data';

export class AStart extends React.Component<any, any>{

    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {};
    }
    chgVal(name: string, value: any, e: React.SyntheticEvent) {
        this.props.setInputValue(ac_type_comm.chg_fld_val, name, value);
    }
    chgRowVal(i: number, name: string, value: any, e: React.SyntheticEvent) {
        this.props.setRowInputValue(ac_type_comm.chg_grid_val, i, name, value);
    }
    handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        let params: Init_Params = this.props.params;
        let ship: Array<server.Shipment> = this.props.grid;
        let md: ajaxParams = {
            AccountName: params.AccountName,
            AccountNumber: params.AccountNumber,
            BankCode: params.BankCode,
            BankName: params.BankName,
            Email: params.Email,
            ship: ship
        };

        this.props.callSubmit(md);
        return;
    }
    render() {
        let out_html: JSX.Element = null;
        let view_mode: InputViewMode = InputViewMode.edit;
        let params: Init_Params = this.props.params;
        let ship: Array<server.Shipment> = this.props.grid;

        out_html =
            (
                <div>
                    <HeadView />
                    <h3 className="h3">
                        {gb_caption}
                    </h3>
                    <form className="form form-sm" onSubmit={this.handleSubmit}>
                        <section className="col-xs-5 w3-card-2 p-a-0 m-b-2">
                            <header className="w3-padding-medium w3-padding-4 w3-blue">轉帳匯款資料設定</header>
                            <main className="w3-padding-medium m-t-1">
                                <dl className="form-group row">
                                    <dt className="col-xs-3 form-control-label text-xs-right">戶名</dt>
                                    <dd className="col-xs-9">
                                        <InputText
                                            type="text"
                                            inputClassName="form-control form-control-sm"
                                            inputViewMode={view_mode}
                                            value={params.AccountName}
                                            onChange= {this.chgVal.bind(this, 'AccountName') }
                                            required={true}
                                            maxLength={64}
                                            />
                                    </dd>
                                </dl>
                                <dl className="form-group row">
                                    <dt className="col-xs-3 form-control-label text-xs-right">銀行</dt>
                                    <dd className="col-xs-9">
                                        <InputText
                                            type="text"
                                            inputClassName="form-control form-control-sm"
                                            inputViewMode={view_mode}
                                            value={params.BankName}
                                            onChange= {this.chgVal.bind(this, 'BankName') }
                                            required={true}
                                            maxLength={64}
                                            />
                                    </dd>
                                </dl>
                                <dl className="form-group row">
                                    <dt className="col-xs-3 form-control-label text-xs-right">代碼</dt>
                                    <dd className="col-xs-9">
                                        <InputText
                                            type="text"
                                            inputClassName="form-control form-control-sm"
                                            inputViewMode={view_mode}
                                            value={params.BankCode}
                                            onChange= {this.chgVal.bind(this, 'BankCode') }
                                            required={true}
                                            maxLength={64}
                                            />
                                    </dd>
                                </dl>
                                <dl className="form-group row">
                                    <dt className="col-xs-3 form-control-label text-xs-right">帳號</dt>
                                    <dd className="col-xs-9">
                                        <InputText
                                            type="text"
                                            inputClassName="form-control form-control-sm"
                                            inputViewMode={view_mode}
                                            value={params.AccountNumber}
                                            onChange= {this.chgVal.bind(this, 'AccountNumber') }
                                            required={true}
                                            maxLength={64}
                                            />
                                    </dd>
                                </dl>
                                {
                                    ship.map((item, i) => {
                                        if (item.pay_type == IPayType.Remit) {
                                            return <dl key={i} className="form-group row">
                                                <dt className="col-xs-3 form-control-label text-xs-right">運費設定</dt>
                                                <dd className="col-xs-9 form-inline">
                                                    訂單金額少於 NT$ { }
                                                    <InputNum
                                                        inputClassName="form-control form-control-sm text-xs-center"
                                                        inputViewMode={view_mode}
                                                        style={{ "width": "80px" }}
                                                        required={true}
                                                        value={item.limit_money}
                                                        onChange= {this.chgRowVal.bind(this, i, 'limit_money') }
                                                        min={0}
                                                        />
                                                    ，須付運費 NT$ { }
                                                    <InputNum
                                                        inputClassName="form-control form-control-sm text-xs-center"
                                                        inputViewMode={view_mode}
                                                        style={{ "width": "80px" }}
                                                        required={true}
                                                        value={item.shipment_fee}
                                                        onChange= {this.chgRowVal.bind(this, i, 'shipment_fee') }
                                                        min={0}
                                                        />
                                                    元
                                                </dd>
                                                {/* 滿3000元打95折
                                                    <dt className="col-xs-3 form-control-label text-xs-right">折扣設定</dt>
                                                    <dd className="col-xs-9 form-inline">
                                                        訂單金額滿 NT$ <input type="number" className="form-control form-control-sm text-xs-center" style="width:80px">
                                                        ，總金額打 <input type="number" className="form-control form-control-sm text-xs-center" style="width:30px"> 折
                                                    </dd>
                                                */}
                                            </dl>;
                                        }
                                    })
                                }
                            </main>
                        </section>

                        <section className="col-xs-5 w3-card-2 p-a-0 w3-margin-left m-b-2">
                            <header className="w3-padding-medium w3-padding-4 w3-green">貨到付款資料設定</header>
                            <main className="w3-padding-medium m-t-1">
                                目前無貨到付款<br/>若要開啟請聯絡 傑興資訊 (03)4257-385
                                {/*
                                    ship.map((item, i) => {
                                        if (item.pay_type == IPayType.CashOnDelivery) {
                                            return <dl key={i} className="form-group row">
                                                <dt className="col-xs-3 form-control-label text-xs-right">運費設定</dt>
                                                <dd className="col-xs-9 form-inline">
                                                    訂單金額少於 NT$ { }
                                                    <InputNum
                                                        inputClassName="form-control form-control-sm text-xs-center"
                                                        inputViewMode={view_mode}
                                                        style={{ "width": "30%" }}
                                                        required={true}
                                                        value={item.limit_money}
                                                        onChange= {this.chgRowVal.bind(this, i, 'limit_money') }
                                                        min={0}
                                                        />
                                                    ，須付運費 NT$ { }
                                                    <InputNum
                                                        inputClassName="form-control form-control-sm text-xs-center"
                                                        inputViewMode={view_mode}
                                                        style={{ "width": "80px" }}
                                                        required={true}
                                                        value={item.shipment_fee}
                                                        onChange= {this.chgRowVal.bind(this, i, 'shipment_fee') }
                                                        min={0}
                                                        />
                                                    元
                                                </dd>
                                                <dt className="col-xs-3 form-control-label text-xs-right">加收手續費</dt>
                                                <dd className="col-xs-9 form-inline">
                                                    NT$ { }
                                                    <InputNum
                                                        inputClassName="form-control form-control-sm text-xs-center"
                                                        inputViewMode={view_mode}
                                                        style={{ "width": "80px" }}
                                                        required={true}
                                                        value={item.bank_charges}
                                                        onChange= {this.chgRowVal.bind(this, i, 'bank_charges') }
                                                        min={0}
                                                        />
                                                    元
                                                </dd>
                                            </dl>;
                                        }
                                    })
                                */}

                            </main>
                        </section>

                        <section className="col-xs-5 w3-card-2 p-a-0 w3-margin-left m-b-2">
                            <header className="w3-padding-medium w3-padding-4 w3-teal w3-text-white">收發Email</header>
                            <main className="w3-padding-medium m-t-1">
                                <dl className="w3-text-teal form-group row">
                                    <dd className="col-xs-12">
                                        多筆信箱請用「<strong>, </strong>」逗號分開。<br />ex.<strong>user1 @demo.com.tw, user2 @demo.com.tw</strong>
                                    </dd>
                                </dl>
                                <dl className="form-group row">
                                    <dt className="col-xs-2 form-control-label text-xs-right">Email</dt>
                                    <dd className="col-xs-9">
                                        <InputText
                                            type="text"
                                            inputClassName="form-control form-control-sm"
                                            inputViewMode={view_mode}
                                            value={params.Email}
                                            onChange= {this.chgVal.bind(this, 'Email') }
                                            required={true}
                                            maxLength={256}
                                            />
                                    </dd>
                                </dl>
                            </main>
                        </section>

                        <div className="form-action text-xs-center clear">
                            <PWButton iconClassName="fa-check" className="btn btn-primary btn-sm"
                                title={UIText.save} enable={true} type="submit" >{UIText.save}</PWButton> { }
                        </div>
                    </form>
                </div>
            );

        return out_html;
    }
}