"use strict";
const React = require('react');
const ReactDOM = require('react-dom');
const CommFunc = require('comm-func');
const ajax_1 = require('../ts-comm/ajax');
var Login;
(function (Login) {
    class GridForm extends React.Component {
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
            };
        }
        onChange(name, e) {
            let input = e.target;
            let obj = this.state.field;
            obj[name] = input.value;
            this.setState({ field: obj });
        }
        onChangeUpper(e) {
            let input = e.target;
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
                validate: $("#g-recaptcha-response").val(),
                rememberme: this.state.field.rememberme,
                lang: 'zh-TW'
            };
            $("body").mask("檢查中請稍後...");
            ajax_1.fetchPost(gb_approot + 'Base/Login/ajax_NewLogin', data)
                .then((data) => {
                $("body").unmask();
                if (data.result) {
                    document.location.href = data.url;
                }
                else {
                    let obj = this.state;
                    grecaptcha.reset(widgetId);
                    obj.validateUrl = this.getValidateUrl();
                    obj.field.password = '';
                    this.setState(obj);
                    alert(data.message);
                }
            })
                .catch((reason) => { $("body").unmask(); });
            return;
        }
        render() {
            return (React.createElement("div", null, React.createElement("form", {className: "form form-sm", onSubmit: this.handleSubmit}, React.createElement("div", {className: "form-group"}, React.createElement("h3", {className: "h3"}, "System Login")), React.createElement("div", {className: "form-group"}, React.createElement("label", null, "帳號 Username"), React.createElement("input", {className: "form-control", type: "text", value: this.state.field.account, tabIndex: 1, placeholder: "帳號", onChange: this.onChange.bind(this, 'account'), required: true})), React.createElement("div", {className: "form-group"}, React.createElement("label", null, "密碼 Password"), React.createElement("input", {className: "form-control", type: "password", value: this.state.field.password, tabIndex: 2, placeholder: "密碼", onChange: this.onChange.bind(this, 'password'), required: true})), React.createElement("div", {className: "form-group"}, React.createElement("label", null, "驗證碼 Code"), React.createElement("div", {id: "Validate"})), React.createElement("div", {className: "form-group form-action text-xs-center"}, React.createElement("button", {className: "btn btn-sm btn-info", tabIndex: 4, type: "submit"}, "登入 LOGIN")))));
        }
    }
    GridForm.defaultProps = {};
    Login.GridForm = GridForm;
})(Login || (Login = {}));
var dom = document.getElementById('login-box');
ReactDOM.render(React.createElement(Login.GridForm, null), dom);
