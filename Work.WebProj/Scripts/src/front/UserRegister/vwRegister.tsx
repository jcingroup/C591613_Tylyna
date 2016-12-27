import React = require('react');
import Moment = require('moment');
import {InputText, PWButton} from '../../components';
import {ac_type_comm} from '../../action_type';
import {config, UIText} from '../../ts-comm/def-data';

export class Register extends React.Component<any, any>{

    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
        };
    }
    chgVal(name: string, value: any, e: React.SyntheticEvent) {
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
        let pp = this.props;
        let field: server.Customer = pp.field;
        let view_mode: InputViewMode = InputViewMode.edit;

        out_html = (
            <div>
                <h2>新會員註冊</h2>

                <form className="register text-left m-t-48" onSubmit={this.handleSubmit}>
                    <dl className="row">
                        <dt className="col-2">E-mail</dt>
                        <dd className="col-5">
                            <InputText
                                type="email"
                                value={field.email}
                                inputViewMode={view_mode}
                                onChange={this.chgVal.bind(this, 'email') }
                                required={true}
                                maxLength={128}
                                inputClassName="form-element"
                                patternString="[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}[.]{1}[a-zA-Z]{2,}(?:[.]{1}[a-zA-Z]{2,}|)$"
                                patternInfo="Email格式錯誤,請修正!\n帳號長度至上3個字元以上\n「@」符號後面須為一個網域名稱"
                                placeholder="請填寫常用的電子信箱，未來將以此做為預設登入帳號"
                                />
                        </dd>
                        <dd className="col-5 text-danger">* 必填</dd>
                    </dl>
                    <dl className="row">
                        <dt className="col-2">姓名</dt>
                        <dd className="col-5">
                            <InputText
                                type="text"
                                inputClassName="form-element"
                                value={field.c_name}
                                inputViewMode={view_mode}
                                onChange={this.chgVal.bind(this, 'c_name') }
                                required={true}
                                maxLength={64}
                                placeholder="預設為會員名稱"
                                />
                        </dd>
                        <dd className="col-5 text-danger">* 必填</dd>
                    </dl>
                    <dl className="row">
                        <dt className="col-2">手機</dt>
                        <dd className="col-5">
                            <InputText
                                type="tel"
                                inputClassName="form-element"
                                value={field.mobile}
                                inputViewMode={view_mode}
                                onChange={this.chgVal.bind(this, 'mobile') }
                                required={true}
                                maxLength={32}
                                placeholder="預設為會員初次登錄密碼"
                                />
                        </dd>
                        <dd className="col-5 text-danger">* 必填</dd>
                    </dl>
                    <dl className="row">
                        <dt className="col-2">聯絡電話</dt>
                        <dd className="col-5">
                            <InputText
                                type="tel"
                                inputClassName="form-element"
                                value={field.tel}
                                inputViewMode={view_mode}
                                onChange={this.chgVal.bind(this, 'tel') }
                                maxLength={32}
                                required={false}
                                />
                        </dd>
                    </dl>
                    <dl className="row">
                        <dt className="col-2">地址</dt>
                        <dd className="col-2">
                            <InputText
                                type="text"
                                inputClassName="form-element"
                                value={field.zip}
                                inputViewMode={view_mode}
                                onChange={this.chgVal.bind(this, 'zip') }
                                required={false}
                                patternString="^[0-9]*$"
                                maxLength={5}
                                placeholder="請輸入郵遞區號"
                                /> { }
                        </dd>
                        <dd className="col-8">
                            <InputText
                                type="text"
                                inputClassName="form-element"
                                value={field.address}
                                inputViewMode={view_mode}
                                onChange={this.chgVal.bind(this, 'address') }
                                required={false}
                                maxLength={256}
                                />
                        </dd>
                    </dl>
                    <footer className="submit text-center">
                        <PWButton className="btn font-lg p-y-12 p-x-48" enable={true} type="submit">註冊</PWButton>
                    </footer>
                </form>
            </div>
        );
        return out_html;
    }
}


