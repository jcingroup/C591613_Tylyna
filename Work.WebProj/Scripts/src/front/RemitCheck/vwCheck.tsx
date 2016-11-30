import React = require('react');
import Moment = require('moment');
import {TagShowAndHide, InputNum, InputText, AreaText, PWButton} from '../../components';
import {ac_type_comm} from '../../action_type';
import { InputProps} from './pub';

import DatetimeInput = require("react-datetime");
import 'react-datetime/css/react-datetime.css';

export class Check extends React.Component<any, any>{

    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
        };
    }
    chgVal(name: string, value: any, e: React.SyntheticEvent) {
        this.props.setInputValue(ac_type_comm.chg_fld_val, name, value);
    }
    chgDate(name: string, MM: moment.Moment) {
        let value = (MM != null) ? MM.format() : null;

        this.props.setInputValue(ac_type_comm.chg_fld_val, name, value);
    }
    handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        let field: server.Purchase = this.props.field;

        this.props.callSumbit(field);
        return;
    }
    render() {
        let out_html: JSX.Element = null;
        let field: server.Purchase = this.props.field;
        let view_mode: InputViewMode = InputViewMode.edit;

        out_html =
            (<div>
                <header className="text-left font-xxl m-b-48 underline">
                    已付款通知
                    <small className="block">請填寫付款資料以利確認訂單，謝謝</small>
                </header>
                <form className="reply text-left" onSubmit={this.handleSubmit}>
                    <dl className="row row-p-a">
                        <dt className="col-2">* 訂單編號</dt>
                        <dd className="col-4">
                            <InputText
                                type="text"
                                inputClassName="form-element"
                                value={field.purchase_no}
                                inputViewMode={view_mode}
                                onChange={this.chgVal.bind(this, 'purchase_no') }
                                required={true}
                                maxLength={16}
                                placeholder="必填"
                                />
                        </dd>
                        <dt className="col-2">* 匯款帳號後5碼</dt>
                        <dd className="col-4">
                            <InputText
                                type="text"
                                inputClassName="form-element"
                                value={field.remit_no}
                                inputViewMode={view_mode}
                                onChange={this.chgVal.bind(this, 'remit_no') }
                                required={true}
                                maxLength={5}
                                patternString="^[0-9]*$"
                                patternInfo="限制輸入數字"
                                placeholder="必填"
                                />
                        </dd>
                    </dl>
                    <dl className="row row-p-a">
                        <dt className="col-2">* 匯款日期</dt>
                        <dd className="col-4">
                            <DatetimeInput
                                inputProps={InputProps}
                                locale={"zh-TW"}
                                onChange={this.chgDate.bind(this, 'remit_date') }
                                />
                        </dd>
                        <dt className="col-2">匯款金額</dt>
                        <dd className="col-4">
                            <InputNum
                                inputClassName="form-element"
                                inputViewMode={view_mode}
                                required={true}
                                value={field.remit_money}
                                onChange= {this.chgVal.bind(this, 'remit_money') }
                                min={0}
                                placeholder="必填..."
                                /> { }
                        </dd>
                    </dl>
                    <dl className="row row-p-a">
                        <dt className="col-2">備註</dt>
                        <dd className="col-10">
                            <AreaText
                                rows={3}
                                inputClassName="form-element"
                                value={field.remit_memo}
                                inputViewMode={InputViewMode.edit}
                                onChange={this.chgVal.bind(this, 'remit_memo') }
                                required={false}
                                maxLength={256}/>
                        </dd>
                    </dl>
                    <footer className="submit">
                        <PWButton className="float-r btn font-lg btn-success"
                            type="submit"
                            enable={true}>送出<i className="icon-navigate_next"></i></PWButton>
                    </footer>
                </form>
            </div>
            );

        return out_html;
    }
}


