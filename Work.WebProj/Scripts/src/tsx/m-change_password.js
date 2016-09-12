"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ReactDOM = require('react-dom');
var CommFunc = require('comm-func');
var ChangePasswrod;
(function (ChangePasswrod) {
    var GridForm = (function (_super) {
        __extends(GridForm, _super);
        function GridForm() {
            _super.call(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.componentDidMount = this.componentDidMount.bind(this);
            this.changePValue = this.changePValue.bind(this);
            this.setInputValue = this.setInputValue.bind(this);
            this.render = this.render.bind(this);
            this.state = {
                pram: { OldPassword: null, NewPassword: null, ConfirmPassword: null }
            };
        }
        GridForm.prototype.componentDidMount = function () {
        };
        GridForm.prototype.handleSubmit = function (e) {
            e.preventDefault();
            CommFunc.jqPost(this.props.updatePathName, this.state.pram)
                .done(function (data, textStatus, jqXHRdata) {
                if (data.result) {
                    CommFunc.tosMessage(null, '修改完成', 1);
                }
                else {
                    alert(data.message);
                }
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
                CommFunc.showAjaxError(errorThrown);
            });
            return;
        };
        GridForm.prototype.handleOnBlur = function (date) {
        };
        GridForm.prototype.changePValue = function (name, e) {
            this.setInputValue(this.props.PName, name, e);
        };
        GridForm.prototype.setInputValue = function (collentName, name, e) {
            var input = e.target;
            var obj = this.state[collentName];
            if (input.value == 'true') {
                obj[name] = true;
            }
            else if (input.value == 'false') {
                obj[name] = false;
            }
            else {
                obj[name] = input.value;
            }
            this.setState({ pram: obj });
        };
        GridForm.prototype.render = function () {
            var outHtml = null;
            var pram = this.state.pram;
            outHtml = (React.createElement("div", null, React.createElement("h3", {className: "h3"}, " ", this.props.caption), React.createElement("form", {className: "form form-sm", onSubmit: this.handleSubmit}, React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-2 form-control-label text-xs-right"}, React.createElement("small", {className: "text-danger"}, "*"), " 目前密碼"), React.createElement("div", {className: "col-xs-5"}, React.createElement("input", {className: "form-control", type: "password", value: pram.OldPassword, onChange: this.changePValue.bind(this, 'OldPassword'), maxLength: 16, required: true}))), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-2 form-control-label text-xs-right"}, React.createElement("small", {className: "text-danger"}, "*"), " 新密碼"), React.createElement("div", {className: "col-xs-5"}, React.createElement("input", {className: "form-control", type: "password", value: pram.NewPassword, onChange: this.changePValue.bind(this, 'NewPassword'), maxLength: 16, required: true}))), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-2 form-control-label text-xs-right"}, React.createElement("small", {className: "text-danger"}, "*"), " 確認新密碼"), React.createElement("div", {className: "col-xs-5"}, React.createElement("input", {className: "form-control", type: "password", value: pram.ConfirmPassword, onChange: this.changePValue.bind(this, 'ConfirmPassword'), maxLength: 16, required: true}))), React.createElement("div", {className: "form-action"}, React.createElement("div", {className: "col-xs-offset-2"}, React.createElement("button", {type: "submit", className: "btn btn-sm btn-primary"}, React.createElement("i", {className: "fa-check"}), " 儲存"))))));
            return outHtml;
        };
        GridForm.defaultProps = {
            PName: 'pram',
            updatePathName: gb_approot + 'Base/Users/aj_MasterPasswordUpdate'
        };
        return GridForm;
    }(React.Component));
    ChangePasswrod.GridForm = GridForm;
})(ChangePasswrod || (ChangePasswrod = {}));
var dom = document.getElementById('page_content');
ReactDOM.render(React.createElement(ChangePasswrod.GridForm, {caption: gb_caption, menuName: gb_menuname, iconClass: "fa-list-alt"}), dom);
