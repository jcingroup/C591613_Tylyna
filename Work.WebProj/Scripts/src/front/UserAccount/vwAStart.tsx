import $ = require('jquery');
import React = require('react');
import Moment = require('moment');
import update = require('react-addons-update');
import {TagShowAndHide, InputText, PWButton} from '../../components';
import {ac_type_comm, customer_type} from '../../action_type';
import {fmt_money, makeInputValue, clone} from '../../ts-comm/comm-func';
import {config, UIText} from '../../ts-comm/def-data';
import {IGenderData, InputProps, PadParm} from './pub';

import DatetimeInput = require("react-datetime");
import 'react-datetime/css/react-datetime.css';


let EditButton = ({view_mode, other, keyname, name, update, cancel}) => {
    if (view_mode === InputViewMode.view) {
        return (
            <span>
                <PWButton className="btn font-sm bg-danger m-l-16" enable={other != InputViewMode.edit} onClick={update}>{name}</PWButton>
            </span>
        );
    } else {
        return (
            <span>
                <PWButton className="btn font-sm bg-danger m-l-16" enable={true} hidden={true}>確定變更</PWButton>
                <PWButton className="btn font-sm bg-danger m-l-16" enable={true} name={keyname} type="submit">確定變更</PWButton>
                <PWButton className="btn font-sm bg-muted m-l-16" enable={true} onClick={cancel}>取消</PWButton>
            </span>
        );
    }
}
export class AStart extends React.Component<any, { pram?: PadParm }>{

    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAccountSubmit = this.handleAccountSubmit.bind(this);
        this.state = {
            pram: { OldPassword: null, NewPassword: null, ConfirmPassword: null }
        };
    }
    keep_email: string = "";
    chgVal(name: string, value: any, e: React.SyntheticEvent) {
        this.props.setInputValue(ac_type_comm.chg_fld_val, name, value);
    }
    chgDate(name: string, MM: moment.Moment) {
        let value = (MM != null) ? MM.format(config.dateFT) : null;

        this.props.setInputValue(ac_type_comm.chg_fld_val, name, value);
    }
    chgGender(name: string, e: React.SyntheticEvent) {//付款方式切換
        let value = makeInputValue(e);
        this.props.setInputValue(ac_type_comm.chg_fld_val, name, value);
    }
    handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        let field: server.Customer = this.props.field;
        this.props.callSumbit(field);
        return;
    }
    //email&pw
    updateEmail() {
        this.keep_email = clone(this.props.field.email);
        this.props.chgViewMode(customer_type.email_update);
    }
    cancelEmail() {
        this.props.setInputValue(ac_type_comm.chg_fld_val, "email", this.keep_email);
        this.props.chgViewMode(customer_type.email_cancel);
    }
    updatePW() {
        let p: PadParm = { OldPassword: null, NewPassword: null, ConfirmPassword: null };
        this.setState({ pram: p });
        this.props.chgViewMode(customer_type.pw_update);
    }
    cancelPW() {
        this.props.chgViewMode(customer_type.pw_cancel);
    }
    chgPW(name: string, value: any, e: React.SyntheticEvent) {
        var objForUpdate = {
            pram: { [name]: { $set: value } }
        };
        var newState = update(this.state, objForUpdate);
        this.setState(newState);
    }
    handleAccountSubmit(e: React.FormEvent) {
        e.preventDefault();
        var $btn = $(document.activeElement);
        let key: string = $btn.attr("name");
        if (key == "email") {
            this.props.callChgEmail(this.props.field.email);
        } else if (key == "pw") {
            this.props.callChgPW(this.state.pram);
        }
        return;
    }
    //email&pw
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;
        let field: server.Customer = pp.field;
        let pram = this.state.pram;
        let view_mode: InputViewMode = InputViewMode.edit;

        out_html = (
            <div className="account-data">
                <form id="MainSet" onSubmit={this.handleAccountSubmit}>
                    <fieldset className="m-b-48">
                        <legend>登入設定</legend>
                        <table className="full">
                            <tbody>
                                <tr>
                                    <td className="item">帳號(E-mail) </td>
                                    <td>
                                        <InputText
                                            type="email"
                                            value={field.email}
                                            inputViewMode={pp.email_view_mode}
                                            onChange={this.chgVal.bind(this, 'email') }
                                            required={true}
                                            maxLength={128}
                                            patternString="[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})"
                                            patternInfo="Email格式錯誤,請修正!\n帳號長度至上3個字元以上\n「@」符號後面須為一個網域名稱"
                                            placeholder="請填寫常用的電子信箱，未來將以此做為預設登入帳號"
                                            />
                                        <EditButton
                                            view_mode={pp.email_view_mode}
                                            other={pp.pw_view_mode}
                                            keyname="email"
                                            name="變更信箱"
                                            update={this.updateEmail.bind(this) }
                                            cancel={this.cancelEmail.bind(this) }/>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="item">密碼</td>
                                    <td>
                                        <TagShowAndHide TagName={TagName.Span} show={pp.pw_view_mode == InputViewMode.edit}>
                                            <InputText
                                                type="password"
                                                value={pram.OldPassword}
                                                inputViewMode={pp.pw_view_mode}
                                                onChange={this.chgPW.bind(this, 'OldPassword') }
                                                required={true}
                                                maxLength={16}
                                                patternString="^.{6,16}$"
                                                patternInfo="密碼長度至少六位以上"
                                                placeholder="請輸入舊密碼"
                                                /> { }
                                            <InputText
                                                type="password"
                                                value={pram.NewPassword}
                                                inputViewMode={pp.pw_view_mode}
                                                onChange={this.chgPW.bind(this, 'NewPassword') }
                                                required={true}
                                                maxLength={16}
                                                patternString="^.{6,16}$"
                                                patternInfo="密碼長度至少六位以上"
                                                placeholder="請輸入新密碼"
                                                /> { }
                                            <InputText
                                                type="password"
                                                value={pram.ConfirmPassword}
                                                inputViewMode={pp.pw_view_mode}
                                                onChange={this.chgPW.bind(this, 'ConfirmPassword') }
                                                required={true}
                                                maxLength={16}
                                                patternString="^.{6,16}$"
                                                patternInfo="密碼長度至少六位以上"
                                                placeholder="再次輸入新密碼"
                                                /> { }
                                        </TagShowAndHide>
                                        <EditButton
                                            view_mode={pp.pw_view_mode}
                                            other={pp.email_view_mode}
                                            keyname="pw"
                                            name="變更密碼"
                                            update={this.updatePW.bind(this) }
                                            cancel={this.cancelPW.bind(this) }/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </fieldset>
                </form>
                <form onSubmit={this.handleSubmit}>
                    <fieldset className="m-b-48">
                        <legend>會員資料修改</legend>
                        <table className="full">
                            <tbody>
                                <tr>
                                    <td className="item">姓名</td>
                                    <td>
                                        <InputText
                                            type="text"
                                            value={field.c_name}
                                            inputViewMode={view_mode}
                                            onChange={this.chgVal.bind(this, 'c_name') }
                                            required={true}
                                            maxLength={64}
                                            />
                                    </td>
                                    <td className="item">性別</td>
                                    <td>
                                        {
                                            IGenderData.map((item, i) => {
                                                return <span className="radio-group" key={i}>
                                                    <input type="radio" name="sex" id={"gender-" + i}
                                                        value={item.val} checked={item.val == field.gender}
                                                        onChange= {this.chgGender.bind(this, 'gender') } />
                                                    <label htmlFor={"gender-" + i} className="icon"></label>{item.Lname}
                                                </span>;
                                            })
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className="item">生日</td>
                                    <td>
                                        <DatetimeInput
                                            inputProps={InputProps}
                                            locale={"zh-TW"}
                                            timeFormat={false}
                                            value={field.birthday}
                                            dateFormat={config.dateFT}
                                            onChange={this.chgDate.bind(this, 'birthday') }
                                            />
                                    </td>
                                    <td className="item">手機</td>
                                    <td>
                                        <InputText
                                            type="tel"
                                            value={field.mobile}
                                            inputViewMode={view_mode}
                                            onChange={this.chgVal.bind(this, 'mobile') }
                                            required={true}
                                            maxLength={32}
                                            />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="item">地址</td>
                                    <td colSpan="3">
                                        <InputText
                                            type="text"
                                            inputClassName="input-size-md"
                                            value={field.zip}
                                            inputViewMode={view_mode}
                                            onChange={this.chgVal.bind(this, 'zip') }
                                            required={true}
                                            patternString="^[0-9]*$"
                                            maxLength={5}
                                            placeholder="郵遞區號"
                                            /> { }
                                        <InputText
                                            type="text"
                                            inputClassName="input-size-xl"
                                            value={field.address}
                                            inputViewMode={view_mode}
                                            onChange={this.chgVal.bind(this, 'address') }
                                            required={true}
                                            maxLength={256}
                                            />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <footer className="submit text-center">
                            <PWButton className="btn font-lg p-y-12 p-x-48" type="submit" enable={true}>{UIText.save}</PWButton>
                        </footer>
                    </fieldset>
                </form>
            </div>
        );
        return out_html;
    }
}


