import React = require('react');
import ReactDOM = require('react-dom');
import CommFunc = require('comm-func');

namespace Login {

    export class GridForm extends React.Component<any,
        {
            field: { account?: string, password?: string, validate?: string, rememberme?: boolean },
            validateUrl?: string
        }>
    {
        constructor() {
            super();
            this.render = this.render.bind(this);
            this.onChange = this.onChange.bind(this);
            this.onChangeUpper = this.onChangeUpper.bind(this);
            this.getValidateUrl = this.getValidateUrl.bind(this);
            this.reLoadValidateUrl = this.reLoadValidateUrl.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);

            this.state = {
                field: {
                    account: debug_account,
                    password: debug_password,
                    validate: debug_validate
                },
                validateUrl: this.getValidateUrl()
            }
        }
        static defaultProps: BaseDefine.GridFormPropsBase = {
        }
        onChange(name, e) {
            let input: HTMLInputElement = e.target as HTMLInputElement;
            let obj = this.state.field;
            obj[name] = input.value;
            this.setState({ field: obj });
        }
        onChangeUpper(e) {
            let input: HTMLInputElement = e.target as HTMLInputElement;
            let obj = this.state.field;
            obj.validate = input.value.toUpperCase();
            this.setState({ field: obj });
        }
        getValidateUrl() {
            return gb_approot + '_Code/Ashx/ValidateCode.ashx?vn=CheckCode&t=' + CommFunc.uniqid();
        }
        reLoadValidateUrl() {
            let obj = this.state;
            obj.validateUrl = this.getValidateUrl();
            obj.field.validate = null;
            this.setState(obj);
        }
        handleSubmit(e) {
            e.preventDefault();

            var data = {
                account: this.state.field.account,
                password: this.state.field.password,
                validate: $("#g-recaptcha-response").val(),//this.state.field.validate,
                rememberme: this.state.field.rememberme,
                lang: 'zh-TW'
            };

            $("body").mask("檢查中請稍後...");
            var jqxhr = $.ajax({
                type: "POST",
                url: gb_approot + 'Base/Login/ajax_Login',
                data: data,
                dataType: 'json'
            })
                .done((data, textStatus, jqXHRdata) => {
                    if (data.result) {
                        document.location.href = data.url;
                    } else {
                        let obj = this.state;
                        obj.validateUrl = this.getValidateUrl();
                        obj.field.password = '';
                        this.setState(obj);
                        $("body").unmask();
                        alert(data.message);
                    }
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    $("body").unmask();
                    CommFunc.showAjaxError(errorThrown);
                }

                );
            return;
        }
        render() {

            return (
                <div>
                    <form className="form form-sm" onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <h3 className="h3">System Login</h3>
                        </div>
                        <div className="form-group">
                            <label>帳號 Username</label>
                            <input className="form-control"
                                type="text"
                                value={this.state.field.account}
                                tabIndex={1}
                                placeholder="帳號"
                                onChange={this.onChange.bind(this, 'account') }
                                required />
                        </div>
                        <div className="form-group">
                            <label>密碼 Password</label>
                            <input className="form-control"
                                type="password"
                                value={this.state.field.password}
                                tabIndex={2}
                                placeholder="密碼"
                                onChange={this.onChange.bind(this, 'password') }
                                required />
                        </div>
                        <div className="form-group">
                            <label>驗證碼 Code</label>
                            <div id="Validate"></div>
                            {/*<div className="row">
                                <div className="col-xs-3">
                                    <img alt="驗證碼" src={this.state.validateUrl} />
                                </div>
                                <div className="col-xs-5">
                                    <input type="text"
                                        className="form-control"
                                        tabIndex={3}
                                        onChange={this.onChangeUpper}
                                        value={this.state.field.validate}
                                        required
                                        placeholder="驗證碼" />
                                </div>
                                <div className="col-xs-4">
                                    <button className="btn btn-sm btn-warning"
                                        type="button"
                                        tabIndex={-1}
                                        onClick={this.reLoadValidateUrl}>
                                        <i className="fa-refresh"></i> 重取
                                    </button>
                                </div>
                            </div>*/}
                        </div>
                        <div className="form-group form-action text-xs-center">
                            <button className="btn btn-sm btn-info" tabIndex={4} type="submit">登入 LOGIN</button>
                        </div>
                    </form>
                </div>
            );
        }
    }
}

var dom = document.getElementById('login-box');
ReactDOM.render(<Login.GridForm  />, dom);