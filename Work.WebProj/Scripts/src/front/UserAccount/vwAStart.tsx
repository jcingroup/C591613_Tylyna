import React = require('react');
import Moment = require('moment');
import {TagShowAndHide, InputText, RadioBox, PWButton} from '../../components';
import {ac_type_comm} from '../../action_type';
import {fmt_money, makeInputValue} from '../../ts-comm/comm-func';
import {config} from '../../ts-comm/def-data';
import {IGenderData, InputProps} from './pub';

import DatetimeInput = require("react-datetime");
import 'react-datetime/css/react-datetime.css';

export class AStart extends React.Component<any, any>{

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
    render() {
        let out_html: JSX.Element = null;
        let main_html: JSX.Element = null;
        let field: server.Customer = this.props.field;
        let view_mode: InputViewMode = InputViewMode.edit;

        out_html = (
            <div className="account-data">
                <fieldset className="m-b-48">
                    <legend>登入設定</legend>
                    <table className="full">
                        <tbody>
                            <tr>
                                <td className="item">帳號(E-mail) </td>
                                <td>
                                    {/*xxx @gmail.com
                                <button className="btn font-sm bg-danger m-l-16">變更信箱</button>
                                @* 按下變更後，上列mail隱藏，出現下列
                                <input type="email" value="xxx@gmail.com" />
                                <br />
                                <button className="btn font-sm bg-danger m-l-16">確定變更</button>
                                <button className="btn font-sm bg-muted m-l-16">取消</button> */}
                                </td>
                            </tr>
                            <tr>
                                <td className="item">密碼</td>
                                <td>
                                    {/* <button className="btn font-sm bg-danger">變更密碼</button>
                                @* 按下變更後，上列mail隱藏，出現下列
                                <input type="password" placeholder="請輸入舊密碼" />
                                <input type="password" placeholder="請輸入新密碼" />
                                <input type="password" placeholder="再次輸入新密碼" />
                                <br />
                                <button className="btn">儲存</button> */}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </fieldset>
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
                            <button className="btn font-lg p-y-12 p-x-48" type="submit">儲存</button>
                        </footer>
                    </fieldset>
                </form>
            </div>
        );
        return out_html;
    }
}


